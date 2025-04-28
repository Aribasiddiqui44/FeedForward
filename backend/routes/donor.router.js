import {
    postDonorForm,
    patchProvideAddressDetails,
    patchAddImages
} from './../controllers/donor.controller.js';
import { verifyJWT } from './../middlewares/authentication.middleware.js';
import upload from './../middlewares/multer.middleware.js';
import { Router } from 'express';
const router = Router();

router.post("/Form", verifyJWT, postDonorForm);
router.patch("/addressUpdate", verifyJWT, patchProvideAddressDetails);
router.route("/addImage").patch(
    verifyJWT,
    upload.fields([
        {
            name: "donorImage",
            maxCount: 1
        }
    ]),
    patchAddImages
);

export default router;