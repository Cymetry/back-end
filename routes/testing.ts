import {Router} from "express";
import testingController from "../controllers/TestingController";
import {checkJwt} from "../middlewares/checkJwt";
import {checkRole} from "../middlewares/checkRole";

export const testingRouter = Router();

testingRouter.get("/start", [checkJwt], testingController.start);

testingRouter.get("/resume", [checkJwt], testingController.resume);

testingRouter.get("/check", [checkJwt], testingController.check);

testingRouter.post("/saveProgress", [checkJwt], testingController.save);

testingRouter.post("/define", [checkJwt, checkRole(["ADMIN"])], testingController.defineSkills);


