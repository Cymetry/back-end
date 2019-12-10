import {validate} from "class-validator";
import {Request, Response} from "express";

import {User} from "../lib/db/postgresSQL/models/User";

class UserController {

    public static listAll = async (req: Request, res: Response) => {
        const users = await User.findAll({attributes: ["id", "username", "role"]});
        res.send(users);
    }

    public static getOneById = async (req: Request, res: Response) => {
        const id: string = req.params.id;

        try {
            const user = await User.findAll({
                attributes: ["id", "username", "role"],
                where: {id},
            });
            res.send(user);
        } catch (error) {
            res.status(404).send("User not found");
        }
    }

    public static newUser = async (req: Request, res: Response) => {
        const {username, password, role} = req.body;
        const user = new User();
        user.username = username;
        user.password = password;
        user.role = role;

        const errors = await validate(user);
        if (errors.length > 0) {
            res.status(400).send(errors);
            return;
        }

        user.hashPassword();

        try {
            await User.create(user);
        } catch (e) {
            res.status(409).send("username already in use");
            return;
        }

        // If all ok, send 201 response
        res.status(201).send("User created");
    }

    public static editUser = async (req: Request, res: Response) => {
        const id = req.params.id;
        const {username, role} = req.body;

        let user;
        try {
            user = await User.findOne({where: {id}});
        } catch (error) {
            res.status(404).send("User not found");
            return;
        }

        user.username = username;
        user.role = role;
        const errors = await validate(user);
        if (errors.length > 0) {
            res.status(400).send(errors);
            return;
        }

        try {
            await User.update(user, {where: {id}});
        } catch (e) {
            res.status(409).send("username already in use");
            return;
        }
        res.status(204).send();
    }

    public static deleteUser = async (req: Request, res: Response) => {
        const id = req.params.id;

        let user: User | null;

        try {
            user = await User.findOne({where: {id}});
            console.log("User record found", user);
        } catch (error) {
            res.status(404).send("User not found");
            return;
        }
        await User.destroy({where: {id}});

        res.status(204).send();
    }
}

export default UserController;
