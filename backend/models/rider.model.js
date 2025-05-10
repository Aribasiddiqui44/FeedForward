import mongoose, { Schema } from "mongoose";
import { Donor } from "./donor.model.js";
import { User } from "./user.model.js";

const riderSchema = new Schema({
    volunteerUserId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    riderName: { type: String },

    riderContacts: [
        {
            phoneNumber: { type: String },
            type: { type: String, enum: ["mobile", "landline", "whatsapp"], default: "mobile" }
        }
    ],

    riderEmail: { type: String },

    availableTimings: [
        {
            day: { type: String },
            availableDayTimings: {
                from: { type: String },
                to: { type: String }
            },
            availableNightTimings: {
                from: { type: String },
                to: { type: String }
            }
        }
    ],

    isAssociatedWithAnOrganization: {
        orgName: { type: String },
        isAvailableForOtherOrg: { type: Boolean, default: false },
        availableForOnlyTheseOrganizations: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Donor'
            }
        ]
    },
    pastVolunteerWork: [],
    cnic: {
        front: { type: String },
        back: { type: String }
    },
    profilePhotoUrl: {
        type: String
    },
    drivingLicenseUrl: {
        type: String
    },
    vehicleType: {
        type: String,
        enum: ["bike", "bicycle", "car"]
    },
    intentionToBeFeedForward: {
        type: String
    }
}, {
    timestamps: true
});

export const Rider = mongoose.model("Rider", riderSchema);
