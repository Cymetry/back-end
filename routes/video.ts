import {Router} from "express";
import videoController from "../controllers/VideoController";
import {checkJwt} from "../middlewares/checkJwt";

export const videoRouter = Router();

videoRouter.post("/videos", [checkJwt], videoController.loadVideosBySkills);



