import {validate} from "class-validator";
import {Request, Response} from "express";

import emailConfig from "../config/emailConfig";
import {Secret} from "../lib/db/postgresSQL/models/Secret";
import {User} from "../lib/db/postgresSQL/models/User";
import {Email} from "../lib/Email";
import {Helpers} from "../lib/Helpers";


const emailSender = new Email(emailConfig.username, emailConfig.password);
const helpers = new Helpers();

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
        const {name, surname, email, password, dob, country, city, school} = req.body;
        const user = new User();
        user.name = name;
        user.surname = surname;
        user.email = email;
        user.password = password;
        user.dob = dob || new Date();
        if (country) {
            user.country = country;
        }
        if (city) {
            user.city = city;
        }
        if (school) {
            user.school = school;
        }
        user.role = "user";

        const errors = await validate(user);
        if (errors.length > 0) {
            res.status(400).send(errors);
            return;
        }

        user.hashPassword();

        const dbObject = JSON.parse(JSON.stringify({
            city,
            country,
            dob: dob || new Date(),
            email,
            id: await helpers.generateId(User),
            name,
            password: user.password,
            role: "user",
            school,
            surname,
        }));

        try {
            const record = await User.create(dbObject);
            await record.save();
            try {
                const token = Math.floor(100000 + Math.random() * 900000);
                await Secret.create({userId: record.id, token, id: await helpers.generateId(Secret)});

                const subject = "Umath Welcome";
                const text = `<br><img src="https://umathconfirmationemail.s3.amazonaws.com/umathlogo+copy+(1).png" width="50" height="50">
<h1>Hi, ${name} ${surname}</h1>
<p>Welcome to Umath education platform - we are glad you are here!&nbsp;<br />
<br />
Umath is a personalised high-school&nbsp;Mathematics education, launching on iOS &amp; Android. The application understands the areas that require improvement and tailors a learning, specifically for you</p>
<br><img src="https://umathconfirmationemail.s3.amazonaws.com/marketing_2+(2).png" width="772" height="600">
<br />
 <br>Whether you are a student, teacher, professional, homeschooler, adult that wants to revisit mathematics studies - Umath is for you:<br />
- skill by skill learning: we break down each chapter in very small skills, in order to ensure you understand every detail. You can tailor these to specific material that you want to learn<br />
- personalisation: the application tracks areas that require improvement, and generates learning based on your results<br />
- guidance: guided problems will assist you in obtaining the correct result, in the simplest way, ensuring you maximise your score<br />
- videos: if you feel stuck, we provide video material to walk you through specifics covering the particular chapter. Videos will be tailored to the skill you want to solve
Our topics will grow over time and welcome any suggestions or feedback as we roll out our Beta version at <strong>team@umath.io(opens in new tab)
<br />
<br><img src="https://umathconfirmationemail.s3.amazonaws.com/marketing_7+(1).png" width="772" height="600">
<br></strong>.&nbsp;<br />
<br />
We hope you will enjoy your Mathematics adventure,<br />
Team Umath
<em>Copyright &copy; 2020 Umath Ltd, All rights reserved.</em><br />
<br />
<strong>Our mailing address is:</strong><br />
team@umath.io`;
                await emailSender.sendEmail(emailConfig.email, user.email, subject, text);
            } catch (e) {
                console.log(e.message);
            }
        } catch (e) {
            console.log(e);
            res.status(409).send(e.message);
            return;
        }

        // If all ok, send 201 response
        res.status(201).send("User created");
    }

    public static editUser = async (req: Request, res: Response) => {
        const id = res.locals.jwtPayload.userId;
        const {name, surname, dob, country, city, school, isPremium} = req.body;

        let user;
        try {
            user = await User.findOne({where: {id}});
        } catch (error) {
            res.status(404).send("User not found");
            return;
        }

        const dbObject = JSON.parse(JSON.stringify({
            city,
            country,
            dob,
            isPremium,
            name,
            password: user.password,
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
