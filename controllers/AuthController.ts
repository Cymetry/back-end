import {validate} from "class-validator";
import {Request, Response} from "express";
import * as jwt from "jsonwebtoken";

import config from "../config/config";
import emailConfig from "../config/emailConfig";
import {Secret} from "../lib/db/postgresSQL/models/Secret";
import {User} from "../lib/db/postgresSQL/models/User";
import {Email} from "../lib/Email";

const emailSender = new Email(emailConfig.username, emailConfig.password);

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

    public static getResetPasswordEmail = async (req: Request, res: Response) => {
        const email = req.query.email;
        try {
            const user = await User.findOne({where: {email}});
            if (user) {
                try {
                    const token = Math.floor(100000 + Math.random() * 900000);
                    let record;
                    record = await Secret.findOne({where: {userId: user.id}});

                    if (record) {
                        await Secret.update({token}, {where: {userId: user.id}});
                    } else {
                        try {
                            await Secret.create({userId: user.id, token});
                        } catch (e) {
                            console.log(e);
                            res.status(500).send({body: "Failed to create secret record"});
                        }
                    }

                    const subject = "Umath password reset";
                    const text = "Please, type the secret: " + token + " in the application";
                    console.log("email text", text);
                    await emailSender.sendEmail(emailConfig.email, user.email, subject, text);
                    res.status(200).send("Email was successfully sent");
                } catch (e) {
                    console.log(e.message);
                    res.status(500).send({body: "Failed to send email"});
                }

            }
        } catch (e) {
            console.log(e);
            res.status(401).send({body: "no user with such email"});
        }
    }

    public static resetPassword = async (req: Request, res: Response) => {
        const {newPassword, email, token} = req.body;
        try {
            const user = await User.findOne({where: {email}});
            if (user) {
                const secretRecord = await Secret.findOne({where: {userId: user.id}});
                if (secretRecord && String(secretRecord.token) === token &&
                    new Date().getTime() - secretRecord.updatedAt.getTime() < 1200000) {
                    user.password = newPassword;
                    const errors = await validate(user);
                    if (errors.length > 0) {
                        res.status(400).send(errors);
                        return;
                    }

                    user.hashPassword();
                    await User.update({password: user.password}, {where: {id: user.id}});
                    res.status(204).send();
                } else {
                    res.status(400).send({body: "Secret mismatch or expired"});
                }


            }
        } catch (e) {
            console.log(e);
            res.status(500).send({body: "Failed to change password"});
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

    public static checkSecret = async (req: Request, res: Response) => {
        const secret = req.query.secret;
        const userId = res.locals.jwtPayload.userId;

        const secretRecords = await Secret.findAll({limit: 1, where: {userId}});
        if (secretRecords) {
            if (Number(secretRecords[0].token) === Number(secret)) {
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
