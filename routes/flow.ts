import {Router} from "express";
import FlowController from "../controllers/FlowController";
import {checkJwt} from "../middlewares/checkJwt";

export const flowRouter = Router();

flowRouter.get("/program", FlowController.loadPrograms);

flowRouter.post("/program", FlowController.createProgram);

flowRouter.patch("/program", FlowController.editProgram);

flowRouter.delete("/program", FlowController.deleteProgram);

flowRouter.get("/curriculum", [checkJwt], FlowController.loadCurriculumByProgram);

flowRouter.post("/curriculum", [checkJwt], FlowController.createCurriculum);

flowRouter.patch("/curriculum", [checkJwt], FlowController.editCurriculum);

flowRouter.delete("/curriculum", [checkJwt], FlowController.deleteCurriculum);

flowRouter.get("/topic", [checkJwt], FlowController.loadTopicsByCurriculum);

flowRouter.post("/topic", [checkJwt], FlowController.createTopic);

flowRouter.patch("/topic", [checkJwt], FlowController.editTopic);

flowRouter.delete("/topic", [checkJwt], FlowController.deleteTopic);

flowRouter.get("/skill", [checkJwt], FlowController.loadSkillsByTopic);

flowRouter.post("/skill", [checkJwt], FlowController.createSkill);

flowRouter.patch("/skill", [checkJwt], FlowController.editSkill);

flowRouter.delete("/skill", [checkJwt], FlowController.deleteSkill);
