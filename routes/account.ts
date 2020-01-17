import {Router} from "express";
import AccountController from "../controllers/AccountController";
import {checkJwt} from "../middlewares/checkJwt";
import {checkRole} from "../middlewares/checkRole";

export const accountRouter = Router();

accountRouter.get("/", [checkJwt], AccountController.loadAccount);

accountRouter.post("/help", AccountController.sendHelpAndFeedback);

accountRouter.get("/payment", [checkJwt], AccountController.loadPayment);

accountRouter.get("/FAQ", AccountController.loadFAQ);

accountRouter.post("/FAQ", [checkJwt, checkRole(["ADMIN"])], AccountController.addFAQ);

accountRouter.patch("/FAQ", [checkJwt, checkRole(["ADMIN"])], AccountController.editFAQ);

accountRouter.delete("/FAQ", [checkJwt, checkRole(["ADMIN"])], AccountController.deleteFAQ);

