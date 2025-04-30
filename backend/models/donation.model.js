import mongoose, { Schema } from "mongoose";
import { Donor } from './../models/donor.model.js';
import { User } from "./user.model.js";
import { Receiver } from "./receiver.model.js";
import { Rider } from "./rider.model.js";

const donationSchema = new Schema({
    donationFoodTitle: { type: String },

    donationFoodList: [
        {
            foodItemName: { type: String },
            foodItemDescription: { type: String },
            foodItemQuantity: {
                quantity: { type: Number },
                unitOfMeasurement: { type: String, default: "kg" }
            },
            donatedBy: {
                type: Schema.Types.ObjectId,
                ref: 'Donor',
                required: true
            },
            donatedTo: {
                receiverId: {
                    type: Schema.Types.ObjectId,
                    ref: 'Receiver'
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
            }
        }
    ],

    donationDescription: { type: String },

    donationUnitPrice: {
        value: { type: Number },
        currency: { type: String }
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

    goodnessOfFood: {
        bestBefore: { type: Date, default: Date.now },
        listedFor: {
            period: { type: Number },
            timeUnit: { type: String }
        }
    },

    rider: {
        riderId: {
            type: Schema.Types.ObjectId,
            ref: 'Rider'
        },
        riderName: { type: String },
        riderPhone: { type: String }
    },
    donatedBy: {
        type: Schema.Types.ObjectId,
        ref: 'Donor',
        required: true
    },

    isDonationCompletedSuccessfully: {
        isCompleted: { type: Boolean, default: false },
        comments: { type: String }
    },

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

export const Donation = mongoose.model("Donation", donationSchema);
