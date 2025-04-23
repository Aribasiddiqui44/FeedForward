import {Donor} from './../models/donor.model.js';
import {User} from './../models/user.model.js';

import asyncHandler from './../utils/asyncHandler.js';
import ApiError from './../utils/ApiError.js';
import ApiResponse from './../utils/ApiResponse.js';
import uploadOnCloudinary from './../services/cloudinary.service.js';

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
        [orgName, orgEmail, address, city, country, contactNo, postalCode, isAgreedToTermsAndConditions].some((field) => field === undefined)
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
        "contactNumber": contactNo,
        "postalCode": postalCode,
        "isAggreedToTermsAndConditions": isAgreedToTermsAndConditions
    });
    donor.address.push({
        "location": address
    });
    await donor.save();
    return res.status(201).json(
        new ApiResponse(201, donor, "Donor created successfully.")
    );
});

const patchProvideAddressDetails = asyncHandler ( async(req, res) => {
    const {donorId, googleLocation, nearArea} = req.body;
    if(!donorId) {
        new ApiError(401, "Bad Request! Provide donor id")
    }
    let donor = await Donor.findById(donorId);
    if(!donor) {
        new ApiError(401, "Bad Request! Donor with this id do not exist.")
    }
    donor.address[donor.address.length -1].googleLocation = googleLocation;
    donor.address[donor.address.length -1].near = nearArea;
    await donor.save();
    return res.status(201).json(
        new ApiResponse(201, donor, "Successfully updated the address")
    );
});

const patchaddNewAddress = asyncHandler(async(req, res) => {
    const { donorId, location, googleLocation, near } = req.body;
    let donor = await Donor.findById(donorId);
    if( !donor ){
        return new ApiError(401, "Bad Request, unable to find donor.")
    };
    donor.address.push({
        location,
        googleLocation,
        near
    });
    await donor.save();
    return res.status(201).json(
        new ApiResponse(201, donor, "Successfully added new address.")
    );
});

const patchAddImages = asyncHandler( async(req, res) => {
    const {donorId, title, description} = req.body;
    // console.log(title, description);
    if (
        [title, description].some((field) => field?.trim() === '')
    ) {
        throw new ApiError(400, "All fields are required.")
    };
    const imageLocalPath = req.files?.donorImage[0]?.path;
    if ( !imageLocalPath ) {
        throw new ApiError(400, "Image not found.");
    };
    // uploading on Cloudinary.
    const donorImage = await uploadOnCloudinary(imageLocalPath);
    if ( !donorImage ) {
        throw new ApiError(
            500,
            "Internal Server Error! Something went wrong when uploading files on  cloud."
        )
    };
    console.log(donorImage);
    let donor = await Donor.findById(donorId);
    if ( !donor ) {
        throw new ApiError(400, "Bad Request, Unable to find Donor.")
    };
    donor.imagesOfOrganization.push(
        {
            title,
            description,
            imageURL: donor.url 
        }
    );
    await donor.save();
    return res.status(201).json(
        new ApiResponse(201, donor, "Successfully added Image.")
    );
});
const patchAddParentOrganization = asyncHandler( async(req, res) => {
    // update both parent org and branch number of this childs
});

const patchAddOrganizationUrls = asyncHandler( async(req, res) => {
    const { donorId, Urls } = req.body;
    // Urls will be array.
    let donor = await Donor.findById(donorId);
    if ( !donor ) {
        return new ApiError(400, "Bad Request, cant find the donor.")
    };
    Urls.forEach(element => {
        donor.push({
            Url: element.Url,
            title: element.title,
            type: element.type,
            description: element.description
        });
    });
    await donor.save();
    return res.status(201).json(
        new ApiResponse(201, donor, "Successfully updated the urls.")
    );
});

export {
    postDonorForm,
    patchProvideAddressDetails,
    patchaddNewAddress,
    patchAddParentOrganization,
    patchAddOrganizationUrls,
    patchAddImages
}