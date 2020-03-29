import {Request, Response} from "express";

import emailConfig from "../config/emailConfig";
import {DbHelpers} from "../lib/db/mongoDb/DbHelpers";
import {Skill} from "../lib/db/postgresSQL/models/Skill";
import {Topic} from "../lib/db/postgresSQL/models/Topic";
import {User} from "../lib/db/postgresSQL/models/User";
import {Email} from "../lib/Email";


const emailSender = new Email(emailConfig.username, emailConfig.password);
const dbHelpers = new DbHelpers();


class FlowController {

    public static loadAccount = async (req: Request, res: Response) => {
        const userId = res.locals.jwtPayload.userId;
        try {
            const user = await User.findByPk(userId, {
                attributes: ["name", "surname"],
            });

            const skillsTotal = await Skill.findAndCountAll();
            const topicsTotal = await Topic.findAndCountAll();

            const testsComplete = await dbHelpers.findCompleteTests(userId);

            let skillsComplete = 0;
            const completes = await dbHelpers.findCompleteSkills(userId);

            if (completes) {
                completes.forEach((complete) => {
                    skillsComplete += complete.skillsComplete.length;
                });
            }

            let result;

            const latestPositions = await dbHelpers.getLatestPositionRecord(userId);

            const recent = {} as any;

            if (latestPositions.length > 0) {
                recent.lastSkill = latestPositions[0].skillId;
                recent.preLastSkill = latestPositions[1] ? latestPositions[1].skillId : null;
            }

            if (skillsTotal && topicsTotal && testsComplete) {
                result = {
                    learning: skillsComplete / skillsTotal.count,
                    recent,
                    revision: testsComplete.testsComplete / topicsTotal.count,
                    user,
                };
            } else if (skillsTotal) {
                result = {
                    learning: skillsComplete / skillsTotal.count,
                    recent,
                    revision: 0,
                    user,
                };
            } else {
                result = {
                    learning: 0,
                    recent,
                    revision: 0,
                    user,
                };
            }

            res.status(200).send(result);
        } catch (error) {
            res.status(404).send(error.message);
        }
        // todo
        // the part related with progress chart
    }

    public static loadPayment = async (req: Request, res: Response) => {
        // todo
    }

    public static sendHelpAndFeedback = async (req: Request, res: Response) => {
        const {name, telephone, school, email, text} = req.body;
        try {
            await emailSender.sendEmail(
                emailConfig.email,
                emailConfig.feedbackEmail,
                "User Feedback or Help",
                JSON.stringify({name, telephone, school, email, text}));
            res.status(200).send({message: "Feedback email sent!"});
        } catch (e) {
            console.log(e.message);
            res.status(500).send({message: "Failed to send Feedback email"});

        }
    }

    public static loadFAQ = async (req: Request, res: Response) => {
        try {
            const response = await dbHelpers.loadFAQs();
            res.status(200).send(response);
        } catch (e) {
            console.log(e.message);
            res.status(500).send({error: e.message});

        }
    }

    public static addFAQ = async (req: Request, res: Response) => {
        const {title, content} = req.body;
        try {
            await dbHelpers.addFAQ(title, content);
            res.status(200).send({message: "Node successfully added"});
        } catch (e) {
            console.log(e);
            res.status(500).send({error: e.message});
        }
    }

    public static editFAQ = async (req: Request, res: Response) => {
        const {recordId, title, content} = req.body;
        const updatable = JSON.parse(JSON.stringify({title, content}));
        try {
            await dbHelpers.editFAQ(recordId, updatable);
            res.status(200).send({message: "Success"});
        } catch (e) {
            console.log(e);
            res.status(500).send({error: e.message});
        }
    }

    public static deleteFAQ = async (req: Request, res: Response) => {
        const recordId = req.query.recordId;
        try {
            await dbHelpers.deleteFAQ(recordId);
            res.status(200).send({message: "Record successfully deleted"});
        } catch (e) {
            console.log(e);
            res.status(500).send({error: e.message});
        }
    }


}

export default FlowController;
