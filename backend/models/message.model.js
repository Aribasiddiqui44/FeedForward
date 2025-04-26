import mongoose, { Schema } from "mongoose";
import { User } from "./user.model.js";
import { Donor } from "./donor.model.js";
import { Receiver } from "./receiver.model.js";
import { Rider } from "./rider.model.js";

const inAppChatSchema = new Schema({
    
});

export const InAppChat = mongoose.model('InAppChat', inAppChatSchema);