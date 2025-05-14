import asyncHandler from '../utils/asyncHandler.js';
import { Donation } from '../models/donation.model.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import uploadOnCloudinary from '../services/cloudinary.service.js';
//import uploadOnCloudinary from './../services/cloudinary.service.js';

// Add at top of file
const safeJsonParse = (str) => {
  try {
    return typeof str === 'string' ? JSON.parse(str) : str;
  } catch (err) {
    throw new ApiError(400, `Invalid JSON format: ${str}`);
  }
};

// have to change donated by Id to donorId from userId.
export const createDonation = asyncHandler(async (req, res) => {
  // 1. Validate required fields
  const requiredFields = [
    'donationFoodTitle',
    'donationDescription',
    'donationUnitPrice',
    'donationQuantity',
    'donationInitialPickupTimeRange'
  ];

  // console.log("here");
  const missingFields = requiredFields.filter(field => !req.body[field]?.trim());
  if (missingFields.length > 0) {
    throw new ApiError(400, `Missing required fields: ${missingFields.join(', ')}`);
  }
  const priceObj = typeof req.body.donationUnitPrice === 'string' 
    ? JSON.parse(req.body.donationUnitPrice) 
    : req.body.donationUnitPrice;

  // 2. Validate images
  if ( !req.files ) {
    throw new ApiError(400, "At least one image is required");
  };
  let ImagePath_1 = req.files?.donationImages[0]?.path;
  let ImagePath_2 = req.files?.donationImages[1]?.path;
  let ImagePath_3 = req.files?.donationImages[2]?.path;
  if ( !ImagePath_1 && !ImagePath_2 && !ImagePath_3) {
    throw new ApiError(400, "Image not found");
  };

  //uploading files.
  let imageUrls = [];
  if(ImagePath_1) {
    let image1Upload = await uploadOnCloudinary(ImagePath_1);
    if( !image1Upload ) {
      throw new ApiError(500, "Internal Server Error, unable to upload files");
    };
    // console.log(image1Upload);
    imageUrls.push(image1Upload.url);

  }
  if(ImagePath_2) {
    let image2Upload = await uploadOnCloudinary(ImagePath_2);
    if( !image2Upload ) {
      throw new ApiError(500, "Internal Server Error, unable to upload files");
    };
    imageUrls.push(image2Upload.url);
  }
  if(ImagePath_3) {
    let image3Upload = await uploadOnCloudinary(ImagePath_3);
    if( !image3Upload ) {
      throw new ApiError(500, "Internal Server Error, unable to upload files");
    };
    imageUrls.push(image3Upload.url);
  }
 

  // 4. Parse and validate fields
  const parseField = (field, defaultValue) => {
    const parsed = safeJsonParse(field);
    return parsed || defaultValue;
  };

  // 5. Create donation
  const newDonation = await Donation.create({
    donationFoodTitle: req.body.donationFoodTitle.trim(),
    donationDescription: req.body.donationDescription.trim(),
    donationUnitPrice: {
      value: priceObj.value,
      currency: priceObj.currency || "PKR",
      minPricePerUnit: priceObj.minPricePerUnit
  },
    donationQuantity: parseField(req.body.donationQuantity, { quantity: 1, measurementUnit: "kg" }),
    donationInitialPickupTimeRange: parseField(req.body.donationInitialPickupTimeRange),
    donationPickupInstructions: parseField(req.body.donationPickupInstructions, []),
    foodExpiry: parseField(req.body.goodnessOfFood, {
      bestBefore: new Date(),
      listedFor: { period: 5, timeUnit: "days" }
    }),
    //donationImages: uploadedImageUrls,
    donatedBy: req.user._id,
    // rider: req.body.rider || null,
    listingImages: imageUrls
  });
  if( !newDonation ) {
    throw new ApiError(500, "Internal Server Error, in listing food.");
  };

  

  return res.status(201).json(
    new ApiResponse(201, newDonation, "Donation created successfully")
  );
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
    // have to change it to receiver Id, and send receivrId from frontend to fetch the donations accepted by receiver.
    const receiverId = req.user?._id; // This comes from verifyJWT

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

// get avaibale donations for receiver
export const getAvailableDonations = asyncHandler(async (req, res) => {
  try {
    const currentDate = new Date();
    
    const donations = await Donation.find({
      "isDonationCompletedSuccessfully.isCompleted": false,
      
    })
    .populate({
      path: 'donatedBy',
      select: 'fullName phoneNumber',
      model: 'User'
    })
    .lean();
    res.status(200).json(
      new ApiResponse(200, { donations }, "Available donations fetched successfully")
    );
  } catch (error) {
    throw new ApiError(500, "Error fetching available donations");
  }
});