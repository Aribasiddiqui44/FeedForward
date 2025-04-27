import express from 'express';
import { postReceiverForm } from '../controllers/receiver.controller.js';
import { verifyJWT } from '../middlewares/authentication.middleware.js';

const router = express.Router();

router.post('/add', verifyJWT, postReceiverForm); 

export default router;
