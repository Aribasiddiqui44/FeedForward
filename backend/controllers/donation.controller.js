import { Donation } from "../models/donation.model.js";
import { Rider } from "../models/rider.model.js";
import { Receiver } from "../models/receiver.model.js";

// Create a new donation
export const createDonation = async (req, res) => {
  try {
    const newDonation = new Donation(req.body);
    const savedDonation = await newDonation.save();
    res.status(201).json({ message: "Donation created successfully", donation: savedDonation });
  } catch (error) {
    console.error("Error creating donation:", error);
    res.status(500).json({ error: "Failed to create donation" });
  }
};

// Get all donations
export const getAllDonations = async (req, res) => {
  try {
    const donations = await Donation.find()
      .populate("donationFoodList.donatedTo.receiverId")
      .populate("donationFoodList.riderInformation.riderId");
    res.status(200).json(donations);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch donations" });
  }
};

// Get a single donation by ID
export const getDonationById = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id)
      .populate("donationFoodList.donatedTo.receiverId")
      .populate("donationFoodList.riderInformation.riderId");

    if (!donation) {
      return res.status(404).json({ error: "Donation not found" });
    }

    res.status(200).json(donation);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch donation" });
  }
};

// Assign a rider to a donation
export const assignRiderToDonation = async (req, res) => {
  try {
    const { riderId } = req.body;
    const donation = await Donation.findById(req.params.id);

    if (!donation) return res.status(404).json({ error: "Donation not found" });

    const rider = await Rider.findById(riderId);
    if (!rider) return res.status(404).json({ error: "Rider not found" });

    donation.rider.riderId = rider._id;
    donation.rider.riderName = rider.riderName;
    donation.rider.riderPhone = rider.riderContacts?.[0]?.phone || rider.riderPhone;

    await donation.save();

    res.status(200).json({ message: "Rider assigned successfully", donation });
  } catch (error) {
    res.status(500).json({ error: "Failed to assign rider" });
  }
};

// Mark donation as completed
export const markDonationAsCompleted = async (req, res) => {
  try {
    const { isCompleted, comments } = req.body;

    const donation = await Donation.findById(req.params.id);
    if (!donation) return res.status(404).json({ error: "Donation not found" });

    donation.isDonationCompletedSuccessfully.isCompleted = isCompleted;
    donation.isDonationCompletedSuccessfully.comments = comments;

    await donation.save();

    res.status(200).json({ message: "Donation status updated", donation });
  } catch (error) {
    res.status(500).json({ error: "Failed to update donation status" });
  }
};

// Get donations by donor (optional)
export const getDonationsByDonor = async (req, res) => {
  try {
    const { donorId } = req.params;
    const donations = await Donation.find({ "donor._id": donorId });
    res.status(200).json(donations);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch donor's donations" });
  }
};

