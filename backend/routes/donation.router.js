import express from 'express';
import { createDonation, getDonationsForUser, getDonationsForReceiver, completeDonation,deleteDonation,getAvailableDonations } from '../controllers/donation.controller.js';
import { verifyJWT } from '../middlewares/authentication.middleware.js';
import upload from './../middlewares/multer.middleware.js';
const router = express.Router();

router.post('/create', 
  verifyJWT,
  upload.array('donationImages', 10), // Handle up to 10 images
  createDonation
);

// Get donations for donor (filtered by ongoing/completed)
router.get('/mine', verifyJWT, getDonationsForUser);

// Get donations for receiver
router.get('/receiver', verifyJWT, getDonationsForReceiver);

// Mark donation as completed
router.patch('/:id/complete', verifyJWT, completeDonation);

//delete donation
router.delete('/remove/:id', verifyJWT, deleteDonation);
//available donations
router.route('/available').get(getAvailableDonations);
export default router;


