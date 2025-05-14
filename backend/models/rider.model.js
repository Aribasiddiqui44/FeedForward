import mongoose, { Schema } from "mongoose";
import { Donor } from "./donor.model.js";
import { User } from "./user.model.js";

const riderSchema = new Schema({
   volunteerUserId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    userDetails: {
        name: { type: String },
        email: { type: String },
        phoneNumber: { type: String }
    },

    age: { type: Number },
    vehicleType: { type: String },
    hasRiderExperience: { type: String, enum: ["yes", "no", "some"] },
    motivationStatement: { type: String },
    weeklyAvailableHours: { type: Number },
    
    // Document fields
    profilePhoto: { type: String },
    cnic: {
        front: { type: String },
        back: { type: String },
        number: { type: String }
    },
    drivingLicense: {
        front: { type: String },
        back: { type: String }
    },

    

    // availableTimings: [
    //     {
    //         day: { type: String },
    //         availableDayTimings: {
    //             from: { type: String },
    //             to: { type: String }
    //         },
    //         availableNightTimings: {
    //             from: { type: String },
    //             to: { type: String }
    //         }
    //     }
    // ],

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

}, {
    timestamps: true
});

export const Rider = mongoose.model("Rider", riderSchema);


