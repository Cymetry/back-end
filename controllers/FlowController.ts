import {Request, Response} from "express";

import {Curriculum} from "../lib/db/postgresSQL/models/Curriculum";
import {Program} from "../lib/db/postgresSQL/models/Program";
import {Skill} from "../lib/db/postgresSQL/models/Skill";
import {Topic} from "../lib/db/postgresSQL/models/Topic";




class FlowController {

    public static loadPrograms = async (req: Request, res: Response) => {
        try {
            const programs = await Program.findAll();
            res.send(programs);
        } catch (error) {
            res.status(404).send("Programs not found");
        }
    }

    public static loadCurriculumByProgram = async (req: Request, res: Response) => {
        const programId: number = req.params.programId;
        try {
            const curriculum = await Curriculum.findAll({where: {programId}});
            res.status(200).send(curriculum);
        } catch (error) {
            res.status(404).send("Curriculum not found");
        }
    }

    public static loadTopicsByCurriculum = async (req: Request, res: Response) => {
        const curriculumId: number = req.params.curriculumId;
        try {
            const topics = await Topic.findAll({where: {curriculumId}});
            res.status(200).send(topics);
        } catch (error) {
            res.status(404).send("Topic not found");
        }
    }

    public static loadSkillsByTopic = async (req: Request, res: Response) => {
        const topicId: number = req.params.topicId;
        try {
            const skills = await Skill.findAll({where: {topicId}});
            res.status(200).send(skills);

        } catch (error) {
            res.status(404).send("Skills not found");
        }
    }

    public static createProgram = async (req: Request, res: Response) => {
        // todo
    }

    public static editProgram = async (req: Request, res: Response) => {
        // todo
    }

    public static deleteProgram = async (req: Request, res: Response) => {
        // todo
    }

    public static createCurriculum = async (req: Request, res: Response) => {
        // todo
    }

    public static editCurriculum = async (req: Request, res: Response) => {
        // todo
    }

    public static deleteCurriculum = async (req: Request, res: Response) => {
        // todo
    }

    public static createTopic = async (req: Request, res: Response) => {
        // todo
    }

    public static editTopic = async (req: Request, res: Response) => {
        // todo
    }

    public static deleteTopic = async (req: Request, res: Response) => {
        // todo
    }

    public static createSkill = async (req: Request, res: Response) => {
        // todo
    }

    public static editSkill = async (req: Request, res: Response) => {
        // todo
    }

    public static deleteSkill = async (req: Request, res: Response) => {
        // todo
    }
}

export default FlowController;
