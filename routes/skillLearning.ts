import {SkillLearn} from "../lib/init/SkillLearn";


import {Router} from "express";

export const skillLearning = Router();

import {DbHelpers} from "../lib/db/mongoDb/DbHelpers";
import {Skill} from "../lib/db/postgresSQL/models/Skill";
import {checkJwt} from "../middlewares/checkJwt";
import {checkRole} from "../middlewares/checkRole";


const dbHelpers = new DbHelpers();


skillLearning.post("/create", [checkJwt, checkRole(["ADMIN"])], async (req, res, next) => {

    const {problems, videoUrl, skillRef} = req.body;
    try {
        const problemsPromises = Promise.all(problems.map(async (problem) => {
            const ref = await dbHelpers.createProblemRecord(problem.question, problem.name, problem.steps);
            return {
                name: problem.name,
                problemRef: ref._id,
            };
        }));

        problemsPromises.then(async (problemRecords) => {
            const videoRecord = await dbHelpers.createVideoRecord(videoUrl);
            const processRecord = await dbHelpers.createProcess(problemRecords, videoRecord, skillRef);
            if (processRecord) {
                res.status(200).send({
                    response: JSON.stringify(processRecord),
                });
            } else {
                res.status(200).send({
                    message: JSON.stringify("something went wrong"),
                });
            }
        });
    } catch (e) {
        console.error(e);
        res.status(500).send({
            message: JSON.stringify(e),
        });
    }

});

skillLearning.get("/start", [checkJwt], async (req, res, next) => {
    const userId = res.locals.jwtPayload.userId;
    const skillId = req.query.skillId;

    try {
        // init SkillLearning with 0 score
        await dbHelpers.createPositionRecord(skillId, 0, 0, userId, false, 0);

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
                    res.status(200).send({body: {content: problemRecord}});
                } else {
                    res.status(500).send({message: "No content found"});
                }
            } else {
                res.status(500).send({message: "Video is missing"});
            }
        } else {
            res.status(500).send({message: "Missing skill record on db"});
        }
    } catch (e) {
        console.error(e);
        res.status(500).send({message: JSON.stringify(e.message)});
    }
});

skillLearning.put("/saveProgress", [checkJwt], async (req, res, next) => {
    const userId = res.locals.jwtPayload.userId;
    const {skillId, mistakeCount, correctCount} = req.body;

    try {
        const updated = await dbHelpers.updatePositionRecord(userId, skillId, true, mistakeCount, correctCount);
        res.status(200).send({record: JSON.stringify(updated)});
    } catch (e) {
        console.error(e);
        res.status(500).send({message: JSON.stringify(e)});
    }

});

skillLearning.get("/check", [checkJwt], async (req, res, next) => {
    const userId = res.locals.jwtPayload.userId;
    const skillId = req.query.skillId;

    try {
        const currentPosition = await dbHelpers.getPositionRecord(userId, skillId);
        if (currentPosition) {
            if (currentPosition.isFinished) {
                res.status(200).send({message: "Current Node is finished", task: "resume"});
            } else {
                res.status(200).send({message: "Current Node is not finished", task: "resume"});
            }

        } else {
            res.status(200).send({message: "No record found", task: "start"});
        }
    } catch (e) {
        console.log(e);
        res.status(500).send({message: JSON.stringify(e)});
    }
});

skillLearning.get("/resume", [checkJwt], async (req, res, next) => {
    const userId = res.locals.jwtPayload.userId;
    const skillId = req.query.skillId;

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

                const skillLearn = new SkillLearn();
                skillLearn.init(gp1.problemRef, gp2.problemRef, gp3.problemRef, skillLearningRecord.video);

                if (skillLearn.graph[currentPosition.lastPosition].name === "Skill complete") {
                    res.status(200).send({message: "Skill has been completed"});
                    return;
                }

                skillLearn.graph[currentPosition.lastPosition].mistakeCount = currentPosition.mistakeCount;
                skillLearn.graph[currentPosition.lastPosition].correctCount = currentPosition.correctCount;

                let problemRecord;
                let givenRecord;

                if (currentPosition.isFinished &&
                    skillLearn.graph[currentPosition.lastPosition].next().node.name === "Skill complete") {
                    await dbHelpers.updatePositionRecordPosition(
                        userId,
                        skillId,
                        skillLearn.graph[currentPosition.lastPosition].next().index,
                    );

                    const skillRecord = await Skill.findByPk(parseInt(skillId, 10));
                    if (skillRecord) {
                        await dbHelpers.completeSkill(userId, skillRecord.topicId, skillId);
                    } else {
                        res.status(200).send({message: "Skill Complete, but progress has not been saved!"});
                    }

                    res.status(200).send({message: "Skill Complete!"});
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

                        if (skillLearn.graph[currentPosition.lastPosition].next().node.givenRef !== "") {
                            const current = await dbHelpers.getPositionRecord(userId, skillId);
                            if (current) {
                                givenRecord = await dbHelpers.getProblemById(
                                    skillLearn.graph[current.lastPosition].givenRef,
                                );
                            }
                        }

                    } else {
                        if (skillLearn.graph[currentPosition.lastPosition].name !== "Video tutorial") {
                            problemRecord = await dbHelpers.getProblemById(
                                skillLearn.graph[currentPosition.lastPosition].dbRef,
                            );

                            if (skillLearn.graph[currentPosition.lastPosition].givenRef !== "") {
                                const current = await dbHelpers.getPositionRecord(userId, skillId);
                                if (current) {
                                    givenRecord = await dbHelpers.getProblemById(
                                        skillLearn.graph[current.lastPosition].givenRef,
                                    );
                                }
                            }
                        } else {
                            problemRecord = await dbHelpers.getVideoById(
                                skillLearn.graph[currentPosition.lastPosition].dbRef,
                            );
                        }
                    }

                    let submission;
                    if (skillLearningRecord) {
                        submission = await dbHelpers.getSubmission(userId, skillLearningRecord._id);
                    }


                    if (problemRecord) {
                        const current = await dbHelpers.getPositionRecord(userId, skillId);
                        if (skillLearn.graph[currentPosition.lastPosition].name === "reentered"
                            && skillLearn.graph[currentPosition.lastPosition].next().node.name === "Guided problem 3"
                            && currentPosition.isFinished
                        ) {
                            res.status(200).send({
                                body: {
                                    content: problemRecord,
                                    given: givenRecord ? givenRecord : null,
                                    maxMistakes: current ? skillLearn.graph[current.lastPosition].maxMistakeCount
                                        : null,
                                    reentered: true,
                                },
                            });
                        } else {
                            res.status(200).send({
                                body: {
                                    content: problemRecord,
                                    given: givenRecord ? givenRecord : null,
                                    maxMistakes: current ? skillLearn.graph[current.lastPosition].maxMistakeCount
                                        : null,
                                    submission: submission ? submission.content.filter(
                                        (record) => record.problem === problemRecord.type) : null,
                                },
                            });
                        }

                    } else {
                        res.status(500).send({message: "Missing skill record on db"});
                    }
                }


            }
        } else {
            res.status(500).send({message: "Missing position record"});
        }


    } catch (e) {
        console.error(e);
        res.status(500).send({message: JSON.stringify(e)});
    }
});

