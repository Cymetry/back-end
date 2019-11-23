import {SkillLearn} from "../lib/init/SkillLearn";


import {Router} from "express";

export const skillLearning = Router();

import {DbHelpers} from "../lib/db/mongoDb/DbHelpers";

const dbHelpers = new DbHelpers();


skillLearning.post("/create", async (req, res, next) => {

    const {problems, videoUrl, skillRef} = req.body;
    const problemRecords: any[] = [];
    try {
        problems.forEach(async (problem) => {
            const ref = await dbHelpers.createProblemRecord(problem.content);
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
            const process = new SkillLearn().getPythagorasInstance(
                skillLearningRecord.problems.filter(
                    (problem) => problem.name === "Guided problem 3")[0].problemRef,
                skillLearningRecord.video.url,
            );

            // retrieve current node's content
            const problemRecord = await dbHelpers.getProblemById(process[0].dbRef);

            res.send({statusCode: 200, content: problemRecord.content});
        } else {
            res.send({statusCode: 500, message: "Missing skill record on db"});
        }
    } catch (e) {
        console.error(e);
        res.send({statusCode: 500, message: JSON.stringify(e)});
    }
});

skillLearning.put("/saveProgress", async (req, res, next) => {
    const {skillId, userId, score} = req.body;

    try {
        const updated = await dbHelpers.updatePositionRecord(userId, skillId, score);
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

        // retrieve record from db
        const skillLearningRecord = await dbHelpers.getProcessRecordBySkillRef(skillId);

        // sync with process wizard
        if (skillLearningRecord) {

            process[currentPosition.lastPosition].currentScore = currentPosition.currentScore;

            const process = new SkillLearn().getPythagorasInstance(
                skillLearningRecord.problems.filter(
                    (problem) => problem.name === "Guided problem 3")[0].problemRef,
                skillLearningRecord.video.url,
            );


            let problemRecord;
            if (currentPosition.isFinished) {
                problemRecord = await dbHelpers.getProblemById(process[currentPosition.lastPosition].next);
            } else {
                problemRecord = await dbHelpers.getProblemById(process[currentPosition.lastPosition]);
            }


            if (problemRecord) {
                res.send({statusCode: 200, content: problemRecord.content});
            } else {
                res.send({statusCode: 500, message: "Missing skill record on db"});
            }


        }


    } catch (e) {
        console.error(e);
        res.send({statusCode: 500, message: JSON.stringify(e)});
    }
});

