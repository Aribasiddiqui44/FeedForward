import mongoose, {Schema} from "mongoose";
import { OrganizationBlog } from "./organizationBlog.model";

const donorSchema = new Schema(
    {
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
                // houseNumber: {
                //     type: String
                // },
                // area: {
                //     type: String
                // },
                // street: {
                //     type: String
                // },
                // state: {
                //     type: String
                // },
                // country: {
                //     type: String,
                //     default: "Pakistan"
                // },
                // postalCode: {
                //     type: String
                // },
                // near: {
                //     type: String // near some known place
                // },
                // otherComment: {
                //     type: String
                // },
                location: {
                    type: String
                },
                googleMapLocation: {
                    type: String
                },
                Coordinates: {
                    longitude: {type: String},
                    latitude: {type: String}
                },
                isCurrent: {type: Boolean, default: true}
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
        donationsOfDonor: {
            //complete this after creating donation table.
        },
        hasRiders: {
            // rider object which are from the donor side, associated with their organization and work for them only, for their deliveries.
        },
        parentOrganizationOfDonor: {
            type: Schema.Types.ObjectId,
            ref: Donor
        },
        linksOfTheOrganization: [
            {
                Url: {type: String},
                title: {type: String},
                information: {type: String} //if any 
            }
        ],
        organizationBlogs: [
            {
                type: Schema.Types.ObjectId,
                ref: OrganizationBlog
            }
        ]
},
{
    timestamps: true
}
);
export const Donor = mongoose.model("Donor", donorSchema);