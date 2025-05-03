// request.controller.js
import { Donation } from '../models/donation.model.js';
import { DonationRequest } from '../models/donationRequest.model.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
export const createRequest = asyncHandler(async (req, res) => {
    const { donationId } = req.params;
    const { quantity, proposedPrice, message } = req.body;
    const userId = req.user._id;

    // Validate donation exists and is available
    const donation = await Donation.findById(donationId);
    if (!donation) throw new ApiError(404, 'Donation not found');
    if (donation.listingStatus !== 'open') {
        throw new ApiError(400, 'This donation is no longer available');
    }

    // Validate quantity
    if (quantity > donation.donationQuantity.quantity) {
        throw new ApiError(400, 'Requested quantity exceeds available amount');
    }

    // Validate price for selling items
    if (donation.listingType === 'selling' && donation.donationUnitPrice.minPricePerUnit) {
        const minTotal = donation.donationUnitPrice.minPricePerUnit * quantity;
        if (proposedPrice < minTotal) {
            throw new ApiError(400, `Minimum price for ${quantity}kg is ${minTotal} PKR`);
        }
    }

    // Create request
    const request = await DonationRequest.create({
        donation: donationId,
        requester: userId,
        quantity,
        proposedPrice: donation.listingType === 'donation' ? 0 : proposedPrice,
        messages: message ? [{ senderType: 'receiver', message }] : []
    });

    // Add request to donation
    donation.requests.push(request._id);
    await donation.save();

    return res.status(201).json(
        new ApiResponse(201, request, 'Request submitted successfully')
    );
});
export const getDonorRequests = asyncHandler(async (req, res) => {
    const requests = await DonationRequest.find({
        'donation.donatedBy.donorId': req.user._id
    })
    .populate('donation', 'donationFoodTitle donationUnitPrice')
    .populate('requester', 'fullName phoneNumber');

    res.status(200).json(new ApiResponse(200, requests));
});
export const handleRequest = asyncHandler(async (req, res) => {
    const { requestId } = req.params;
    const { action, message, counterPrice } = req.body;
    
    const request = await DonationRequest.findById(requestId).populate('donation');
    if (!request) throw new ApiError(404, 'Request not found');

    // Verify donor owns the donation
    if (request.donation.donatedBy.donorId.toString() !== req.user._id.toString()) {
        throw new ApiError(403, 'Not authorized');
    }

    switch (action) {
        case 'accept':
            request.status = 'accepted';
            request.finalPrice = request.proposedPrice;
            request.donation.listingStatus = 'closed';
            break;
            
        case 'counter':
            if (!counterPrice) throw new ApiError(400, 'Counter price required');
            request.status = 'negotiating';
            request.messages.push({
                senderType: 'donor',
                message: message || 'Price counter offer',
                priceOffer: counterPrice
            });
            break;
            
        case 'reject':
            request.status = 'rejected';
            if (message) {
                request.messages.push({
                    senderType: 'donor',
                    message
                });
            }
            break;
            
        default:
            throw new ApiError(400, 'Invalid action');
    }

    await request.save();
    await request.donation.save();

    return res.status(200).json(
        new ApiResponse(200, request, `Request ${action}ed successfully`)
    );
});
export const completeRequest = asyncHandler(async (req, res) => {
    const { requestId } = req.params;
    const { riderId, rating, comment } = req.body;

    const request = await DonationRequest.findById(requestId);
    if (!request) throw new ApiError(404, 'Request not found');

    request.status = 'completed';
    request.pickupDetails.completedAt = new Date();
    request.feedback = {
        receiverComment: comment,
        rating
    };

    // Update donation status
    await Donation.findByIdAndUpdate(request.donation, {
        $set: {
            'isDonationCompletedSuccessfully.isCompleted': true,
            'isDonationCompletedSuccessfully.comments': 'Completed via request'
        }
    });

    await request.save();
    return res.status(200).json(new ApiResponse(200, request, 'Request completed'));
});