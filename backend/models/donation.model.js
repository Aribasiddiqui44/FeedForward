import mongoose, { Schema } from "mongoose";

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
            timeUnit: { type: String } // e.g., "days"
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

    isDonationCompletedSuccessfully: {
        isCompleted: { type: Boolean, default: false },
        comments: { type: String }
    }
}, {
    timestamps: true
});

export const Donation = mongoose.model("Donation", donationSchema);
