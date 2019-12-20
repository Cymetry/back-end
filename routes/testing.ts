import {Router} from "express";
import testingController from "../controllers/TestingController";
import {checkJwt} from "../middlewares/checkJwt";

export const testingRouter = Router();

testingRouter.get("/start", [checkJwt], testingController.start);

testingRouter.get("/resume", [checkJwt], testingController.resume);

testingRouter.get("/check", [checkJwt], testingController.check);

testingRouter.get("/saveProgress", [checkJwt], testingController.save);


