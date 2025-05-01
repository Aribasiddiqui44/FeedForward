import {Receiver} from '../models/receiver.model.js';
import { User } from '../models/user.model.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import uploadOnCloudinary from '../services/cloudinary.service.js';

const postReceiverForm = asyncHandler( async (req, res) => {
    const { orgName, orgEmail, address, city, country, contactNumber, postalCode, isAggreedToTermsAndConditions } = req.body;
    let checkExistingReceiver = await Receiver.findOne({
        receiverOrgEmail: orgEmail
    });
    if (checkExistingReceiver ) {
        throw new ApiError(401, "Bad Request, Organization with such name already existed, if you are part try add your branch number with name.");
    };
    const receiver = new Receiver({
        // userRegisteredTheOrg: req.user._id,
        receiverOrgName: orgName,
        receiverOrgEmail: orgEmail,
        city,
        country,
        contactNumber,
        postalCode,
        isAggreedToTermsAndConditions
    }); 
    receiver.address.push({
        location: address.location,
        // googleLocation: address.googleLocation,
        near: address.near
    });
    await receiver.save();
    return res.status(201).json(
        new ApiResponse(201, receiver, "NPO/NGO Added Successfully.")
    );
});

const patchOrgImage = asyncHandler( async(req, res) => {
    const { receiverId } = req.body;
    let localImagePath = req.files?.ReceiverImage[0]?.path;
    if( !localImagePath ) {
        throw new ApiError(400, "Image not found.");
    };
    let uplaodedImage = await uploadOnCloudinary(localImagePath);
    if( !uplaodedImage ) {
        throw new ApiError(500, "Internal Server in uploading image, kindly try again.")
    };

    let updatedReceiver = await Receiver.findByIdAndUpdate(
        receiverId,
        {
            $set: {
                orgImageUrl: uplaodedImage.url
            }
        }
    
    );
    if ( !updatedReceiver ) {
        throw new ApiError(500, "Internal Server Error, in updating image.")
    };
    res.status(201).json(
        201,
        updatedReceiver,
        "Success"
    );
});

const patchAddNewAddress = asyncHandler( async(req, res) => {

});

const patchAddOrganizationUrls = asyncHandler(async(req, res) => {

});

const patchUpdateAddress = asyncHandler( async(req, res) => {

});

export {
    postReceiverForm,
    patchAddNewAddress,
    patchAddOrganizationUrls,
    patchUpdateAddress
}