// // donationRequest.model.js
// import mongoose, { Schema } from "mongoose";

// const donationRequestSchema = new Schema({
//     donation: {
//         type: Schema.Types.ObjectId,
//         ref: 'Donation',
//         required: true
//     },
//     requester: {
//         type: Schema.Types.ObjectId,
//         ref: 'User',
//         required: true
//     },
   
//     receiverOrg: {
//         id: { type: Schema.Types.ObjectId, ref: 'User' },
//         name: { type: String }
//     },
//     quantity: {
//         type: Number,
//         required: true,
//         min: 0.1
//     },
//     proposedPrice: {
//         type: Number,
//         min: 0
//     },
//     status: {
//         type: String,
//         enum: ["pending", "negotiating", "accepted", "rejected", "completed"],
//         default: "pending"
//     },
//     messages: [{
//         senderType: { type: String, enum: ["donor", "receiver"] },
//         message: String,
//         priceOffer: Number,
//         createdAt: { type: Date, default: Date.now }
//     }],
//     finalPrice: Number,
//     pickupDetails: {
//         scheduledTime: Date,
//         rider: {
//             riderId: { type: Schema.Types.ObjectId, ref: 'Rider' },
//             name: String,
//             phone: String
//         },
//         completedAt: Date
//     },
//     feedback: {
//         donorComment: String,
//         receiverComment: String,
//         rating: { type: Number, min: 1, max: 5 }
//     }
// }, { timestamps: true });

// export const DonationRequest = mongoose.model("DonationRequest", donationRequestSchema);

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
    requestType: {
        type: String,
        enum: ["explicit_free","free", "negotiation", "direct"],
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 0.1
    },
    proposedPrice: {
        type: Number,
        min: 0,
        required: function() {
            return this.requestType === 'negotiation';
        }
    },
    status: {
        type: String,
        enum: ["pending", "negotiating", "accepted", "rejected", "completed","cancelled"],
        default: "pending"
    },
    finalPrice: {
        type: Number,
        min: 0,
        required: function() {
            return this.status === 'accepted' || this.status === 'completed';
        }
    },
    paymentMethod: {
        type: String,
        enum: ["cash_on_pickup", "bank_transfer", "card"],
        required: function() {
            return this.requestType === 'direct';
        }
    },
    negotiationHistory: [{
        type: {
            type: String,
            enum: ["offer", "counter", "accept", "reject"]
        },
        price: Number,
        message: String,
        by: { 
            type: String,
            enum: ["donor", "receiver"]
        },
        createdAt: { type: Date, default: Date.now }
    }],
    pickupDetails: {
        scheduledTime: {
            start: String,
            end: String
          },
        rider: {
            riderId: { type: Schema.Types.ObjectId, ref: 'User' },
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
}, { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for request number
donationRequestSchema.virtual('requestNumber').get(function() {
    return `REQ-${this._id.toString().slice(-6).toUpperCase()}`;
});

export const DonationRequest = mongoose.model("DonationRequest", donationRequestSchema);