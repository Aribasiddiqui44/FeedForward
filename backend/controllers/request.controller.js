
// request.controller.js
import { Donation } from '../models/donation.model.js';
import { DonationRequest } from '../models/donationRequest.model.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import { Order } from '../models/order.model.js';
import { Notification } from '../models/notification.model.js';
import mongoose from 'mongoose';
// Helper function to validate donation availability
const validateDonation = async (donationId) => {
    const donation = await Donation.findById(donationId);
    if (!donation) throw new ApiError(404, 'Donation not found');
    if (donation.listingStatus !== 'open') {
        throw new ApiError(400, 'This donation is no longer available');
    }
    return donation;
};

// Create request (for free meal or negotiation)
// export const createRequest = asyncHandler(async (req, res) => {
//     const { donationId } = req.params;
//     const { quantity, proposedPrice, message, requestType } = req.body;
//     const userId = req.user._id;

//     // Validate donation
//     const donation = await validateDonation(donationId);
    
//     // Validate request type
//     if (!['free', 'negotiation','explicit_free'].includes(requestType)) {
//         throw new ApiError(400, 'Invalid request type');
//     }

//     // Validate quantity
//     if (quantity > donation.donationQuantity.quantity) {
//         throw new ApiError(400, 'Requested quantity exceeds available amount');
//     }
//     //  if (requestType === 'explicit_free') {
//     //     const request = await DonationRequest.create({
//     //         donation: donationId,
//     //         requester: userId,
//     //         requestType: 'explicit_free',
//     //         quantity,
//     //         proposedPrice: 0,
//     //         status: 'pending'
//     //     });

//     //     donation.requests.push(request._id);
//     //     await donation.save();

//     //     return res.status(201).json(
//     //         new ApiResponse(201, request, 'Free donation request submitted')
//     //     );
//     // }
//     // Validate price for negotiation requests
//     if (requestType === 'negotiation') {
//         if (!proposedPrice) {
//             throw new ApiError(400, 'Proposed price is required for negotiation');
//         }
        
//         const minPrice = donation.donationUnitPrice.minPricePerUnit || donation.donationUnitPrice.value;
//         if (proposedPrice < minPrice * quantity) {
//             throw new ApiError(400, `Minimum price for ${quantity} units is ${minPrice * quantity} PKR`);
//         }
//     }

//     // Create request
//     const request = await DonationRequest.create({
//         donation: donationId,
//         requester: userId,
//         requestType,
//         quantity,
        
//         proposedPrice: requestType === 'free' || requestType==='explicit_free' ? 0 : proposedPrice,
//         status: 'pending',
//         negotiationHistory: requestType === 'negotiation' ? [{
//             type: 'offer',
//             price: proposedPrice,
//             message: message || 'Initial price offer',
//             by: 'receiver',
//             createdAt: new Date()
//         }] : []
//     });

//     // Update donation
//     donation.requests.push(request._id);
//     await donation.save();

//     return res.status(201).json(
//         new ApiResponse(201, request, `${requestType} request submitted successfully`)
//     );
// });
export const createRequest = asyncHandler(async (req, res) => {
    const { donationId } = req.params;
    const { quantity, proposedPrice, message, requestType } = req.body;
    const userId = req.user._id;

    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
        // Validate donation
        const donation = await Donation.findById(donationId).session(session);
        if (!donation) throw new ApiError(404, 'Donation not found');
        if (donation.listingStatus !== 'open') {
            throw new ApiError(400, 'This donation is no longer available');
        }
        
        // Validate request type
        if (!['free', 'negotiation', 'explicit_free'].includes(requestType)) {
            throw new ApiError(400, 'Invalid request type');
        }

        // Validate quantity
        if (quantity > donation.donationQuantity.quantity) {
            throw new ApiError(400, 'Requested quantity exceeds available amount');
        }

        // Validate price for negotiation requests
        if (requestType === 'negotiation') {
            if (!proposedPrice) {
                throw new ApiError(400, 'Proposed price is required for negotiation');
            }
            
            const minPrice = donation.donationUnitPrice.minPricePerUnit || donation.donationUnitPrice.value;
            if (proposedPrice < minPrice * quantity) {
                throw new ApiError(400, `Minimum price for ${quantity} units is ${minPrice * quantity} PKR`);
            }
        }

        // Create request
        const request = await DonationRequest.create([{
            donation: donationId,
            requester: userId,
            requestType,
            quantity,
            proposedPrice: requestType === 'free' || requestType === 'explicit_free' ? 0 : proposedPrice,
            status: 'pending',
            negotiationHistory: requestType === 'negotiation' ? [{
                type: 'offer',
                price: proposedPrice,
                message: message || 'Initial price offer',
                by: 'receiver',
                createdAt: new Date()
            }] : []
        }], { session });

        // Update donation
        donation.requests.push(request[0]._id);
        await donation.save({ session });

        await session.commitTransaction();
        
        return res.status(201).json(
            new ApiResponse(201, request[0], `${requestType} request submitted successfully`)
        );
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
});

