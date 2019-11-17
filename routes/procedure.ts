import {Router} from "express";
import {SkillLearn} from "../lib/init/SkillLearn";

export const procedures = Router();

import {DbHelpers} from "../lib/db/mongoDb/DbHelpers";

procedures.get("/start", async (req, res, next) => {


    const dbHelpers = new DbHelpers();
    await dbHelpers.createPositionRecord(req.query.procedureId, "head", 0);

    let process;

    if (req.query.skillId === "s1") {
        process = new SkillLearn().getPythagorasInstance("", "");
    }


    res.send({statusCode: 200, message: process.head.name});
});


procedures.post("/resume", async (req, res, next) => {


});

