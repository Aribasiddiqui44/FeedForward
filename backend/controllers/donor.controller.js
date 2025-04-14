import Donor from './../models/donor.model.js';
import User from './../models/user.model.js';

import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';

const postDonorForm = asyncHandler (async (req, res) => {
    const {
        orgName,
        orgEmail,
        address,
        city,
        country,
        contactNo,
        postalCode,
        isAgreedToTermsAndConditions
    } = req.body;

    if(
        [orgName, orgEmail, address, city, country, contactNo, postalCode, isAgreedToTermsAndConditions].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required");
    };

    const existingDonor = await Donor.findOne({
        $or: [
            { orgEmail },
        ]
    });
    if(existingDonor) {
        throw new ApiError(401, "Organization with same email already existed, if you are branch of same organization then contact our support team.")
    };

    const donor = new Donor({
        "donorOrganizationName": orgName,
        "orgorganizationEmail": orgEmail,
        // address[0].location : address,
        "city": city,
        "country": country,
        "contactNo": conta
    })
})

export {

    
}