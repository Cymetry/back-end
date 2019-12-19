import {Router} from "express";
import questionController from "../controllers/QuestionController";
import {checkJwt} from "../middlewares/checkJwt";
import {checkRole} from "../middlewares/checkRole";

export const questionRouter = Router();

questionRouter.get("/", [checkJwt], questionController.getQuestion);

questionRouter.post("/", [checkJwt, checkRole(["ADMIN"])], questionController.addQuestion);

questionRouter.patch("/", [checkJwt, checkRole(["ADMIN"])], questionController.editQuestion);

questionRouter.delete("/", [checkJwt.checkRole(["ADMIN"])], questionController.deleteQuestion);

