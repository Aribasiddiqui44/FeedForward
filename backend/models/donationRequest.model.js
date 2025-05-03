// donationRequest.model.js
import mongoose, { Schema } from "mongoose";

const donationRequestSchema = new Schema({
    donation: {
        type: Schema.Types.ObjectId,
        ref: 'Donation',
        required: true
    },
    requester: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiverOrg: {
        id: { type: Schema.Types.ObjectId, ref: 'User' },
        name: { type: String }
    },
    quantity: {
        type: Number,
        required: true,
        min: 0.1
    },
    proposedPrice: {
        type: Number,
        min: 0
    },
    status: {
        type: String,
        enum: ["pending", "negotiating", "accepted", "rejected", "completed"],
        default: "pending"
    },
    messages: [{
        senderType: { type: String, enum: ["donor", "receiver"] },
        message: String,
        priceOffer: Number,
        createdAt: { type: Date, default: Date.now }
    }],
    finalPrice: Number,
    pickupDetails: {
        scheduledTime: Date,
        rider: {
            riderId: { type: Schema.Types.ObjectId, ref: 'Rider' },
            name: String,
            phone: String
        },
        completedAt: Date
    },
    feedback: {
        donorComment: String,
        receiverComment: String,
        rating: { type: Number, min: 1, max: 5 }
    }
}, { timestamps: true });

export const DonationRequest = mongoose.model("DonationRequest", donationRequestSchema);