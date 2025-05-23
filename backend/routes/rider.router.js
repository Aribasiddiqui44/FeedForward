// import { Router } from "express";
// import { verifyJWT } from "../middlewares/authentication.middleware.js";
// import { postRiderForm, patchAddAvailableTimings, patchCNIC} from './../controllers/rider.controller.js';
// import upload from './../middlewares/multer.middleware.js';
// import { checkRole } from './../middlewares/checkRole.middleware.js';

// const router = Router();

// router.post("/post", verifyJWT, postRiderForm);
// router.patch("/timings", verifyJWT, checkRole('volunteer'), patchAddAvailableTimings);
// router.route("/cnic").patch(
//     verifyJWT,
//     checkRole('volunteer'),
//     upload.fields([
//         {
//             name: 'CNIC_front',
//             count: 1
//         },
//         {
//             name: 'CNIC_back',
//             count: 1
//         }
//     ]),
//     patchCNIC
// );

// export default router;

import { Router } from "express";
import { verifyJWT } from "../middlewares/authentication.middleware.js";
import { 
    postRiderForm, 
    patchAddAvailableTimings 
} from './../controllers/rider.controller.js';
import upload from './../middlewares/multer.middleware.js';
import { checkRole } from './../middlewares/checkRole.middleware.js';

const router = Router();

// Complete volunteer profile (text data)
router.post(
  "/:userId/profile",
  verifyJWT,
  checkRole('volunteer'),
  upload.fields([
    { name: 'profilePic', maxCount: 1 },
    { name: 'CNIC_front', maxCount: 1 },
    { name: 'license', maxCount: 1 }
  ]),
  postRiderForm
);

// Upload documents (files)
// router.patch(
//     "/:userId/documents",
//     verifyJWT,
//     checkRole('volunteer'),
//     upload.fields([
//         { name: 'profilePhoto', maxCount: 1 },
//         { name: 'cnicFront', maxCount: 1 },
        
//         { name: 'licenseFront', maxCount: 1 },
        
//     ]),
//     uploadVolunteerDocuments
// );

// Update availability timings
router.patch(
    "/:userId/timings",
    verifyJWT,
    checkRole('volunteer'),
    patchAddAvailableTimings
);

export default router;