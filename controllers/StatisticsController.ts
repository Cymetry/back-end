import {Request, Response} from "express";

import {DbHelpers} from "../lib/db/mongoDb/DbHelpers";
import statistics from "../lib/db/mongoDb/models/Statistics";

const dbHelpers = new DbHelpers();

class StatisticsControler {

    public static getStatistics = async (req: Request, res: Response) => {
        const userId = res.locals.jwtPayload.userId;

        try {
            const stats = await dbHelpers.getStatistics(userId);

            if(stats) {
                res.status(200).send(stats);
            } else {
                res.status(500).send({body: "No stats found"});
            } 
        } catch (e) {
            console.log(e);
            res.status(500).send({message: JSON.stringify(e)});
        }
    }

    public static createStatistics = async (req: Request, res: Response) => {
        const userId = res.locals.jwtPayload.userId;

        try {
            const record = await dbHelpers.createStatistics(userId, 0.75, 0.75, 0.75, 0.75);
            res.status(200).send(record);
        } catch (e) {
            console.log(e);
            res.status(500).send({message: JSON.stringify(e)});
        }

    }

    public static updateKnowledge = async (req: Request, res: Response) => {
        const userId = res.locals.jwtPayload.userId;
        const correctCount = req.query.correctCount;
        const stepsCount = req.query.stepsCount;

        try {

            let knowledge;
            const result = correctCount/stepsCount;

            if (result < 0.4) {
                knowledge = 0.4;
            } else if (result > 1) {
                knowledge = 1;
            } else {
                knowledge = result;
            }

            await statistics.updateOne({userId}, {knowledge});
            res.status(200).send({knowledge});

        } catch (e) {
            console.log(e);
            res.status(500).send({message: JSON.stringify(e)});
        }
    }

    public static updateAccuracy = async (req: Request, res: Response) => {
        const userId = res.locals.jwtPayload.userId;
        const mistakeCount = req.query.mistakeCount;
        const stepsCount = req.query.stepsCount;

        try {
            let accuracy;
            const result = mistakeCount/stepsCount;

            if (result < 0.4) {
                accuracy = 0.4;
            } else if (result > 1) {
                accuracy = 1;
            } else {
                accuracy = result;
            }

            await statistics.updateOne({userId}, {accuracy});
            res.status(200).send({accuracy});
        } catch (e) {
            console.log(e);
            res.status(500).send({message: JSON.stringify(e)});
        }
    }

    public static updateLogics = async (req: Request, res: Response) => {
        const userId = res.locals.jwtPayload.userId;
        const correctAnswers = req.query.correctAnswers;
        const allAnswers = req.query.allAnswers;

        try {
            let logics;
            const result = correctAnswers/allAnswers;
            if (result < 0.4) {
                logics = 0.4;
            } else if (result > 1) {
                logics = 1;
            } else {
                logics = result;
            }

            await statistics.updateOne({userId}, {logics});
            res.status(200).send({logics});

        } catch (e) {
            console.log(e);
            res.status(500).send({message: JSON.stringify(e)});
        }
    }

    public static updateSpeed = async (req: Request, res: Response) => {
        const userId = res.locals.jwtPayload.userId;
        const skillsComplete = req.query.skillsComplete;
        const skillAttempts = req.query.skillAttempts;

        try {
            let speed;
            const result = skillAttempts/(skillAttempts + skillsComplete);

            if (result < 0.4) {
                speed = 0.4;
            } else if (result > 1) {
                speed = 1;
            } else {
                speed = result;
            }

            await statistics.updateOne({userId}, {speed});
            res.status(200).send({speed});

        } catch (e) {
            console.log(e);
            res.status(500).send({message: JSON.stringify(e)});
        }
    }
}

export default StatisticsControler;