// Get requests for donor (filter by type)
export const getDonorRequests = asyncHandler(async (req, res) => {
    const { foodItemId } = req.params;
    const { status } = req.query;
    
    // Base filter - only requests for this donor's donations
    const filter = {
        donation: { $in: await Donation.find({ donatedBy: req.user._id }).distinct('_id') }
    };

    // If specific food item requested
    if (foodItemId) {
        filter.donation = foodItemId;
    }

    // Filter by status if provided
    if (status) {
        filter.status = status;
    }

    const requests = await DonationRequest.find(filter)
        .populate({
            path: 'donation',
            select: 'donationFoodTitle donationUnitPrice donationQuantity listingImages donationInitialPickupTimeRange',
            populate: {
                path: 'donatedBy',
                select: 'fullName'
            }
        })
        .populate('requester', 'fullName phoneNumber profilePicture')
        .sort({ createdAt: -1 });

    // Format the response
    const formattedRequests = requests.map(request => ({
        _id: request._id,
        requestType: request.requestType,
        status: request.status,
        quantity: request.quantity,
        proposedPrice: request.proposedPrice,
        finalPrice: request.finalPrice,
        pickupDetails: request.pickupDetails,
        createdAt: request.createdAt,
        updatedAt: request.updatedAt,
        foodItem: {
            id: request.donation._id,
            title: request.donation.donationFoodTitle,
            price: request.donation.donationUnitPrice,
            quantity: request.donation.donationQuantity,
            images: request.donation.listingImages,
            pickupTime: request.donation.donationInitialPickupTimeRange
        },
        requester: {
            id: request.requester._id,
            name: request.requester.fullName,
            phone: request.requester.phoneNumber,
            profilePic: request.requester.profilePicture
        },
        donor: {
            id: request.donation.donatedBy._id,
            name: request.donation.donatedBy.fullName
        }
    }));

    res.status(200).json(new ApiResponse(200, formattedRequests, 'Requests fetched successfully'));
});

// Handle request actions (accept/counter/reject)
// export const handleRequest = asyncHandler(async (req, res) => {
//     const { requestId } = req.params;
//     const { action, message, counterPrice, paymentMethod = 'cash_on_pickup' } = req.body;
    
//     const request = await DonationRequest.findById(requestId)
//         .populate('donation')
//         .populate('requester');
//     if (!request) throw new ApiError(404, 'Request not found');

//     // Verify donor owns the donation
//     if (request.donation.donatedBy.toString() !== req.user._id.toString()) {
//         throw new ApiError(403, 'Not authorized');
//     }

//     let order;
//     switch (action) {
//         case 'accept':
//             request.status = 'accepted';
//             request.finalPrice = request.proposedPrice;
//             request.donation.listingStatus = 'closed';
            
//             // Create order
//             order = await Order.create({
//                 request: request._id,
//                 donor: req.user._id,
//                 receiver: request.requester._id,
//                 donation: request.donation._id,
//                 items: [{
//                     foodItem: request.donation.donationFoodTitle,
//                     foodItemId: request.donation._id,
//                     quantity: request.quantity,
//                     unitPrice: request.finalPrice / request.quantity,
//                     totalPrice: request.finalPrice
//                 }],
//                 orderTotal: request.finalPrice,
//                 paymentMethod,
//                 paymentStatus: paymentMethod === 'cash_on_pickup' ? 'pending' : 'completed',
//                 orderStatus: 'processing',
//                 pickupDetails: {
//                     scheduledTime: request.donation.donationInitialPickupTimeRange,
//                     address: req.user.address || '',
//                     contactNumber: req.user.phoneNumber || ''
//                 },
//                 tracking: [{
//                     status: 'processing',
//                     message: 'Order created from accepted request',
//                     updatedBy: 'donor'
//                 }]
//             });

