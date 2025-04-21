import express from "express";
import {
  createDonation,
  getAllDonations,
  getDonationById,
  assignRiderToDonation,
  markDonationAsCompleted,
  getDonationsByDonor,
} from "../controllers/donation.controller.js";

const router = express.Router();

// Create a new donation
router.post("/", createDonation);

// Get all donations
router.get("/", getAllDonations);

// Get a single donation by ID
router.get("/:id", getDonationById);

// Assign a rider to a donation
router.put("/assign-rider/:id", assignRiderToDonation);

// Mark a donation as completed
router.put("/complete/:id", markDonationAsCompleted);

// Get all donations by a donor (optional route if donor field is added)
router.get("/donor/:donorId", getDonationsByDonor);

export default router;
