// order.model.js
import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema({
    request: {
        type: Schema.Types.ObjectId,
        ref: 'DonationRequest',
        required: true
    },
    donor: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiver: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    donation: {
        type: Schema.Types.ObjectId,
        ref: 'Donation',
        required: true
    },
    items: [{
        foodItem: String,
        foodItemId: {
            type: Schema.Types.ObjectId,
            ref: 'Donation'
        },
        quantity: Number,
        unitPrice: Number,
        totalPrice: Number
    }],
    orderTotal: {
        type: Number,
        required: true
    },
    paymentMethod: {
        type: String,
        enum: ["cash_on_pickup", "bank_transfer", "card"],
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ["pending", "completed", "failed", "refunded"],
        default: "pending"
    },
    orderStatus: {
        type: String,
        enum: ["processing", "ready_for_pickup", "in_transit", "delivered", "cancelled"],
        default: "processing"
    },
    pickupDetails: {
        scheduledTime: {
            type: {
              startingTime: String,
              endingTime: String
            },
            required: true
          },
        
        address: String,
        contactNumber: String,
        rider: {
            riderId: { type: Schema.Types.ObjectId, ref: 'Rider' },
            name: String,
            phone: String
        },
        completedAt: Date
    },
    tracking: [{
        status: String,
        timestamp: { type: Date, default: Date.now },
        message: String,
        updatedBy: {
            type: String,
            enum: ["donor", "receiver", "rider", "system"]
        }
    }],
    notes: String,
    cancellationReason: String
}, { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Add virtual for order number
orderSchema.virtual('orderNumber').get(function() {
    return `ORD-${this._id.toString().slice(-6).toUpperCase()}`;
});

export const Order = mongoose.model("Order", orderSchema);