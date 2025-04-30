import { Rider } from "./../models/rider.model.js";
import { Donor } from "./../models/donor.model.js";
import { User } from "./../models/user.model.js";
import asyncHandler from "./../utils/asyncHandler.js";
import ApiError from "./../utils/ApiError.js";
import ApiResponse from "./../utils/ApiResponse.js";
import uploadOnCloudinary from "../services/cloudinary.service.js";

const postRiderForm = asyncHandler( async(req, res) => {
    const {riderName, riderContact, contactDes, riderEmail} = req.body;
    let checkExistingRider = await Rider.findOne({riderEmail});
    if(checkExistingRider){
        return new ApiError(401, "Bad Request ! volunteer with this email already existed.");
    };
    let newRider = new Rider({
        riderName,
        riderEmail,
        volunteerUserId: req.user._id
    });
    newRider.riderContacts.push({
        contact: riderContact,
        description: contactDes
    });
    await newRider.save();
    res.status(201, newRider,"Volunteer successfully created.")

});
const patchAddAvailableTimings = asyncHandler( async(req, res) => {
    const {riderId, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday} = req.body;
    let rider = await Rider.findById(riderId);
    if ( !rider ){
        new ApiError(401, "Bad Request! Rider does not exist.")
    }
    const dayConfigs={Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday};

    for (const [dayName, dayData] of Object.entries(dayConfigs)) {
        rider.availability.push({
          day: dayName,
          availableDayTimings: {
            from: dayData.day.from,
            to: dayData.day.to
          },
          availableNightTimings: {
            from: dayData.night.from,
            to: dayData.night.to
          }
        });
      };
      await rider.save();
      res.status(201).json(
        new ApiResponse(201, rider, "Successfully updated available timings")
      )

});
const patchCNIC = asyncHandler( async(req, res) => {
    const { riderId } = req.body;
    if ( !riderId ) {
      throw new ApiError(400, "Bad Request, rider id not found.")
    };
    const CNIC_front_image_path = req.files?.CNIC_front[0]?.path;
    const CNIC_back_image_path = req.files?.CNIC_back[0]?.path;
    if ( !CNIC_front_image_path || !CNIC_back_image_path ) {
      throw new ApiError(400, "Image not found")
    };
    //uploading on Cloudinary.
    const frontCNICImg = await uploadOnCloudinary(CNIC_front_image_path);
    const backCNICImg = await uploadOnCloudinary(CNIC_back_image_path)
    if ( !frontCNICImg || !backCNICImg ) {
      throw new ApiError(
        500,
        "Internal Server Error! Somehting went wrong when uploading files, try again."
      );
    };

    // let rider = await Rider.findById(riderId);
    let rider = await Rider.findByIdAndUpdate(
      riderId,
      {
        $set: {
          cnic: {
            front: frontCNICImg.url,
            back: backCNICImg.url
          }
        }
      },
      {
        new: true
      }
    );
    if ( !rider ) {
      throw new ApiError(500, "Internal Server Error when updating rider.")
    };
    return res.status(201).json(
      new ApiResponse(201, rider, "Added CNIC successfully.")
    )
});

export {
  postRiderForm,
  patchAddAvailableTimings,
  patchCNIC
}