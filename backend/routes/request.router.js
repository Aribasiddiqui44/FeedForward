import express from 'express';
import {
    createRequest,
    getDonorRequests,
    handleRequest,
    completeRequest,
    directCheckout,
    getReceiverRequests,
    getDonorActivity
} from '../controllers/request.controller.js';
import { verifyJWT } from '../middlewares/authentication.middleware.js';
import { checkRole } from '../middlewares/checkRole.middleware.js';

const router = express.Router();

// Create request (receiver only)
router.post('/donations/:donationId/requests',
    verifyJWT,
    checkRole('receiver'),
    createRequest
);

// Direct checkout (receiver only)
router.post('/donations/:donationId/direct-checkout',
    verifyJWT,
    checkRole('receiver'),
    directCheckout
);

// Get donor requests (donor only)
router.get('/donor/requests/:foodItemId',
    verifyJWT,
    checkRole('donor'),
    getDonorRequests
);


// Handle request (donor only)
router.patch('/requests/:requestId/handle',
    verifyJWT,
    checkRole(['donor','receiver']),
    handleRequest
);

// Complete request (donor or receiver)
router.patch('/requests/:requestId/complete',
    verifyJWT,
    checkRole(['donor']),
    completeRequest
);

router.get('/receiver/requests',
    verifyJWT,
    checkRole('receiver'),
    getReceiverRequests
);
router.get('/donor/activity',
    verifyJWT,
    checkRole('donor'),
    getDonorActivity
);

export default router;