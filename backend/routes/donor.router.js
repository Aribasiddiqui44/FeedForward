import {
    postDonorForm,
    patchProvideAddressDetails
} from './../controllers/donor.controller.js';
import { verifyJWT } from './../middlewares/authentication.middleware.js';
import { Router } from 'express';
const router = Router();

router.post("/Form", verifyJWT, postDonorForm);
router.patch("/addressUpdate", verifyJWT, patchProvideAddressDetails);

export default router;