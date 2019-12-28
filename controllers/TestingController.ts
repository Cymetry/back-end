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

            const test = new Test([], [], [], []);

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
        const userId = res.locals.jwtPayload.userId;
        const topicId = req.query.topicId;

        try {

            const currentRecord = await dbHelpers.getTestPositionRecord(userId, topicId);

            const topicRecord = await Topic.findByPk(topicId);


            if (currentRecord) {
                let test;
                // if round 3 is finished
                if (currentRecord.lastPosition >= 2 && currentRecord.isFinished) {
                    test = new Test([], [], currentRecord.wrongAnswers, currentRecord.correctAnswers);
                } else {
                    test = new Test(currentRecord.wrongAnswers, currentRecord.correctAnswers, [], []);
                }

                if (test.graph[currentRecord.lastPosition].name === "Test complete") {
                    res.status(200).send({message: "Test has been completed"});
                    return;
                }

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

                                if (currentRecord.isFinished &&
                                    test.graph[currentRecord.lastPosition].next().node.name === "Test complete") {
                                    await dbHelpers.updateProgress(
                                        topicId,
                                        userId,
                                        test.graph[currentRecord.lastPosition].next().index);
                                    res.status(200).send({message: "Test Complete!"});
                                    return;
                                } else {
                                    if (currentRecord.isFinished) {
                                        await dbHelpers.updateProgress(
                                            topicId,
                                            userId,
                                            test.graph[currentRecord.lastPosition].next().index);

                                        const resQuestions = test.graph[currentRecord.lastPosition]
                                            .next().node.questions;
                                        if (questions) {
                                            res.status(200).send({
                                                answers: test.graph[currentRecord.lastPosition].next().node.solution,
                                                body: resQuestions,
                                                weakSet: test.graph[currentRecord.lastPosition].next().node.weakSet,
                                            });
                                        } else {
                                            res.status(500).send({message: "No questions found!"});
                                        }
                                    } else {
                                        const resQuestions = test.graph[currentRecord.lastPosition].questions;
                                        if (questions) {
                                            res.status(200).send({
                                                answers: test.graph[currentRecord.lastPosition].solution,
                                                body: resQuestions,
                                                weakSet: test.graph[currentRecord.lastPosition].weakSet,
                                            });
                                        } else {
                                            res.status(500).send({message: "No questions found!"});
                                        }
                                    }

                                }
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


            } else {
                res.status(400).send({message: "Missing position record please refer to start endpoint"});
                return;
            }


        } catch (e) {
            console.error(e);
            res.status(500).send({message: JSON.stringify(e)});
        }
    }

    public static check = async (req: Request, res: Response) => {
        const userId = res.locals.jwtPayload.userId;
        const topicId = req.query.topicId;

        try {
            const currentRecord = await dbHelpers.getTestPositionRecord(userId, topicId);
            if (currentRecord) {
                if (currentRecord.isFinished) {
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
