import {Router} from "express";
import {SkillLearn} from "../lib/init/SkillLearn";

export const skillLearning = Router();

import {DbHelpers} from "../lib/db/mongoDb/DbHelpers";

const dbHelpers = new DbHelpers();


skillLearning.post("/create", async (req, res, next) => {

    const {problems, videoUrl, skillRef} = req.body;
    const problemRecords: any[] = [];
    try {
        problems.forEach(async (problem) => problemRecords.push(await dbHelpers.createProblemRecord(problem.content)));
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

    // init SkillLearning with 0 score
    await dbHelpers.createPositionRecord(skillId, "head", 0);

    const skillLearningRecord = await dbHelpers.getProcessRecordBySkillRef(skillId);

    console.log(skillLearningRecord);

    const process = new SkillLearn().getPythagorasInstance("", "");


    res.send({statusCode: 200, currentNode: process.head.name});
});


skillLearning.post("/resume", async (req, res, next) => {
    // todo

});

