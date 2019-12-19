import {Request, Response} from "express";

import {DbHelpers} from "../lib/db/mongoDb/DbHelpers";

const dbHelpers = new DbHelpers();

class QuestionController {

    public static getQuestion = async (req: Request, res: Response) => {
        // todo
    }

    public static addQuestion = async (req: Request, res: Response) => {
        // todo
    }

    public static editQuestion = async (req: Request, res: Response) => {
        // todo
    }

    public static deleteQuestion = async (req: Request, res: Response) => {
        // todo
    }
}

export default QuestionController;
