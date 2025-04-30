import asyncHandler from '../utils/asyncHandler.js';
import { Donation } from '../models/donation.model.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
//import uploadOnCloudinary from './../services/cloudinary.service.js';

// Add at top of file
const safeJsonParse = (str) => {
  try {
    return typeof str === 'string' ? JSON.parse(str) : str;
  } catch (err) {
    throw new ApiError(400, `Invalid JSON format: ${str}`);
  }
};
export const createDonation = asyncHandler( async(req, res) => {
  res.end();
})
/*
export const createDonation = asyncHandler(async (req, res) => {
  // 1. Validate required fields
  const requiredFields = [
    'donationFoodTitle',
    'donationDescription',
    'donationUnitPrice',
    'donationQuantity',
    'donationInitialPickupTimeRange'
  ];

  const missingFields = requiredFields.filter(field => !req.body[field]?.trim());
  if (missingFields.length > 0) {
    throw new ApiError(400, `Missing required fields: ${missingFields.join(', ')}`);
  }

  // 2. Validate images
  // if (!req.files?.length) {
  //   throw new ApiError(400, "At least one image is required");
  // }

  // 3. Process images
  // const uploadedImageUrls = [];
  // const filesToCleanup = [];

  //try {
    // Upload all images in parallel for better performance
  //   const uploadPromises = req.files.map(async file => {
  //     filesToCleanup.push(file.path); // Track files for cleanup
  //     const uploadedImage = await uploadOnCloudinary(file.path);
  //     if (!uploadedImage?.url) {
  //       throw new ApiError(500, "Cloudinary upload failed");
  //     }
  //     return uploadedImage.url;
  //   });

  //   // Wait for all uploads to complete
  //   uploadedImageUrls.push(...(await Promise.all(uploadPromises)));
  // } catch (error) {
  //   // Cleanup any uploaded files
  //   // await Promise.all(filesToCleanup.map(async path => {
  //   //   try {
  //   //     await fs.promises.unlink(path);
  //   //   } catch (err) {
  //   //     console.error('Failed to cleanup file:', path);
  //   //   }
  //   // }));
  //   throw error;
  // }

  // 4. Parse and validate fields
  const parseField = (field, defaultValue) => {
    const parsed = safeJsonParse(field);
    return parsed || defaultValue;
  };

  // 5. Create donation
  const newDonation = await Donation.create({
    donationFoodTitle: req.body.donationFoodTitle.trim(),
    donationDescription: req.body.donationDescription.trim(),
    donationUnitPrice: parseField(req.body.donationUnitPrice, { value: 0, currency: "pkr" }),
    donationQuantity: parseField(req.body.donationQuantity, { quantity: 1, measurementUnit: "kg" }),
    donationInitialPickupTimeRange: parseField(req.body.donationInitialPickupTimeRange),
    donationPickupInstructions: parseField(req.body.donationPickupInstructions, []),
    goodnessOfFood: parseField(req.body.goodnessOfFood, {
      bestBefore: new Date(),
      listedFor: { period: 5, timeUnit: "days" }
    }),
    //donationImages: uploadedImageUrls,
    donatedBy: req.user._id,
    rider: req.body.rider || null
  });

  

  return res.status(201).json(
    new ApiResponse(201, newDonation, "Donation created successfully")
  );
});*/
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

// 4. delete donation
export const deleteDonation = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  // Verify the donation exists and belongs to the user
  const donation = await Donation.findOneAndDelete({
      _id: id,
      donatedBy: userId
  });

  if (!donation) {
      throw new ApiError(404, "Donation not found or you don't have permission to delete it");
  }

  // Optional: Add cleanup for Cloudinary images here if needed
  // await deleteImagesFromCloudinary(donation.donationImages);

  return res.status(200).json(
      new ApiResponse(200, null, "Donation deleted successfully")
  );
});