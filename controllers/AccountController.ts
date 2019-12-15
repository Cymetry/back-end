import {Request, Response} from "express";

import {User} from "../lib/db/postgresSQL/models/Topic";


class FlowController {

    public static loadAccount = async (req: Request, res: Response) => {
        const userId = res.locals.jwtPayload.userId;
        try {
            const user = await User.findByPk(userId, {
                attributes: ["name", "surname"],
            });
            const result = {
                user,
            };
            res.status(200).send(result);
        } catch (error) {
            res.status(404).send(error.message);
        }
    }

    public static loadPayment = async (req: Request, res: Response) => {
        // todo
    }

    public static loadHelpAndFeedback = async (req: Request, res: Response) => {
        // todo
    }

    public static loadFAQ = async (req: Request, res: Response) => {
        // todo
    }


}

export default FlowController;
