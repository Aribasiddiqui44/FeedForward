import mongoose, {Schema, Types} from "mongoose";
import { Donor } from "./donor.model";

const riderSchema = new Schema({
    riderName: {
        type: String
    },
    riderContacts: [{
        type: String
    }],
    riderEmail: {
        type: String,
    },
    availableTimings: [
        {
            day: {type: String},
            availableTimings: {
                from: {type: String},
                to: {type: String}
            }
        } 
    ],
    isAssociatedWithAnOrganization: {
        orgName: {type: String},
        isAvailableForOtherOrg: {type: Boolean, default: false},
        availableForOnlyTheseOrganizations: [
            {
                type: Schema.Types.ObjectId,
                ref: Donor
            }
        ]
    },
    cnic: {
        url: {
            type: String
        },
        cnicNumber: {
            type: Number
        }
    }
},
{
    timestamps: true
}
);

export const Rider = mongoose.model("Rider", riderSchema);
