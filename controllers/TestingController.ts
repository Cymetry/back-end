import {Request, Response} from "express";

import {DbHelpers} from "../lib/db/mongoDb/DbHelpers";

const dbHelpers = new DbHelpers();

class TestingController {

    public static start = async (req: Request, res: Response) => {
        // todo
    }

    public static resume = async (req: Request, res: Response) => {
        // todo
    }

    public static check = async (req: Request, res: Response) => {
        const userId = res.locals.jwtPayload.userId;
        const topicId = req.query.topicId;

        try {
            const currentPosition = await dbHelpers.getTestPositionRecord(userId, topicId);
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
    }

    public static save = async (req: Request, res: Response) => {
        const userId = res.locals.jwtPayload.userId;
        const {topicId, correctAnswers, wrongAnswers} = req.body;

        try {
            const updated = await dbHelpers.updateTestPositionRecord(topicId, userId, correctAnswers, wrongAnswers);
            res.status(200).send({record: JSON.stringify(updated)});
        } catch (e) {
            console.error(e);
            res.status(500).send({message: JSON.stringify(e)});
        }
    }
}

export default TestingController;
