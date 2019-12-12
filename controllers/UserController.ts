import {validate} from "class-validator";
import {Request, Response} from "express";

import {User} from "../lib/db/postgresSQL/models/User";

class UserController {

    public static listAll = async (req: Request, res: Response) => {
        const users = await User.findAll({attributes: ["id", "name", "surname", "email", "dob", "country", "city", "school", "role"]});
        res.send(users);
    }

    public static getOneById = async (req: Request, res: Response) => {
        const id: string = req.params.id;

        try {
            const user = await User.findAll({
                attributes: ["id", "name", "surname", "email", "dob", "country", "city", "school", "role"],
                where: {id},
            });
            res.send(user);
        } catch (error) {
            res.status(404).send("User not found");
        }
    }

    public static newUser = async (req: Request, res: Response) => {
        const {name, surname, email, password, dob, country, city, school, role} = req.body;
        const user = new User();
        user.name = name;
        user.surname = surname;
        user.email = email;
        user.password = password;
        user.dob = dob;
        if (country) {
            user.country = country;
        }
        if (city) {
            user.city = city;
        }
        if (school) {
            user.school = school;
        }
        user.role = role;

        const errors = await validate(user);
        if (errors.length > 0) {
            res.status(400).send(errors);
            return;
        }

        user.hashPassword();

        const dbObject = JSON.parse(JSON.stringify({
            city,
            country,
            dob,
            email,
            name,
            password: user.password,
            role,
            school,
            surname,
        }));

        try {
            const record = await User.create(dbObject);
            await record.save();
        } catch (e) {
            console.log(e);
            res.status(409).send(e.message);
            return;
        }

        // If all ok, send 201 response
        res.status(201).send("User created");
    }

    public static editUser = async (req: Request, res: Response) => {
        const id = req.params.id;
        const {name, surname, dob, country, city, school} = req.body;

        let user;
        try {
            user = await User.findOne({where: {id}});
        } catch (error) {
            res.status(404).send("User not found");
            return;
        }
        if (user.name) {
            user.name = name;
        }
        if (user.surname) {
            user.surname = surname;
        }
        if (user.dob) {
            user.dob = dob;
        }
        if (country) {
            user.country = country;
        }
        if (city) {
            user.city = city;
        }
        if (school) {
            user.school = school;
        }

        const errors = await validate(user);
        if (errors.length > 0) {
            res.status(400).send(errors);
            return;
        }

        const dbObject = JSON.parse(JSON.stringify({
            city,
            country,
            dob,
            name,
            password: user.password,
            role,
            school,
            surname,
        }));

        try {
            await User.update(dbObject, {where: {id}});
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