//             // Add to negotiation history
//             if (request.requestType === 'negotiation') {
//                 request.negotiationHistory.push({
//                     type: 'accept',
//                     price: request.finalPrice,
//                     message: message || 'Request accepted',
//                     by: 'donor',
//                     createdAt: new Date()
//                 });
//             }
//             break;
            
//         case 'counter':
//             if (!counterPrice) throw new ApiError(400, 'Counter price required');
//             if (request.requestType !== 'negotiation') {
//                 throw new ApiError(400, 'Only negotiation requests can be countered');
//             }
            
//             request.status = 'negotiating';
//             request.negotiationHistory.push({
//                 type: 'counter',
//                 price: counterPrice,
//                 message: message || 'Price counter offer',
//                 by: 'donor',
//                 createdAt: new Date()
//             });
//             break;
            
//         case 'reject':
//             request.status = 'rejected';
//             if (message) {
//                 request.negotiationHistory.push({
//                     type: 'reject',
//                     message,
//                     by: 'donor',
//                     createdAt: new Date()
//                 });
//             }
//             break;
            
//         default:
//             throw new ApiError(400, 'Invalid action');
//     }

//     await Promise.all([request.save(), request.donation.save()]);

//     return res.status(200).json(
//         new ApiResponse(200, { request, order }, `Request ${action}ed successfully`)
//     );
// });

export const handleRequest = asyncHandler(async (req, res) => {
    const { requestId } = req.params;
    const { action, message, counterPrice, paymentMethod = 'cash_on_pickup' } = req.body;
    
    const request = await DonationRequest.findById(requestId)
        .populate('donation')
        .populate('requester');
    if (!request) throw new ApiError(404, 'Request not found');

    // Verify donor owns the donation
    if (request.donation.donatedBy.toString() !== req.user._id.toString()) {
        throw new ApiError(403, 'Not authorized');
    }

    let order;
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
        switch (action) {
            case 'accept':
                // Check if enough quantity is available
                if (request.quantity > request.donation.donationQuantity.quantity) {
                    throw new ApiError(400, 'Not enough quantity available');
                }

                request.status = 'accepted';
                request.finalPrice = request.proposedPrice;
                
                // Deduct quantity from donation
                request.donation.donationQuantity.quantity -= request.quantity;
                
                // Close listing if no quantity remains
                if (request.donation.donationQuantity.quantity <= 0) {
                    request.donation.listingStatus = 'closed';
                }

                // Create order
                order = await Order.create([{
                    request: request._id,
                    donor: req.user._id,
                    receiver: request.requester._id,
                    donation: request.donation._id,
                    items: [{
                        foodItem: request.donation.donationFoodTitle,
                        foodItemId: request.donation._id,
                        quantity: request.quantity,
                        unitPrice: request.finalPrice / request.quantity,
                        totalPrice: request.finalPrice
                    }],
                    orderTotal: request.finalPrice,
                    paymentMethod,
                    paymentStatus: paymentMethod === 'cash_on_pickup' ? 'pending' : 'completed',
                    orderStatus: 'processing',
                    pickupDetails: {
                        scheduledTime: request.donation.donationInitialPickupTimeRange,
                        address: req.user.address || '',
                        contactNumber: req.user.phoneNumber || ''
                    },
                    tracking: [{
                        status: 'processing',
                        message: 'Order created from accepted request',
                        updatedBy: 'donor'
                    }]
                }], { session });

                // Add to negotiation history if applicable
                if (request.requestType === 'negotiation') {
                    request.negotiationHistory.push({
                        type: 'accept',
                        price: request.finalPrice,
                        message: message || 'Request accepted',
                        by: 'donor',
                        createdAt: new Date()
                    });
                }
                break;
                
            case 'counter':
            if (!counterPrice) throw new ApiError(400, 'Counter price required');
            if (request.requestType !== 'negotiation') {
                throw new ApiError(400, 'Only negotiation requests can be countered');
            }
            
            request.status = 'negotiating';
            request.negotiationHistory.push({
                type: 'counter',
                price: counterPrice,
                message: message || 'Price counter offer',
                by: 'donor',
                createdAt: new Date()
            });
            break;
            
        case 'reject':
            request.status = 'rejected';
            if (message) {
                request.negotiationHistory.push({
                    type: 'reject',
                    message,
                    by: 'donor',
                    createdAt: new Date()
                });
            }
            break;
            
        default:
            throw new ApiError(400, 'Invalid action');
    }
        

        await request.save({ session });
        await request.donation.save({ session });
        await session.commitTransaction();
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }

    return res.status(200).json(
        new ApiResponse(200, { request, order }, `Request ${action}ed successfully`)
    );
});
// Direct checkout
// export const directCheckout = asyncHandler(async (req, res) => {
//     const { donationId } = req.params;
//     const { quantity, paymentMethod = 'cash_on_pickup' } = req.body;
//     const userId = req.user._id;

