import {Router} from "express";
import AccountController from "../controllers/AccountController";
import {checkJwt} from "../middlewares/checkJwt";

export const accountRouter = Router();

accountRouter.get("/", [checkJwt], AccountController.loadAccount);

accountRouter.get("/help", [checkJwt], AccountController.loadHelpAndFeedback);

accountRouter.get("/payment", [checkJwt], AccountController.loadPayment);

accountRouter.get("/FAQ", [checkJwt], AccountController.loadFAQ);

