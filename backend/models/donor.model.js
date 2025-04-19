import mongoose, {Schema, Types} from "mongoose";
import { OrganizationBlog } from "./organizationBlog.model.js";
import { User } from "./user.model.js";
const donorSchema = new Schema(
    {
        userRegisteredTheOrg: {
            type: Schema.Types.ObjectId,
            ref: User
        },
        donorOrganizationName: {
            type: String,
            required: [true, "organization name required"]
        },
        organizationEmail: {
            type: String,

        },
        organizationBranchNumber: {
            type: String // if organization is child of some organization.
        },
        address: [
            {
                location: {
                    type: String
                },
                googleLocation: {type: String},
                near: {type: String, default: "No near building / location provided."}
            }
        ],
        city: {
            type: String,
            required: true
        },
        country: {
            type: String,
            default: "Pakistan"
        },
        contactNumber: {
            type: String, // for ensuring every format we used this type.
            required: true
        },
        postalCode: {
            type: String
        },
        isAggreedToTermsAndConditions: {
            type: Boolean,
            default: true
        },
        impactCreated: [],
        donationsOfDonor: {
            //complete this after creating donation table.
        },
        hasRiders: {
            // rider object which are from the donor side, associated with their organization and work for them only, for their deliveries.
        },
        parentOrganizationOfDonor: {
            type: Schema.Types.ObjectId,
            ref: 'Donor'
        },
        linksOfTheOrganization: [
            {
                Url: {type: String},
                title: {type: String},
                type: {type: String},
                description: {type: String} //if any info/description.
            }
        ],
        organizationBlogs: [
            {
                type: Schema.Types.ObjectId,
                ref: OrganizationBlog
            }
        ],
        organizationAchievements: [

        ]
},
{
    timestamps: true
}
);
export const Donor = mongoose.model("Donor", donorSchema);