//     // Validate donation
//     const donation = await validateDonation(donationId);
    
//     // Validate quantity
//     if (quantity > donation.donationQuantity.quantity) {
//         throw new ApiError(400, 'Requested quantity exceeds available amount');
//     }

//     // Calculate total price
//     const totalPrice = donation.donationUnitPrice.value * quantity;

//     // Update donation quantity
//     donation.donationQuantity.quantity -= quantity;
//     if (donation.donationQuantity.quantity <= 0) {
//         donation.listingStatus = 'closed';
//     }

//     // Create request with immediate acceptance
//     const request = await DonationRequest.create({
//         donation: donationId,
//         requester: userId,
//         requestType: 'direct',
//         quantity,
//         proposedPrice: totalPrice,
//         finalPrice: totalPrice,
//         status: 'accepted',
//         paymentMethod,
//         pickupDetails: {
//             scheduledTime: donation.donationInitialPickupTimeRange
//         }
//     });

//     // Create order
//     const order = await Order.create({
//         request: request._id,
//         donor: donation.donatedBy,
//         receiver: userId,
//         donation: donation._id,
//         items: [{
//             foodItem: donation.donationFoodTitle,
//             foodItemId: donation._id,
//             quantity: quantity,
//             unitPrice: donation.donationUnitPrice.value,
//             totalPrice: totalPrice
//         }],
//         orderTotal: totalPrice,
//         paymentMethod,
//         paymentStatus: paymentMethod === 'cash_on_pickup' ? 'pending' : 'completed',
//         orderStatus: 'processing',
//         pickupDetails: {
//             scheduledTime: donation.donationInitialPickupTimeRange,
//             address: req.user.address || '',
//             contactNumber: req.user.phoneNumber || ''
//         },
//         tracking: [{
//             status: 'processing',
//             message: 'Direct checkout order created',
//             updatedBy: 'system'
//         }]
//     });

//     // Update donation
//     donation.requests.push(request._id);
//     await donation.save();

