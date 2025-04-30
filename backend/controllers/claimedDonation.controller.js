import { ClaimedDonation } from "../models/claimedDonation.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

const getAllClaimedDonations = asyncHandler( async(req, res) => {
    const { donorId } = req.body;
    let donorDonations = await ClaimedDonation.find({ 'donorId.id': donorId });
    
});


export {
    getAllClaimedDonations
}