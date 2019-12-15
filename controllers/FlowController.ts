import {Request, Response} from "express";

import {DbHelpers} from "../lib/db/mongoDb/DbHelpers";
import {Curriculum} from "../lib/db/postgresSQL/models/Curriculum";
import {Program} from "../lib/db/postgresSQL/models/Program";
import {Skill} from "../lib/db/postgresSQL/models/Skill";
import {Topic} from "../lib/db/postgresSQL/models/Topic";


const dbHelpers = new DbHelpers();


class FlowController {

    public static loadPrograms = async (req: Request, res: Response) => {
        try {
            const programs = await Program.findAll();
            res.send(programs.map((program) => {
                return {
                    id: program.id,
                    name: program.name,
                };
            }));
        } catch (error) {
            res.status(404).send(error.message);
        }
    }

    public static loadCurriculumByProgram = async (req: Request, res: Response) => {
        const programId: number = parseInt(req.query.programId, 10);
        try {
            const curriculum = await Curriculum.findAll({where: {programId}});
            res.status(200).send(curriculum.map((row) => {
                return {id: row.id, name: row.name};
            }));
        } catch (error) {
            res.status(404).send(error.message);
        }
    }

    public static loadTopicsByCurriculum = async (req: Request, res: Response) => {
        const userId = res.locals.jwtPayload.userId;
        const curriculumId: number = parseInt(req.query.curriculumId, 10);
        try {
            const topics = await Topic.findAll({where: {curriculumId}});
            const mappedPromises = Promise.all(topics.map(async (topic) => {
                const progressRecord = await dbHelpers.getCompleteSkills(userId, topic.id);
                if (progressRecord) {
                    return {
                        complete: progressRecord.skillsComplete.length,
                        id: topic.id,
                        name: topic.name,
                        total: topic.skillCount,
                    };
                } else {
                    return {
                        complete: 0,
                        id: topic.id,
                        name: topic.name,
                        total: topic.skillCount,
                    };
                }
            }));

            mappedPromises.then((data) => {
                res.status(200).send(data);
            });
        } catch (error) {
            res.status(404).send(error.message);
        }
    }

    public static loadSkillsByTopic = async (req: Request, res: Response) => {
        const topicId: number = parseInt(req.query.topicId, 10);
        const userId = res.locals.jwtPayload.userId;
        try {
            const skills = await Skill.findAll({where: {topicId}});
            const progressRecord = await dbHelpers.getCompleteSkills(userId, topicId);
            const mapped = skills.map((skill) => {
                if (progressRecord) {
                    return {
                        complete: progressRecord.skillsComplete.includes(skill.id),
                        id: skill.id,
                        name: skill.name,
                    };
                } else {
                    return {
                        complete: false,
                        id: skill.id,
                        name: skill.name,
                    };
                }
            });
            res.status(200).send(mapped);

        } catch (error) {
            res.status(404).send(error.message);
        }
    }

    public static createProgram = async (req: Request, res: Response) => {
        const {name} = req.body;
        try {
            const record = await Program.create({name});
            await record.save();
            res.status(204).send();
        } catch (error) {
            res.status(409).send(error.message);
        }
    }

    public static editProgram = async (req: Request, res: Response) => {
        const id = parseInt(req.query.id, 10);
        const {name} = req.body;

        try {
            await Program.update({name}, {where: {id}});
            res.status(204).send();
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    public static deleteProgram = async (req: Request, res: Response) => {
        const id = parseInt(req.query.id, 10);
        try {
            const rowsAffected = await Program.destroy({where: {id}});
            if (rowsAffected === 1) {
                res.status(204).send();
            } else {
                res.status(404).send("No record exists");
            }
        } catch (error) {
            console.log(error);
            res.status(500).send(error.message);
        }
    }

    public static createCurriculum = async (req: Request, res: Response) => {
        const {name, programId} = req.body;
        try {
            const record = await Curriculum.create({name, programId});
            await record.save();
            res.status(204).send();
        } catch (error) {
            res.status(409).send(error.message);
        }
    }

    public static editCurriculum = async (req: Request, res: Response) => {
        const id = parseInt(req.query.id, 10);
        const {name} = req.body;

        try {
            await Curriculum.update({name}, {where: {id}});
            res.status(204).send();
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    public static deleteCurriculum = async (req: Request, res: Response) => {
        const id = parseInt(req.query.id, 10);
        try {
            const rowsAffected = await Curriculum.destroy({where: {id}});
            if (rowsAffected === 1) {
                res.status(204).send();
            } else {
                res.status(404).send("No record exists");
            }
        } catch (error) {
            console.log(error);
            res.status(500).send(error.message);
        }
    }

    public static createTopic = async (req: Request, res: Response) => {
        const {name, skillCount, curriculumId} = req.body;
        try {
            const record = await Topic.create({name, skillCount, curriculumId});
            await record.save();
            res.status(204).send();
        } catch (error) {
            res.status(409).send(error.message);
        }
    }

    public static editTopic = async (req: Request, res: Response) => {
        const id = parseInt(req.query.id, 10);
        const {name, skillCount} = req.body;

        try {
            await Topic.update({name, skillCount}, {where: {id}});
            res.status(204).send();
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    public static deleteTopic = async (req: Request, res: Response) => {
        const id = parseInt(req.query.id, 10);
        try {
            const rowsAffected = await Topic.destroy({where: {id}});
            if (rowsAffected === 1) {
                res.status(204).send();
            } else {
                res.status(404).send("No record exists");
            }
        } catch (error) {
            console.log(error);
            res.status(500).send(error.message);
        }
    }

    public static createSkill = async (req: Request, res: Response) => {
        const {name, topicId} = req.body;
        try {
            const record = await Skill.create({name, topicId});
            await record.save();
            res.status(204).send();
        } catch (error) {
            res.status(409).send(error.message);
        }
    }

    public static editSkill = async (req: Request, res: Response) => {
        const id = parseInt(req.query.id, 10);
        const {name} = req.body;

        try {
            await Skill.update({name}, {where: {id}});
            res.status(204).send();
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    public static deleteSkill = async (req: Request, res: Response) => {
        const id = parseInt(req.query.id, 10);
        try {
            const rowsAffected = await Skill.destroy({where: {id}});
            if (rowsAffected === 1) {
                res.status(204).send();
            } else {
                res.status(404).send("No record exists");
            }
        } catch (error) {
            console.log(error);
            res.status(500).send(error.message);
        }
    }
}

export default FlowController;
