import {Router} from "express";
import statisticsController from "../controllers/StatisticsController";
import {checkJwt} from "../middlewares/checkJwt";

export const statisticsRouter = Router();

statisticsRouter.get("/", [checkJwt], statisticsController.getStatistics)
statisticsRouter.post("/create", [checkJwt], statisticsController.createStatistics);
statisticsRouter.put("/knowledge", [checkJwt], statisticsController.updateKnowledge);
statisticsRouter.put("/accuracy", [checkJwt], statisticsController.updateAccuracy);
statisticsRouter.put("/logics", [checkJwt], statisticsController.updateLogics);
statisticsRouter.put("/speed", [checkJwt], statisticsController.updateSpeed);