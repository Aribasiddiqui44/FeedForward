import { Router } from "express";
import {
    post_CreateUser_SignUp_Register_Initial,
    postLoginUser,
    patchAddRole
} from './../controllers/user.controller.js';
const router = Router();

 router.post("/signUp", post_CreateUser_SignUp_Register_Initial);
 router.patch("/role", patchAddRole);
 router.post("/login", postLoginUser);

export default router;