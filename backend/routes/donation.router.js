import express from 'express';
import { createDonation, getDonationsForUser, getDonationsForReceiver, completeDonation } from '../controllers/donation.controller.js';
import { verifyJWT } from '../middlewares/authentication.middleware.js';

const router = express.Router();

// Create a new donation
router.post('/create', verifyJWT, createDonation);

// Get donations for donor (filtered by ongoing/completed)
router.get('/mine', verifyJWT, getDonationsForUser);

// Get donations for receiver
router.get('/receiver', verifyJWT, getDonationsForReceiver);

// Mark donation as completed
router.patch('/:id/complete', verifyJWT, completeDonation);

export default router;
