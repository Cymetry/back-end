import {Router} from "express";
import FlowController from "../controllers/FlowController";
import {checkJwt} from "../middlewares/checkJwt";
import {checkRole} from "../middlewares/checkRole";

export const flowRouter = Router();

flowRouter.get("/program", FlowController.loadPrograms);

flowRouter.post("/program", [checkJwt, checkRole(["ADMIN"])], FlowController.createProgram);

flowRouter.patch("/program", [checkJwt, checkRole(["ADMIN"])], FlowController.editProgram);

flowRouter.delete("/program", [checkJwt, checkRole(["ADMIN"])], FlowController.deleteProgram);

flowRouter.get("/curriculum",  FlowController.loadCurriculumByProgram);

flowRouter.post("/curriculum", [checkJwt, checkRole(["ADMIN"])], FlowController.createCurriculum);

flowRouter.patch("/curriculum", [checkJwt, checkRole(["ADMIN"])], FlowController.editCurriculum);

flowRouter.delete("/curriculum", [checkJwt, checkRole(["ADMIN"])], FlowController.deleteCurriculum);

flowRouter.get("/topic",  FlowController.loadTopicsByCurriculum);

flowRouter.post("/topic", [checkJwt, checkRole(["ADMIN"])], FlowController.createTopic);

flowRouter.patch("/topic", [checkJwt, checkRole(["ADMIN"])], FlowController.editTopic);

flowRouter.delete("/topic", [checkJwt, checkRole(["ADMIN"])], FlowController.deleteTopic);

flowRouter.get("/skill", [checkJwt], FlowController.loadSkillsByTopic);

flowRouter.post("/skill", [checkJwt, checkRole(["ADMIN"])], FlowController.createSkill);

flowRouter.patch("/skill", [checkJwt, checkRole(["ADMIN"])], FlowController.editSkill);

flowRouter.delete("/skill", [checkJwt, checkRole(["ADMIN"])], FlowController.deleteSkill);
