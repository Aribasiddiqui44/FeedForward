import { Router } from "express";
import { verifyJWT } from "../middlewares/authentication.middleware.js";
import { postRiderForm, patchAddAvailableTimings, patchCNIC} from './../controllers/rider.controller.js';
import upload from './../middlewares/multer.middleware.js';
import { checkRole } from './../middlewares/checkRole.middleware.js';

const router = Router();

router.post("/post", verifyJWT, postRiderForm);
router.patch("/timings", verifyJWT, checkRole('volunteer'), patchAddAvailableTimings);
router.route("/cnic").patch(
    verifyJWT,
    checkRole('volunteer'),
    upload.fields([
        {
            name: 'CNIC_front',
            count: 1
        },
        {
            name: 'CNIC_back',
            count: 1
        }
    ]),
    patchCNIC
);

export default router;
