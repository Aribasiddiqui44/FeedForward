import mongoose, {Schema} from "mongoose";
import { OrganizationBlog } from "./organizationBlog.model.js";

const receiverSchema = new Schema(
    {
        userRegisteredTheOrg: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        receiverOrgName: {
            type: String,
            required: true
        },
        receiverOrgEmail: {
            type: String
        },
        address: [{
            location: {type: String},
            gogoleLocation: {type: String},
            near: {type: String}
        }],
        city: {type: String, required: true},
        country: {
            type: String,
            default: "Pakistan"
        },
        contactNumber: {type: String, required: true},
        postalCode: {type: String},
        isAggreedToTermsAndConditions: {
            type: Boolean,
            default: true
        },
        donationsReceived: [

        ],
        impactCreated: [],
        hasRiders: [],
        parentOrgOfReceiver: {
            type: Schema.Types.ObjectId,
            ref: 'Receiver'
        },
        linksOfTheOrganization: [
            {
                Url: {type: String},
                title: { type: String},
                type: {type: String},
                description: {type: String}
            }
        ],
        organizationBlogs: [
            {type: Schema.Types.ObjectId,
                ref: OrganizationBlog
            }
        ],
        receiverAchievements: [

        ]
    }
);
export const Receiver = mongoose.model("Receiver", receiverSchema);