import express from 'express';
import { createDonation, getDonationsForUser, getDonationsForReceiver, completeDonation,deleteDonation,getAvailableDonations } from '../controllers/donation.controller.js';
import { verifyJWT } from "../middlewares/authentication.middleware.js";
import upload from './../middlewares/multer.middleware.js';
import { checkRole } from '../middlewares/checkRole.middleware.js';

const router = express.Router();

// Create donation (donor only)
router.post('/create',
    verifyJWT,
    checkRole('donor'),
    upload.fields([{ name: "donationImages", maxCount: 3 }]),
    createDonation
);

// Get donations for donor
router.get('/my-donations',
    verifyJWT,
    checkRole('donor'),
    getDonationsForUser
);

// Get donations for receiver
router.get('/received',
    verifyJWT,
    checkRole('receiver'),
    getDonationsForReceiver
);

// Complete donation (donor only)
router.patch('/:id/complete',
    verifyJWT,
    checkRole('donor'),
    completeDonation
);

// Delete donation (donor only)
router.delete('/:id',
    verifyJWT,
    checkRole('donor'),
    deleteDonation
);

// Get available donations (public)
router.get('/available',
    getAvailableDonations
);

export default router;




