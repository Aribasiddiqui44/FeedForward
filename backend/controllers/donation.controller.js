import asyncHandler from '../utils/asyncHandler.js';
import { Donation } from '../models/donation.model.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';

// 1. Create a donation
export const createDonation = asyncHandler(async (req, res) => {
    const { donationFoodTitle, donationFoodList, donationDescription, donationUnitPrice, donationQuantity, donationInitialPickupTimeRange, donationPickupInstructions, goodnessOfFood, rider } = req.body;

    const newDonation = await Donation.create({
        donationFoodTitle,
        donationFoodList,
        donationDescription,
        donationUnitPrice,
        donationQuantity,
        donationInitialPickupTimeRange,
        donationPickupInstructions,
        goodnessOfFood,
        rider,
        donatedBy: req.user._id
    });

    res.status(201).json(new ApiResponse(201, newDonation, "Donation created successfully"));
});

// 2. Get donations for current user (Donor)
export const getDonationsForUser = asyncHandler(async (req, res) => {
    const { status } = req.query;

    const filter = { donatedBy: req.user._id };
    if (status === 'ongoing') {
        filter["isDonationCompletedSuccessfully.isCompleted"] = false;
    } else if (status === 'completed') {
        filter["isDonationCompletedSuccessfully.isCompleted"] = true;
    }

    const donations = await Donation.find(filter).sort({ createdAt: -1 });

    res.status(200).json(new ApiResponse(200, donations, "Donor's donations fetched"));
});

// 3. Get donations for receiver (receiverId matched)
export const getDonationsForReceiver = async (req, res) => {
  try {
    const receiverId = req.user?.id; // This comes from verifyJWT

    if (!receiverId) {
      return res.status(400).json({ message: 'Receiver ID is missing.' });
    }

    const donations = await Donation.find({ 'donatedTo.receiverId': receiverId })
      .sort({ createdAt: -1 });

    res.status(200).json({ donations });
  } catch (error) {
    console.error('Error fetching donations for receiver:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// 4. Complete a donation
export const completeDonation = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { comments } = req.body;

    const donation = await Donation.findById(id);
    if (!donation) throw new ApiError(404, "Donation not found");

    donation.isDonationCompletedSuccessfully = {
        isCompleted: true,
        comments: comments || ''
    };

    await donation.save();

    res.status(200).json(new ApiResponse(200, donation, "Donation marked as completed"));
});
