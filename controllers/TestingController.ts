import {Request, Response} from "express";

import {DbHelpers} from "../lib/db/mongoDb/DbHelpers";
import {Skill} from "../lib/db/postgresSQL/models/Skill";
import {Topic} from "../lib/db/postgresSQL/models/Topic";
import {SkillTest} from "../lib/init/SkillTest";

const dbHelpers = new DbHelpers();

class TestingController {

    public static defineSkills = async (req: Request, res: Response) => {
        const topicId = req.query.topicId;
        const {skills} = req.body;

        try {
            const record = await dbHelpers.addCoverableSkills(topicId, skills);
            if (record) {
                res.status(200).send(record);
            } else {
                res.status(500).send({message: "could not create record"});
            }
        } catch (e) {
            console.log(e);
            res.status(500).send({message: JSON.stringify(e)});
        }
    }

    public static start = async (req: Request, res: Response) => {
        const userId = res.locals.jwtPayload.userId;
        const topicId = req.query.topicId;

        try {
            // initiate base position in db
            await dbHelpers.createTestPositionRecord(topicId, userId);

            const test = new SkillTest([], [], [], []);

            const topicRecord = await Topic.findByPk(topicId);

            if (topicRecord) {

                const minBound = topicRecord.minTestNum;

                const skills = await Skill.findAll({where: {topicId}});

                if (skills) {
                    const skillIds = skills.map((skill) => skill.id);

                    const questions = await dbHelpers.findCoveredQuestions(skillIds);

                    if (questions) {
                        const coverable = await dbHelpers.findCoverableSkills(topicId);
                        if (coverable) {
                            test.init(questions, coverable.skills, minBound);
                            const resQuestions = test.graph[0].questions;
                            res.status(200).send(JSON.stringify({
                                body: resQuestions.map((question) => {
                                    return {
                                        answers: question.answers,
                                        difficulty: question.difficulty,
                                        fillIn: question.fillIn,
                                        graphs: question.graphs,
                                        id: question._id,
                                        options: question.options,
                                        question: question.question,
                                        score: question.score,
                                    };
                                }),
                                round: test.graph[0].name,
                            }));
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
                const wrongs = await dbHelpers.getQuestionsByIds(currentRecord.wrongAnswers);
                const corrects = await dbHelpers.getQuestionsByIds(currentRecord.correctAnswers);

                if (currentRecord.lastPosition >= 2 && currentRecord.isFinished) {
                    test = new SkillTest([], [], wrongs, corrects);
                } else {
                    test = new SkillTest(wrongs, corrects, [], []);
                }

                if (topicRecord && wrongs && corrects) {

                    const minBound = topicRecord.minTestNum;

                    const skills = await Skill.findAll({where: {topicId}});

                    if (skills) {
                        const skillIds = skills.map((skill) => skill.id);

                        const questions = await dbHelpers.findCoveredQuestions(skillIds);

                        if (questions) {
                            const coverable = await dbHelpers.findCoverableSkills(topicId);
                            if (coverable) {

                                test.init(questions, coverable.skills, minBound);

                                if (test.graph[currentRecord.lastPosition].name === "SkillTest complete") {
                                    res.status(200).send(JSON.stringify({message: "SkillTest has been completed"}));
                                    return;
                                }

                                if (currentRecord.isFinished &&
                                    test.graph[currentRecord.lastPosition].next().node.name === "SkillTest complete") {
                                    await dbHelpers.updateProgress(
                                        topicId,
                                        userId,
                                        test.graph[currentRecord.lastPosition].next().index);
                                    await dbHelpers.completeTest(userId, topicId);
                                    res.status(200).send(JSON.stringify({message: "SkillTest Complete!"}));
                                    return;
                                } else {
                                    if (currentRecord.isFinished) {
                                        await dbHelpers.updateProgress(
                                            topicId,
                                            userId,
                                            test.graph[currentRecord.lastPosition].next().index);

                                        const resQuestions = test.graph[currentRecord.lastPosition]
                                            .next().node.questions;
                                        await dbHelpers.updateProgressStatus(topicId, userId, false);
                                        if (questions) {
                                            res.status(200).send(JSON.stringify({
                                                answers: test.graph[currentRecord.lastPosition].next().node.solution,
                                                body: resQuestions.map((question) => {
                                                    return {
                                                        answers: question.answers,
                                                        difficulty: question.difficulty,
                                                        fillIn: question.fillIn,
                                                        graphs: question.graphs,
                                                        id: question._id,
                                                        options: question.options,
                                                        question: question.question,
                                                        score: question.score,
                                                    };
                                                }),
                                                round: test.graph[currentRecord.lastPosition].next().node.name,
                                                weakSet: test.graph[currentRecord.lastPosition].next().node.weakSet,
                                            }));
                                        } else {
                                            res.status(500).send({message: "No questions found!"});
                                        }
                                    } else {
                                        const resQuestions = test.graph[currentRecord.lastPosition].questions;
                                        if (questions) {
                                            const submission = await dbHelpers.getTestSubmission(
                                                userId,
                                                topicId,
                                                currentRecord.lastPosition);

                                            if (submission) {
                                                res.status(200).send(JSON.stringify({
                                                    answers: test.graph[currentRecord.lastPosition].solution,
                                                    body: resQuestions.map((question) => {
                                                        return {
                                                            answers: question.answers,
                                                            difficulty: question.difficulty,
                                                            fillIn: question.fillIn,
                                                            graphs: question.graphs,
                                                            id: question._id,
                                                            options: question.options,
                                                            question: question.question,
                                                            score: question.score,
                                                        };
                                                    }),
                                                    round: test.graph[currentRecord.lastPosition].name,
                                                    submission: submission.submissions,
                                                    weakSet: test.graph[currentRecord.lastPosition].weakSet,
                                                }));
                                            } else {
                                                res.status(200).send(JSON.stringify({
                                                    answers: test.graph[currentRecord.lastPosition].solution,
                                                    body: resQuestions.map((question) => {
                                                        return {
                                                            answers: question.answers,
                                                            difficulty: question.difficulty,
                                                            fillIn: question.fillIn,
                                                            graphs: question.graphs,
                                                            id: question._id,
                                                            options: question.options,
                                                            question: question.question,
                                                            score: question.score,
                                                        };
                                                    }),
                                                    round: test.graph[currentRecord.lastPosition].name,
                                                    submission: [],
                                                    weakSet: test.graph[currentRecord.lastPosition].weakSet,
                                                }));
                                            }
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
                    res.status(200).send({message: "Current Node is finished", task: "start"});
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
        const topicId = req.query.topicId;


        const {correctAnswers, wrongAnswers, isFinished} = req.body;

        try {
            const updated = await dbHelpers.updateTestPositionRecord(topicId, userId, correctAnswers, wrongAnswers,
                isFinished);
            res.status(200).send({record: JSON.stringify(updated)});
        } catch (e) {
            console.error(e);
            res.status(500).send({message: JSON.stringify(e)});
        }
    }
}

export default TestingController;
