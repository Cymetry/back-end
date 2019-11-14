import {Router} from 'express';
import {SkillLearn} from "../lib/init/SkillLearn";

export const procedures = Router();


import connect from "../lib/db/mongoDb/connect";
import {DbHelpers} from "../lib/db/mongoDb/DbHelpers";

procedures.get('/start', async function (req, res, next) {

    await connect({db: 'mongodb://localhost:27017/cymetry'});

    const dbHelpers = new DbHelpers();
    await dbHelpers.createPositionRecord(req.query.procedureId, 'head', 0);

    let process;

    if (req.query.skillId === 's1') {
        process = new SkillLearn().getPythagorasInstance('', '');
    }


    res.send({statusCode: 200, message: process.head.name});
});


procedures.post('/resume', async function (req, res, next) {


});

