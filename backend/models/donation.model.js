import mongoose, { Schema } from "mongoose";
import { Donor } from './../models/donor.model.js';
import { User } from "./user.model.js";
import { Receiver } from "./receiver.model.js";
import { Rider } from "./rider.model.js";
import { DonationRequest } from "./donationRequest.model.js";
const donationSchema = new Schema({
    donationFoodTitle: { type: String },

            foodItemName: { type: String },
            foodItemDescription: { type: String },
            foodItemQuantity: {
                quantity: { type: Number },
                unitOfMeasurement: { type: String, default: "kg" }
            },
            donatedBy: {
                donorId:{
                    type: Schema.Types.ObjectId,
                    ref: 'User',
                    required: true
                },
                fullName: {
                    type: String
                },
                phoneNumber: {
                    type: String,
                },

            },
            donatedTo: {
                receiverId: {
                    type: Schema.Types.ObjectId,
                    ref: 'User'
                },
                receiverOrgName: { type: String },
                receiverOrgEmail: { type: String },
                receivedOn: { type: Date }
            },
            riderInformation: {
                riderId: {
                    type: Schema.Types.ObjectId,
                    ref: 'Rider'
                },
                riderName: { type: String },
                riderPhone: { type: String }
            },
            // listingImages: {
            //     url1: {type: String, default: null},
            //     url2: {type: String, default: null},
            //     url3: {type: String, default: null}
            // }
            listingImages: []
        ,
    listingType: {
        type: String,
        // donation / selling
        enum: ["donation", "order"]
    },
    donationType: {
        type: String,
        enum: ["Hadiya", "Sadqa"] // have to add description as well of each.
    },
    allowFreeRequests: {
        type: Boolean,
        default: false 
    },
    listingStatus: {
        type: String,
        enum: ["open", "closed", "completed", "cancelled"],
        default: "open"
    },
    donationDescription: { type: String },

    donationUnitPrice: {
        value: { type: Number },
        currency: { type: String },
        minPricePerUnit: { type: Number } 
    },
    donationQuantity: {
        quantity: { type: Number },
        measurementUnit: { type: String, default: "kg" }
    },

    donationInitialPickupTimeRange: {
        startingTime: { type: String },
        endingTime: { type: String }
    },

    donationPickupInstructions: [{ type: String }],

    foodExpiry: {
        bestBefore: { type: Date, default: Date.now },
        listedFor: {
            period: { type: Number },
            timeUnit: { type: String }
        }
    },
    isRiderAssigned: { type: Boolean, default: false },
    rider: {
        riderId: {
            type: Schema.Types.ObjectId,
            ref: 'Rider'
        },
        riderName: { type: String },
        riderPhone: { type: String }
    },
    donationTrackingStatus: {
        type: String,
        default: "waiting for receiver",
        enum: ["waiting for receiver", "preparation", "Volunteer reached", "Collected & on the way", "reached destination", "successfully handed donation"]
    }
    ,
    donatedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    isDonationCompletedSuccessfully: {
        isCompleted: { type: Boolean, default: false },
        comments: { type: String }
    },
    requests: [{
        type: Schema.Types.ObjectId,
        ref: 'DonationRequest'
    }],
    // storing images uploaded by the donor
    // donationImages: {
    //     type: [String], // Array of strings to store URLs of the images
    //     validate: {
    //         validator: function (value) {
    //             return value.length <= 10; // Ensures that no more than 10 images are uploaded
    //         },
    //         message: 'You can upload a maximum of 10 images.'
    //     }
    // }
}, {
    timestamps: true
});
// have to add impact fields in this model.js, and impacy calculation in donation.controller.js


export const Donation = mongoose.model("Donation", donationSchema);
