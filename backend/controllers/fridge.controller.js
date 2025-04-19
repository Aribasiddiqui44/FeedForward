import ApiError from "./../utils/ApiError.js";
import asyncHandler from "./../utils/asyncHandler.js";
import ApiResponse from "./../utils/ApiResponse.js";
import { Fridge } from "./../models/fridge.model.js";
import { Receiver } from "./../models/receiver.model.js";

const postAddFridge = asyncHandler( async(req, res) => {
    const { orgName, orgId, fridgeCode, fridgeAddress, timings } = req.body;
    let newFridge = new Fridge({
        orgName,
        orgId,
        fridgeCode,
        timings
    });
    newFridge.fridgeAddress.push({
        location: fridgeAddress.location,
        googleLocatio: fridgeAddress.googleLocatio,
        near: fridgeAddress.near
    });
    await newFridge.save();
    if( !newFridge._id ){
        return new ApiError(500, "Internal Server Error when creating fridge");
    }
    return res.status(201).json(
        new ApiResponse(201, newFridge, "Fridge added successfully")
    );
});

const patchAprrovedByAdmin = asyncHandler( async(req, res) => {
    const { fridgeId, status} = req.body;
    if(req.user.role === 'admin'){
        return new ApiError(400, "Unauthorized request");
    };
    let fridge = await Fridge.findById(fridgeId);
    if ( !fridge ){
        return new ApiError(401, "Bad Request");
    };
    fridge.adminApprovedStatus.isApproved = status;
    fridge.adminApprovedStatus.adminId = req.user._id;
    await fridge.save();

    return new ApiResponse(201, fridge, "Successfully updated status");
});

export {
    postAddFridge,
    patchAprrovedByAdmin
}