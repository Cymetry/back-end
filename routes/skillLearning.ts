import {Router} from "express";
import {SkillLearn} from "../lib/init/SkillLearn";

export const skillLearning = Router();

import {DbHelpers} from "../lib/db/mongoDb/DbHelpers";


skillLearning.post("/create", async (req, res, next) => {


});

skillLearning.get("/start", async (req, res, next) => {

    const dbHelpers = new DbHelpers();
    // init SkillLearning with 0 score
    await dbHelpers.createPositionRecord(req.query.procedureId, "head", 0);

    let process;

    if (req.query.skillId === "pyth2019") {
        process = new SkillLearn().getPythagorasInstance("", "");
    }


    res.send({statusCode: 200, currentNode: process.head.name});
});


skillLearning.post("/resume", async (req, res, next) => {


});

