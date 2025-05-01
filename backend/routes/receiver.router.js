import express from 'express';
import { postReceiverForm } from '../controllers/receiver.controller.js';
import { verifyJWT } from '../middlewares/authentication.middleware.js';
import upload from '../middlewares/multer.middleware.js';

const router = express.Router();

router.post('/post', verifyJWT, postReceiverForm); 
router.patch('/orgImage', 
    verifyJWT,
    upload.fields([
        {
            name: "ReceiverImage",
            maxCount: 1
        }
    ]),
    
)
export default router;
