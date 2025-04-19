import mongoose, {Schema} from "mongoose";
import { Receiver } from "./receiver.model.js";
import { User } from "./user.model.js";

const fridgeSchema = new Schema({
    orgName: {type: String},
    orgId: {
        type: Schema.Types.ObjectId,
        ref: 'Receiver'
    },
    fridgeCode: {type: String},
    fridgeAddress: [
        {
            location: {type: String},
            googleLocatio: {type: String},
            near: {type: String}
        }
    ],
    timings: {
        
    },
    adminApprovedStatus: {
        isApproved: {type: Boolean},
        adminId: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    }
});
export const Fridge = mongoose.model("Fridge", fridgeSchema);