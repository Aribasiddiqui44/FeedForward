import mongoose, {Schema} from "mongoose";
import { Receiver } from "./receiver.model.js";
import { Donor } from "./donor.model.js";
import { Donation } from "./donation.model.js";
import { Rider } from "./rider.model.js";
const claimedDonationSchema = new Schema({
    donation: {
        id: {
            type: Schema.Types.ObjectId,
            ref: 'Donation'
        },
        foodItemName: { type: String },
        foodItemQuantity: { type: String }
    },
    donorId: {
        id: {
                    type: Schema.Types.ObjectId,
                    ref: 'Donor'
        },
        orgName: { type: String },
        orgEmail: { type: String }
    },
    receiver: {
        id: {
            type: Schema.Types.ObjectId,
        ref: 'Receiver'
        },
        orgName: {type: String},
        orgEmail: {type: String}
    },
    volunteer: {
            id: {
                type: Schema.Types.ObjectId,
                ref: 'Rider'
            },
            name: { type: String},
            contact: {type: String}
    }
});
export const ClaimedDonation = mongoose.model('ClaimedDonation', claimedDonationSchema);