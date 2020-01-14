import {validate} from "class-validator";
import {Request, Response} from "express";
import * as jwt from "jsonwebtoken";

import config from "../config/config";
import {Secret} from "../lib/db/postgresSQL/models/Secret";
import {User} from "../lib/db/postgresSQL/models/User";

class AuthController {
    public static login = async (req: Request, res: Response) => {
        const {email, password} = req.body;
        if (!(email && password)) {
            res.status(400).send();
        }

        let user: User | null;
        try {
            user = await User.findOne({where: {email}});
        } catch (error) {
            res.status(401).send(error.message);
            return;
        }
        if (user) {
            if (!user.checkIfUnencryptedPasswordIsValid(password)) {
                res.status(401).send();
                return;
            }

            const token = jwt.sign(
                {userId: user.id, email: user.email},
                config.jwtSecret,
                {expiresIn: "7d"},
            );

            res.send({jwt: token, isPremium: user.isPremium});
        } else {
            res.status(500).send("missing user record");
        }
    }

    public static refresh = async (req: Request, res: Response) => {

    }

    public static changePassword = async (req: Request, res: Response) => {
        const id = res.locals.jwtPayload.userId;

        const {oldPassword, newPassword} = req.body;
        if (!(oldPassword && newPassword)) {
            res.status(400).send();
        }

        let user: User | null;

        try {
            user = await User.findOne({where: {id}});
        } catch (id) {
            res.status(401).send();
            return;
        }
        if (user) {
            if (!user.checkIfUnencryptedPasswordIsValid(oldPassword)) {
                res.status(401).send();
                return;
            }

            user.password = newPassword;
            const errors = await validate(user);
            if (errors.length > 0) {
                res.status(400).send(errors);
                return;
            }

            user.hashPassword();
            await User.update({password: user.password}, {where: {id}});


            res.status(204).send();
        } else {
            res.status(500).send("missing user record");
        }
    }

    public static checkSecret = async (req: Request, res: Response) => {
        const secret = req.query.secret;
        const userId = res.locals.jwtPayload.userId;

        const secretRecords = await Secret.findAll({limit: 1, where: {userId}});
        if (secretRecords) {
            if (secretRecords[0].token === secret) {
                await User.update({isVerified: true}, {where: {id: userId}});
                res.status(200).send({message: "email successfully verified"});
            } else {
                res.status(400).send({message: "Secret mismatch"});
            }
        } else {
            res.status(500).send({message: "Noe token found on db"});
        }
    }
}

export default AuthController;
