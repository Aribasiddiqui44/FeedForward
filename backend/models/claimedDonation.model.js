import mongoose, {Schema} from "mongoose";
import { Receiver } from "./receiver.model.js";
import { Donor } from "./donor.model.js";
import { Donation } from "./donation.model.js";
import { Rider } from "./rider.model.js";
const claimedDonationSchema = new Schema({

});
export const ClaimedDonation = mongoose.model('ClaimedDonation', claimedDonationSchema);