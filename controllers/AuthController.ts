import {validate} from "class-validator";
import {Request, Response} from "express";
import * as jwt from "jsonwebtoken";

import config from "../config/config";
import {User} from "../lib/db/postgresSQL/models/User";

class AuthController {
    public static login = async (req: Request, res: Response) => {
        const {username, password} = req.body;
        if (!(username && password)) {
            res.status(400).send();
        }

        let user: User | null;
        try {
            user = await User.findOne({where: {username}});
        } catch (error) {
            res.status(401).send();
            return;
        }
        if (user) {
            if (!user.checkIfUnencryptedPasswordIsValid(password)) {
                res.status(401).send();
                return;
            }

            const token = jwt.sign(
                {userId: user.id, username: user.username},
                config.jwtSecret,
                {expiresIn: "1h"},
            );

            res.send(token);
        } else {
            res.status(500).send("missing user record");
        }
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
}

export default AuthController;
