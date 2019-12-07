import {SkillLearn} from "../lib/init/SkillLearn";


import {Router} from "express";

export const skillLearning = Router();

import {DbHelpers} from "../lib/db/mongoDb/DbHelpers";

const dbHelpers = new DbHelpers();


skillLearning.post("/create", async (req, res, next) => {

    const {problems, videoUrl, skillRef} = req.body;
    const problemRecords: any[] = [];
    try {

        await problems.forEach(async (problem) => {
            const ref = await dbHelpers.createProblemRecord(problem.question, problem.name, problem.steps);
            problemRecords.push(
                {
                    name: problem.name,
                    problemRef: ref._id,
                });
        });

        const videoRecord = await dbHelpers.createVideoRecord(videoUrl);
        const processRecord = await dbHelpers.createProcess(problemRecords, videoRecord, skillRef);
        if (processRecord) {
            res.send({
                response: JSON.stringify(processRecord),
                statusCode: 200,
            });
        } else {
            res.send({
                message: JSON.stringify("something went wrong"),
                statusCode: 200,
            });
        }
    } catch (e) {
        console.error(e);
        res.send({
            message: JSON.stringify(e),
            statusCode: 500,
        });
    }

});

skillLearning.get("/start", async (req, res, next) => {

    const skillId = req.query.skillId;
    const userId = req.query.userId;

    try {
        // init SkillLearning with 0 score
        await dbHelpers.createPositionRecord(skillId, 0, 0, userId, false);

        // retrieve record from db
        const skillLearningRecord = await dbHelpers.getProcessRecordBySkillRef(skillId);

        // sync with process wizard
        if (skillLearningRecord) {
            const videoUrl = await dbHelpers.getVideoById(skillLearningRecord.video.toString());

            if (videoUrl) {
                // retrieve guided problem 1
                const gp1 = skillLearningRecord.problems.filter(
                    (problem) => problem.name === "Guided problem 1")[0];

                // retrieve guided problem 2
                const gp2 = skillLearningRecord.problems.filter(
                    (problem) => problem.name === "Guided problem 2")[0];

                // retrieve guided problem 3
                const gp3 = skillLearningRecord.problems.filter(
                    (problem) => problem.name === "Guided problem 3")[0];


                // needs to be redone for the whole tree
                // const process = new SkillLearn().getPythagorasInstance(gp3.problemRef, videoUrl);

                const skillLearn = new SkillLearn();
                skillLearn.init(gp1.problemRef, gp2.problemRef, gp3.problemRef, videoUrl);

                // retrieve current node's content
                const problemRecord = await dbHelpers.getProblemById(skillLearn.graph[0].dbRef);

                if (problemRecord) {
                    res.send({statusCode: 200, content: problemRecord});
                } else {
                    res.send({statusCode: 500, message: "No content found"});
                }
            } else {
                res.send({statusCode: 500, message: "Video is missing"});
            }
        } else {
            res.send({statusCode: 500, message: "Missing skill record on db"});
        }
    } catch (e) {
        console.error(e);
        res.send({statusCode: 500, message: JSON.stringify(e)});
    }
});

skillLearning.put("/saveProgress", async (req, res, next) => {
    const {skillId, userId, mistakeCount} = req.body;

    try {
        const updated = await dbHelpers.updatePositionRecord(userId, skillId, true, mistakeCount);
        res.send({statusCode: 200, record: JSON.stringify(updated)});
    } catch (e) {
        console.error(e);
        res.send({statusCode: 500, message: JSON.stringify(e)});
    }

});

skillLearning.get("/check", async (req, res, next) => {
    const skillId = req.query.skillId;
    const userId = req.query.userId;

    try {
        const currentPosition = await dbHelpers.getPositionRecord(userId, skillId);
        if (currentPosition) {
            if (currentPosition.isFinished) {
                res.send({statusCode: 200, message: "Current Node is finished", task: "resume"});
            } else {
                res.send({statusCode: 200, message: "Current Node is not finished", task: "resume"});
            }

        } else {
            res.send({statusCode: 200, message: "No record found", task: "start"});
        }
    } catch (e) {
        console.log(e);
        res.send({statusCode: 500, message: JSON.stringify(e)});
    }
});


