import { verifyJWT } from "../middlewares/authentication.middleware.js";
import { checkifAdmin } from "../middlewares/checkAdmin.middleware.js";
import { postAppSupportQuestion, patchAnswerSupportQuestion, getQueriesOfUser } from "./../controllers/support.controller.js";
import { Router } from 'express';

const router = Router();
router.post("/post", verifyJWT, postAppSupportQuestion);
router.patch("/reply", verifyJWT, checkifAdmin, patchAnswerSupportQuestion);
router.get("/get", verifyJWT, getQueriesOfUser);

export default router;