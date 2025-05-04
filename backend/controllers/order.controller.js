import { Order } from '../models/order.model.js';
import { DonationRequest } from '../models/donationRequest.model.js';
import { Donation } from '../models/donation.model.js';
import { User } from '../models/user.model.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';

// Get orders for donor
export const getDonorOrders = asyncHandler(async (req, res) => {
    const { status } = req.query;
    
    const filter = { donor: req.user._id };
    if (status) {
        filter.orderStatus = status;
    }

    const orders = await Order.find(filter)
        .populate('receiver', 'fullName phoneNumber')
        .populate('donation', 'donationFoodTitle listingImages')
        .sort({ createdAt: -1 });

    res.status(200).json(new ApiResponse(200, orders));
});

// Get orders for receiver
export const getReceiverOrders = asyncHandler(async (req, res) => {
    const { status } = req.query;
    
    const filter = { receiver: req.user._id };
    if (status) {
        filter.orderStatus = status;
    }

    const orders = await Order.find(filter)
        .populate('donor', 'fullName phoneNumber')
        .populate('donation', 'donationFoodTitle listingImages')
        .sort({ createdAt: -1 });

    res.status(200).json(new ApiResponse(200, orders));
});

// Get order details
export const getOrderDetails = asyncHandler(async (req, res) => {
    const { orderId } = req.params;

    const order = await Order.findById(orderId)
        .populate('donor', 'fullName phoneNumber')
        .populate('receiver', 'fullName phoneNumber')
        .populate('donation', 'donationFoodTitle donationDescription listingImages')
        .populate('request', 'status messages');

    if (!order) {
        throw new ApiError(404, 'Order not found');
    }

    // Verify the requesting user is either donor or receiver
    if (![order.donor._id.toString(), order.receiver._id.toString()].includes(req.user._id.toString())) {
        throw new ApiError(403, 'Not authorized to view this order');
    }

    res.status(200).json(new ApiResponse(200, order));
});

// Update order status (for donor)
export const updateOrderStatus = asyncHandler(async (req, res) => {
    const { orderId } = req.params;
    const { status, message } = req.body;

    const validStatuses = ["processing", "ready_for_pickup", "in_transit", "delivered", "cancelled"];
    if (!validStatuses.includes(status)) {
        throw new ApiError(400, 'Invalid order status');
    }

    const order = await Order.findById(orderId);
    if (!order) {
        throw new ApiError(404, 'Order not found');
    }

    // Verify the requesting user is the donor
    if (order.donor.toString() !== req.user._id.toString()) {
        throw new ApiError(403, 'Not authorized to update this order');
    }

    // Special handling for cancellation
    if (status === 'cancelled' && !message) {
        throw new ApiError(400, 'Cancellation reason is required');
    }

    order.orderStatus = status;
    order.tracking.push({
        status,
        message: message || `Status updated to ${status}`,
        updatedBy: 'donor'
    });

    if (status === 'cancelled') {
        order.cancellationReason = message;
    }

    await order.save();

    res.status(200).json(new ApiResponse(200, order, 'Order status updated'));
});

// Assign rider to order (for donor)
export const assignRiderToOrder = asyncHandler(async (req, res) => {
    const { orderId } = req.params;
    const { riderId, riderName, riderPhone } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
        throw new ApiError(404, 'Order not found');
    }

    // Verify the requesting user is the donor
    if (order.donor.toString() !== req.user._id.toString()) {
        throw new ApiError(403, 'Not authorized to update this order');
    }

    order.pickupDetails.rider = {
        riderId,
        name: riderName,
        phone: riderPhone
    };
    order.orderStatus = 'in_transit';
    order.tracking.push({
        status: 'in_transit',
        message: `Rider ${riderName} assigned for delivery`,
        updatedBy: 'donor'
    });

    await order.save();

    res.status(200).json(new ApiResponse(200, order, 'Rider assigned to order'));
});

// Mark order as delivered (for rider)
export const markOrderDelivered = asyncHandler(async (req, res) => {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);
    if (!order) {
        throw new ApiError(404, 'Order not found');
    }

    // Verify the requesting user is the assigned rider
    if (order.pickupDetails.rider.riderId.toString() !== req.user._id.toString()) {
        throw new ApiError(403, 'Not authorized to update this order');
    }

    order.orderStatus = 'delivered';
    order.pickupDetails.completedAt = new Date();
    order.tracking.push({
        status: 'delivered',
        message: 'Order delivered successfully',
        updatedBy: 'rider'
    });

    await order.save();

    // Update related donation and request
    await Donation.findByIdAndUpdate(order.donation, {
        $set: {
            'isDonationCompletedSuccessfully.isCompleted': true,
            'isDonationCompletedSuccessfully.comments': 'Delivered via order'
        }
    });

    await DonationRequest.findByIdAndUpdate(order.request, {
        $set: {
            status: 'completed',
            'pickupDetails.completedAt': new Date()
        }
    });

    res.status(200).json(new ApiResponse(200, order, 'Order marked as delivered'));
});