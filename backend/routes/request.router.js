// routes.js
import express from 'express';
import { verifyJWT } from '../middlewares/authentication.middleware.js';
import {
    createRequest,
    getDonorRequests,
    handleRequest,
    completeRequest
} from '../controllers/request.controller.js';
const router = express.Router();

router.post('/donations/:donationId/requests', verifyJWT, createRequest);
router.get('/requests/donor', verifyJWT, getDonorRequests);
router.patch('/requests/:requestId/handle', verifyJWT, handleRequest);
router.patch('/requests/:requestId/complete', verifyJWT, completeRequest);
export default router;
