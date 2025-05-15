import { Order } from '../models/order.model.js';
import { DonationRequest } from '../models/donationRequest.model.js';
import { Donation } from '../models/donation.model.js';
import { User } from '../models/user.model.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import mongoose from 'mongoose';
import { Rider } from '../models/rider.model.js';
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
export const riderRespondToOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const { action } = req.body; // 'accept' or 'decline'

  const order = await Order.findById(orderId).populate('pickupDetails.rider.riderId');
  if (!order) {
    throw new ApiError(404, 'Order not found');
  }

  if (order.orderStatus !== 'ready_for_pickup' && order.orderStatus !== 'processing') {
    throw new ApiError(400, `Order cannot be modified in its current status: ${order.orderStatus}`);
  }

  const rider = await Rider.findOne({ volunteerUserId: req.user._id });
  if (!rider) {
    throw new ApiError(404, 'Rider profile not found');
  }

  if (action === 'accept') {
    order.pickupDetails.rider = {
      riderId: rider._id,
      name: rider.userDetails?.name || req.user.fullName,
      phone: rider.userDetails?.phoneNumber || req.user.phoneNumber,
    };
    order.orderStatus = 'in_transit';
    order.tracking.push({
      status: 'in_transit',
      message: `Rider ${rider.userDetails?.name || req.user.fullName} accepted the order`,
      updatedBy: 'rider'
    });
  } else if (action === 'decline') {
    order.tracking.push({
      status: 'processing',
      message: `Rider ${rider.userDetails?.name || req.user.fullName} declined the order`,
      updatedBy: 'rider'
    });
    // Optionally, clear any previously set rider
    order.pickupDetails.rider = undefined;
  } else {
    throw new ApiError(400, 'Invalid action. Use "accept" or "decline".');
  }

  await order.save();

  return res.status(200).json(
    new ApiResponse(200, order, `Order ${action}ed by rider successfully`)
  );
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

// Cancel order by receiver with single click (no message required)
export const cancelOrderByReceiver = asyncHandler(async (req, res) => {
    const { orderId } = req.params;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Find the order with related documents in transaction
        const order = await Order.findById(orderId)
            .populate('donation')
            .populate('request')
            .session(session);

        if (!order) {
            throw new ApiError(404, 'Order not found');
        }

        // Verify the requesting user is the receiver
        if (order.receiver.toString() !== req.user._id.toString()) {
            throw new ApiError(403, 'Not authorized to cancel this order');
        }

        // Check if order can be cancelled
        const cancellableStatuses = ['processing', 'ready_for_pickup'];
        if (!cancellableStatuses.includes(order.orderStatus)) {
            throw new ApiError(400, `Order can only be cancelled in statuses: ${cancellableStatuses.join(', ')}`);
        }

        // Update order status
        order.orderStatus = 'cancelled';
        order.cancellationReason = 'Cancelled by receiver';
        order.cancelledBy = 'receiver';
        order.cancelledAt = new Date();
        order.tracking.push({
            status: 'cancelled',
            message: 'Order cancelled by receiver',
            updatedBy: 'receiver',
            timestamp: new Date()
        });

        // Update related donation if exists
        if (order.donation) {
            // Get the total quantity from all items in the order
            const totalQuantity = order.items.reduce((sum, item) => sum + item.quantity, 0);
            
            // Restore quantity - using the correct path from your schema
            order.donation.donationQuantity.quantity += totalQuantity;
            
            // Reopen donation if it was closed
            if (order.donation.listingStatus === 'closed') {
                order.donation.listingStatus = 'open';
            }
            
            // Only remove order reference if orders field exists and is an array
            if (order.donation.orders && Array.isArray(order.donation.orders)) {
                order.donation.orders = order.donation.orders.filter(
                    orderRef => orderRef.toString() !== order._id.toString()
                );
            }
            
            await order.donation.save({ session });
        }

        // Update related request if exists
        if (order.request) {
            order.request.status = 'cancelled';
            order.request.cancelledAt = new Date();
            await order.request.save({ session });
        }

        // Save the updated order
        await order.save({ session });

        // Commit the transaction
        await session.commitTransaction();

        res.status(200).json(
            new ApiResponse(200, order, 'Order cancelled successfully. Quantity restored to donation.')
        );
    } catch (error) {
        // If an error occurs, abort the transaction
        await session.abortTransaction();
        throw error;
    } finally {
        // End the session
        session.endSession();
    }
});

export const getAvailableOrdersForRider = asyncHandler(async (req, res) => {
  const orders = await Order.find({
    orderStatus: { $in: ['ready_for_pickup', 'processing'] },
    "pickupDetails.rider": { $exists: false }
  })
    .populate('donor', 'fullName')
    .populate('receiver', 'fullName')
    .populate('donation', 'donationFoodTitle listingImages')
    .sort({ createdAt: -1 });

  res.status(200).json(new ApiResponse(200, orders, "Available orders for riders"));
});
