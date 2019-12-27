import {Request, Response} from "express";

import {DbHelpers} from "../lib/db/mongoDb/DbHelpers";
import {Skill} from "../lib/db/postgresSQL/models/Skill";
import {Topic} from "../lib/db/postgresSQL/models/Topic";
import {Test} from "../lib/init/Test";

const dbHelpers = new DbHelpers();

class TestingController {

    public static start = async (req: Request, res: Response) => {
        const userId = res.locals.jwtPayload.userId;
        const topicId = req.query.topicId;

        try {
            // initiate base position in db
            await dbHelpers.createTestPositionRecord(topicId, userId);

            const test = new Test();

            const topicRecord = await Topic.findByPk(topicId);

            if (topicRecord) {

                const minBound = topicRecord.minTestNum;
                const maxBound = topicRecord.maxTestNum;

                const skills = await Skill.findAll({where: {topicId}});

                if (skills) {
                    const skillIds = skills.map((skill) => skill.id);

                    const questions = await dbHelpers.findCoveredQuestions(skillIds);

                    if (questions) {
                        const coverable = await dbHelpers.findCoverableSkills(topicId);
                        if (coverable) {
                            test.init(questions, coverable.skills, minBound, maxBound);
                            const resQuestions = test.graph[0].questions;
                            res.status(200).send({body: resQuestions});
                        } else {
                            res.status(500).send({message: "Failed to find coverable skills for test"});
                            return;
                        }
                    } else {
                        res.status(500).send({message: "Failed to fetch question for given skills"});
                        return;
                    }


                } else {
                    res.status(500).send({message: "Failed to fetch skills for given topic"});
                    return;
                }
            } else {
                res.status(500).send({message: "Failed to load topic record"});
                return;
            }

        } catch (e) {
            console.log(e);
            res.status(500).send({message: JSON.stringify(e)});
        }
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