//     return res.status(201).json(
//         new ApiResponse(201, { request, order }, 'Direct purchase completed successfully')
//     );
// });
export const directCheckout = asyncHandler(async (req, res) => {
    const { donationId } = req.params;
    const { quantity, paymentMethod = 'cash_on_pickup' } = req.body;
    const userId = req.user._id;

    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
        // Validate donation
        const donation = await Donation.findById(donationId).session(session);
        if (!donation) throw new ApiError(404, 'Donation not found');
        if (donation.listingStatus !== 'open') {
            throw new ApiError(400, 'This donation is no longer available');
        }
        
        // Validate quantity
        if (quantity > donation.donationQuantity.quantity) {
            throw new ApiError(400, 'Requested quantity exceeds available amount');
        }

        // Calculate total price
        const totalPrice = donation.donationUnitPrice.value * quantity;

        // Update donation quantity
        donation.donationQuantity.quantity -= quantity;
        if (donation.donationQuantity.quantity <= 0) {
            donation.listingStatus = 'closed';
        }

        // Create request with immediate acceptance
        const request = await DonationRequest.create([{
            donation: donationId,
            requester: userId,
            requestType: 'direct',
            quantity,
            proposedPrice: totalPrice,
            finalPrice: totalPrice,
            status: 'accepted',
            paymentMethod,
            pickupDetails: {
                scheduledTime: donation.donationInitialPickupTimeRange
            }
        }], { session });

        // Create order
        const order = await Order.create([{
            request: request[0]._id,
            donor: donation.donatedBy,
            receiver: userId,
            donation: donation._id,
            items: [{
                foodItem: donation.donationFoodTitle,
                foodItemId: donation._id,
                quantity: quantity,
                unitPrice: donation.donationUnitPrice.value,
                totalPrice: totalPrice
            }],
            orderTotal: totalPrice,
            paymentMethod,
            paymentStatus: paymentMethod === 'cash_on_pickup' ? 'pending' : 'completed',
            orderStatus: 'processing',
            pickupDetails: {
                scheduledTime: donation.donationInitialPickupTimeRange,
                address: req.user.address || '',
                contactNumber: req.user.phoneNumber || ''
            },
            tracking: [{
                status: 'processing',
                message: 'Direct checkout order created',
                updatedBy: 'system'
            }]
        }], { session });

        // Update donation
        donation.requests.push(request[0]._id);
        await donation.save({ session });

        await session.commitTransaction();
        
        return res.status(201).json(
            new ApiResponse(201, { request: request[0], order: order[0] }, 'Direct purchase completed successfully')
        );
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
});

// Complete request
export const completeRequest = asyncHandler(async (req, res) => {
    const { requestId } = req.params;
    const { riderId, rating, comment } = req.body;

    const request = await DonationRequest.findById(requestId)
        .populate('donation')
        .populate('requester');
    if (!request) throw new ApiError(404, 'Request not found');
    if (request.status !== 'accepted') {
        throw new ApiError(400, 'Only accepted requests can be completed');
    }

    // Update request
    request.status = 'completed';
    request.pickupDetails.completedAt = new Date();
    request.pickupDetails.rider = {
        riderId,
        name: req.user.fullName,
        phone: req.user.phoneNumber
    };
    request.feedback = {
        receiverComment: comment,
        rating
    };
    
    // Update donation
    request.donation.isDonationCompletedSuccessfully = {
        isCompleted: true,
        comments: 'Completed via request'
    };

    await Promise.all([request.save(), request.donation.save()]);

    return res.status(200).json(
        new ApiResponse(200, request, 'Request completed successfully')
    );
});


// Get receiver requests with filtering by type
export const getReceiverRequests = asyncHandler(async (req, res) => {
    const { type } = req.query; // 'negotiation' or 'donation'
    const userId = req.user._id;
    
    const filter = { requester: userId };

    if (type === 'donation') {
        filter.requestType = { $in: ['free', 'explicit_free'] };
    } else if (type === 'negotiation') {
        filter.requestType = 'negotiation';
    } 

    const requests = await DonationRequest.find(filter)
        .populate({
            path: 'donation',
            select: 'donationFoodTitle donationDescription donationUnitPrice listingImages donatedBy',
            populate: {
                path: 'donatedBy',
                select: 'fullName address'
            }
        })
        .sort({ createdAt: -1 });

    const formattedRequests = requests.map(request => ({
        _id: request._id,
        requestType: request.requestType,
        status: request.status,
        quantity: request.quantity,
        proposedPrice: request.proposedPrice,
        originalPrice: request.donation.donationUnitPrice.value, // Added for frontend
        createdAt: request.createdAt,
        foodItem: {
            id: request.donation._id,
            title: request.donation.donationFoodTitle,
            description: request.donation.donationDescription,
            price: request.donation.donationUnitPrice,
            images: request.donation.listingImages
        },
        donor: {
            id: request.donation.donatedBy._id,
            name: request.donation.donatedBy.fullName,
            address: request.donation.donatedBy.address
        },
        messages: request.messages || [],
        negotiationHistory: request.negotiationHistory || []
    }));

    res.status(200).json(
        new ApiResponse(200, formattedRequests, 'Requests fetched successfully')
    );
});