skillLearning.get("/resume", async (req, res, next) => {

    const skillId = req.query.skillId;
    const userId = req.query.userId;

    try {
        // get user's current position
        const currentPosition = await dbHelpers.getPositionRecord(userId, skillId);

        if (currentPosition) {
            // retrieve record from db
            const skillLearningRecord = await dbHelpers.getProcessRecordBySkillRef(skillId);

            // sync with process wizard
            if (skillLearningRecord) {

                // retrieve guided problem 1
                const gp1 = skillLearningRecord.problems.filter(
                    (problem) => problem.name === "Guided problem 1")[0];

                // retrieve guided problem 2
                const gp2 = skillLearningRecord.problems.filter(
                    (problem) => problem.name === "Guided problem 2")[0];

                // retrieve guided problem 3
                const gp3 = skillLearningRecord.problems.filter(
                    (problem) => problem.name === "Guided problem 3")[0];

                // needs to be redone for the whole tree
                // const process = new SkillLearn().getPythagorasInstance(gp3.problemRef,
                //     skillLearningRecord.video,
                // );

                const skillLearn = new SkillLearn();
                skillLearn.init(gp1.problemRef, gp2.problemRef, gp3.problemRef, skillLearningRecord.video);


                if (skillLearn.graph[currentPosition.lastPosition].name === "Skill complete") {
                    res.send({statusCode: 200, message: "Skill has been completed"});
                    return;
                }

                skillLearn.graph[currentPosition.lastPosition].mistakeCount = currentPosition.mistakeCount;

                let problemRecord;
                let givenRecord;

                if (currentPosition.isFinished &&
                    skillLearn.graph[currentPosition.lastPosition].next().node.name === "Skill complete") {
                    await dbHelpers.updatePositionRecordPosition(
                        userId,
                        skillId,
                        skillLearn.graph[currentPosition.lastPosition].next().id,
                    );
                    res.send({statusCode: 200, message: "Skill Complete!"});
                } else {
                    if (currentPosition.isFinished) {
                        if (skillLearn.graph[currentPosition.lastPosition].next().node.name !== "Video tutorial") {
                            problemRecord = await dbHelpers.getProblemById(
                                skillLearn.graph[currentPosition.lastPosition].next().node.dbRef);
                        } else {
                            problemRecord = await dbHelpers.getVideoById(
                                skillLearn.graph[currentPosition.lastPosition].next().node.dbRef);
                        }

                        // update latest position
                        await dbHelpers.updatePositionRecordPosition(
                            userId,
                            skillId,
                            skillLearn.graph[currentPosition.lastPosition].next().index,
                        );

                    } else {
                        if (skillLearn.graph[currentPosition.lastPosition].name !== "Video tutorial") {
                            problemRecord = await dbHelpers.getProblemById(
                                skillLearn.graph[currentPosition.lastPosition].dbRef,
                            );

                            if (skillLearn.graph[currentPosition.lastPosition].givenRef !== "") {
                                givenRecord = await dbHelpers.getProblemById(
                                    skillLearn.graph[currentPosition.lastPosition].givenRef,
                                );
                            }
                        } else {
                            problemRecord = await dbHelpers.getVideoById(
                                skillLearn.graph[currentPosition.lastPosition].dbRef,
                            );
                        }
                    }

                    const submission = await dbHelpers.getSubmission(userId, skillLearningRecord._id);


                    if (problemRecord) {
                        if (skillLearn.graph[currentPosition.lastPosition].name === "reentered"
                            && skillLearn.graph[currentPosition.lastPosition].next().node.name === "Guided problem 3"
                            && currentPosition.isFinished
                        ) {
                            res.send({
                                content: problemRecord,
                                given: givenRecord ? givenRecord : null,
                                reentered: true,
                                statusCode: 200,
                            });
                        } else {
                            res.send({
                                content: problemRecord,
                                given: givenRecord ? givenRecord : null,
                                statusCode: 200,
                                submission: submission ? submission.content.filter(
                                    (record) => record.problem === problemRecord.type) : null,
                            });
                        }

                    } else {
                        res.send({statusCode: 500, message: "Missing skill record on db"});
                    }
                }


            }
        } else {
            res.send({statusCode: 500, message: "Missing position record"});
        }


    } catch (e) {
        console.error(e);
        res.send({statusCode: 500, message: JSON.stringify(e)});
    }
});

