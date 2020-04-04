import {Router} from "express";

export const skillLearning = Router();

import SkillLearning from "../controllers/SkillLearning";
import {checkJwt} from "../middlewares/checkJwt";
import {checkRole} from "../middlewares/checkRole";




skillLearning.post("/create", [checkJwt, checkRole(["ADMIN"])], SkillLearning.create);

skillLearning.get("/start", [checkJwt], SkillLearning.start);

skillLearning.put("/saveProgress", [checkJwt], SkillLearning.saveProgress);

skillLearning.get("/check", [checkJwt], SkillLearning.check);

skillLearning.get("/resume", [checkJwt], SkillLearning.resume);

skillLearning.patch("/program", [checkJwt, checkRole(["ADMIN"])], async (req, res, next) => {
  // todo
});
