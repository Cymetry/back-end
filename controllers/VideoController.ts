import {Request, Response} from "express";
import {DbHelpers} from "../lib/db/mongoDb/DbHelpers";

const dbHelpers = new DbHelpers();

class VideoController {
    public static loadVideosBySkills = async (req: Request, res: Response) => {
        const skills = req.body.skills;

        const processes = await dbHelpers.findAllProcessesBySkills(skills);
        if (processes) {
            const videoRefs = processes.map((process) => process.video);

            const resVideos = await dbHelpers.getVideosByIds(videoRefs);

            if (resVideos) {
                res.status(200).send({body: resVideos.map((obj) => obj.content)});
            } else {
                res.send(500).send("Missing video records");
            }
        } else {
            res.status(500).send("Missing processes with given skills");
        }
    }
}

export default VideoController;

