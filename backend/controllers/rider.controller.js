// import { Rider } from "./../models/rider.model.js";
// import { Donor } from "./../models/donor.model.js";
// import { User } from "./../models/user.model.js";
// import asyncHandler from "./../utils/asyncHandler.js";
// import ApiError from "./../utils/ApiError.js";
// import ApiResponse from "./../utils/ApiResponse.js";
// import uploadOnCloudinary from "../services/cloudinary.service.js";

// const completeVolunteerProfile = asyncHandler(async (req, res) => {
//     const { userId } = req.params;
//     const {
//         age,
//         vehicleType,
//         hasRiderExperience,
//         motivationStatement,
//         weeklyAvailableHours,
//         cnicNumber
//     } = req.body;

//     // Check if user exists and is a volunteer
//     const user = await User.findById(userId);
//     if (!user || user.userType !== "volunteer") {
//         throw new ApiError(400, "Invalid volunteer user");
//     }

//     // Create or update rider profile
//     let rider = await Rider.findOneAndUpdate(
//         { volunteerUserId: userId },
//         {
//             age,
//             vehicleType,
//             hasRiderExperience,
//             motivationStatement,
//             weeklyAvailableHours,
//             "cnic.number": cnicNumber
//         },
//         { upsert: true, new: true }
//     );

//     return res.status(200).json(
//         new ApiResponse(200, rider, "Volunteer profile completed successfully")
//     );
// });

// const uploadVolunteerDocuments = asyncHandler(async (req, res) => {
//     const { userId } = req.params;
    
//     // Verify user is a volunteer
//     const user = await User.findById(userId);
//     if (!user || user.userType !== "volunteer") {
//         throw new ApiError(400, "Invalid volunteer user");
//     }

//     const rider = await Rider.findOne({ volunteerUserId: userId });
//     if (!rider) {
//         throw new ApiError(404, "Complete volunteer profile first");
//     }

//     // Process file uploads
//     const fileUpdates = {};
//     const fileFields = [
//         'profilePhoto', 'cnicFront', 'cnicBack', 
//         'licenseFront', 'licenseBack'
//     ];

//     await Promise.all(fileFields.map(async (field) => {
//         if (req.files?.[field]?.[0]?.path) {
//             const upload = await uploadOnCloudinary(req.files[field][0].path);
//             switch(field) {
//                 case 'profilePhoto':
//                     fileUpdates.profilePhoto = upload.url;
//                     break;
//                 case 'cnicFront':
//                     fileUpdates['cnic.front'] = upload.url;
//                     break;
//                 case 'cnicBack':
//                     fileUpdates['cnic.back'] = upload.url;
//                     break;
//                 case 'licenseFront':
//                     fileUpdates['drivingLicense.front'] = upload.url;
//                     break;
//                 case 'licenseBack':
//                     fileUpdates['drivingLicense.back'] = upload.url;
//                     break;
//             }
//         }
//     }));

//     const updatedRider = await Rider.findByIdAndUpdate(
//         rider._id,
//         { $set: fileUpdates },
//         { new: true }
//     );

//     return res.status(200).json(
//         new ApiResponse(200, updatedRider, "Documents uploaded successfully")
//     );
// });
// const patchAddAvailableTimings = asyncHandler( async(req, res) => {
//     const {riderId, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday} = req.body;
//     let rider = await Rider.findById(riderId);
//     if ( !rider ){
//         new ApiError(401, "Bad Request! Rider does not exist.")
//     }
//     const dayConfigs={Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday};

//     for (const [dayName, dayData] of Object.entries(dayConfigs)) {
//         rider.availability.push({
//           day: dayName,
//           availableDayTimings: {
//             from: dayData.day.from,
//             to: dayData.day.to
//           },
//           availableNightTimings: {
//             from: dayData.night.from,
//             to: dayData.night.to
//           }
//         });
//       };
//       await rider.save();
//       res.status(201).json(
//         new ApiResponse(201, rider, "Successfully updated available timings")
//       )

// });
// const patchCNIC = asyncHandler( async(req, res) => {
//     const { riderId } = req.body;
//     if ( !riderId ) {
//       throw new ApiError(400, "Bad Request, rider id not found.")
//     };
//     const CNIC_front_image_path = req.files?.CNIC_front[0]?.path;
//     const CNIC_back_image_path = req.files?.CNIC_back[0]?.path;
//     if ( !CNIC_front_image_path || !CNIC_back_image_path ) {
//       throw new ApiError(400, "Image not found")
//     };
//     //uploading on Cloudinary.
//     const frontCNICImg = await uploadOnCloudinary(CNIC_front_image_path);
//     const backCNICImg = await uploadOnCloudinary(CNIC_back_image_path)
//     if ( !frontCNICImg || !backCNICImg ) {
//       throw new ApiError(
//         500,
//         "Internal Server Error! Somehting went wrong when uploading files, try again."
//       );
//     };

//     // let rider = await Rider.findById(riderId);
//     let rider = await Rider.findByIdAndUpdate(
//       riderId,
//       {
//         $set: {
//           cnic: {
//             front: frontCNICImg.url,
//             back: backCNICImg.url
//           }
//         }
//       },
//       {
//         new: true
//       }
//     );
//     if ( !rider ) {
//       throw new ApiError(500, "Internal Server Error when updating rider.")
//     };
//     return res.status(201).json(
//       new ApiResponse(201, rider, "Added CNIC successfully.")
//     )
// });

// export {
//   postRiderForm,
//   patchAddAvailableTimings,
//   patchCNIC
// }



import { Rider } from "./../models/rider.model.js";
import { Donor } from "./../models/donor.model.js";
import { User } from "./../models/user.model.js";
import asyncHandler from "./../utils/asyncHandler.js";
import ApiError from "./../utils/ApiError.js";
import ApiResponse from "./../utils/ApiResponse.js";
import uploadOnCloudinary from "../services/cloudinary.service.js";
import {Donation} from "./../models/donation.model.js";



const uploadCNIC = asyncHandler( async(req, res) => {
  
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
    return {
      frontCNICImg,
      backCNICImg
    };

}});
const uploadFormPictures = async(req, res) => {
  try {
    const CNIC_front_image_path = req.files?.CNIC_front[0]?.path;
    const CNIC_back_image_path = req.files?.CNIC_back[0]?.path;
    const profile_pic_path = req.files?.profilePic[0]?.path;
    const license_image_path = req.files?.license[0]?.path;

    if( !CNIC_front_image_path || !CNIC_back_image_path || !profile_pic_path || !license_image_path) {
      throw new ApiError(
        401,
        "Provide the required images."
      );
    };

    const [cnic_front_upload, cnic_back_upload, profile_pic_upload, license_upload] = await Promise.all([
      uploadOnCloudinary(CNIC_front_image_path),
      uploadOnCloudinary(CNIC_back_image_path),
      uploadOnCloudinary(profile_pic_path),
      uploadOnCloudinary(license_image_path)
    ]);
    if( !cnic_front_upload || !cnic_back_upload || !profile_pic_upload || !license_upload) {
      throw new ApiError(500, "Internal Server Error, when uploading files.")
    };

    return {
      cnic_front_upload,
      cnic_back_upload,
      profile_pic_upload,
      license_upload
    };
  } catch (error) {
    throw new ApiError(500, "Internal Server Error,", error);
  }
};
// const postRiderForm = asyncHandler( async(req, res) => {
//     const { riderName, reason, vehicletype } = req.body;
//     let checkExistingRider = await Rider.findOne({riderEmail: req.user.email});
//     if(checkExistingRider){
//         return new ApiError(401, "Bad Request ! volunteer with this email already existed.");
//     };
//     const { cnic_front_upload, cnic_back_upload, profile_pic_upload, license_upload } = await uploadFormPictures(req, res);
//     let newRider = new Rider({
//         riderName,
//         riderEmail: req.user.email,
//         vehicleType: vehicletype,
//         intentionToBeFeedForward: reason,
//         volunteerUserId: req.user._id,
//         cnic: {
//           front: cnic_front_upload.url,
//           back: cnic_back_upload.url
//         },
//         profilePhotoUrl: profile_pic_upload.url,
//         drivingLicenseUrl: license_upload.url
//     });
//     newRider.riderContacts.push({
//         phoneNumber: req.user.phoneNumber
//     });
//     // add logic for uploading three images , CNIC front, CNIC back, and profile photo.
//     await newRider.save();
//     res.status(201, newRider,"Volunteer successfully created.")
// });
// const postRiderForm = asyncHandler(async (req, res) => {
//   const userId = req.params.userId || req.user?._id;
//   const user = await User.findById(userId);
//   if (!user || user.userRole !== "volunteer") {
//     throw new ApiError(400, "Invalid volunteer user");
//   }

//   let rider = await Rider.findOne({ volunteerUserId: userId });

//   // If personal info is present
//   if (req.body.age || req.body.vehicleType || req.body.cnicNumber) {
//     if (!rider) {
//       rider = new Rider({
//         volunteerUserId: userId,
//         userDetails: {
//           name: user.fullName,
//           email: user.email,
//           phoneNumber: user.phoneNumber,
//         },
//         riderEmail: user.email,
//         vehicleType: req.body.vehicleType,
//         age: req.body.age,
//         hasRiderExperience: req.body.hasRiderExperience,
//         motivationStatement: req.body.reason,
//         weeklyAvailableHours: req.body.weeklyAvailableHours,
//         cnic: {
//           number: req.body.cnicNumber,
//         },
//         riderContacts: [{ phoneNumber: user.phoneNumber }]
//       });

//       await rider.save();
//     }

//     return res.status(201).json(new ApiResponse(201, rider, "Volunteer profile saved."));
//   }

//   // If files are present
//   if (req.files) {
//     const {
//       cnic_front_upload,
//       cnic_back_upload,
//       profile_pic_upload,
//       license_upload
//     } = await uploadFormPictures(req, res);

//     const updateFields = {
//       profilePhoto: profile_pic_upload.url,
//       "cnic.front": cnic_front_upload.url,
//       "cnic.back": cnic_back_upload.url,
//       "drivingLicense.front": license_upload.url
//     };

//     const updatedRider = await Rider.findOneAndUpdate(
//       { volunteerUserId: userId },
//       { $set: updateFields },
//       { new: true }
//     );

//     return res.status(200).json(new ApiResponse(200, updatedRider, "Documents uploaded."));
//   }

//   throw new ApiError(400, "No valid data received");
// });

const postRiderForm = asyncHandler(async (req, res) => {
  const userId = req.params.userId;
  const user = await User.findById(userId);
  if (!user || user.userRole !== "volunteer") {
    throw new ApiError(400, "Invalid volunteer user");
  }

  let rider = await Rider.findOne({ volunteerUserId: userId });

  // If this is first submission (personal info)
  if (req.body && req.body.age) {
    const {
      age,
      vehicleType,
      hasRiderExperience,
      motivationStatement,
      weeklyAvailableHours,
      cnicNumber
    } = req.body;

    if (!rider) {
      rider = await Rider.create({
        volunteerUserId: userId,
        userDetails: {
          name: user.fullName,
          email: user.email,
          phoneNumber: user.phoneNumber
        },
        age,
        vehicleType,
        hasRiderExperience,
        motivationStatement,
        weeklyAvailableHours,
        cnic: {
          number: cnicNumber
        }
      });
    } else {
      // Update existing rider
      Object.assign(rider, {
        age,
        vehicleType,
        hasRiderExperience,
        motivationStatement,
        weeklyAvailableHours,
        cnic: {
          ...rider.cnic,
          number: cnicNumber
        }
      });
      await rider.save();
    }
  }

  // If this is document/image upload
  if (req.files && Object.keys(req.files).length > 0) {
    const uploads = {};

    if (req.files?.profilePic?.[0]?.path) {
        console.log("Uploading profilePic from path:", req.files.profilePic[0].path);
        const uploaded = await uploadOnCloudinary(req.files.profilePic[0].path);
        console.log("Uploaded profilePic:", uploaded);
        uploads.profilePhoto = uploaded.url;
        }
    if (req.files?.CNIC_front?.[0]?.path) {
      const uploaded = await uploadOnCloudinary(req.files.CNIC_front[0].path);
      uploads["cnic.front"] = uploaded.url;
    }
    if (req.files?.license?.[0]?.path) {
      const uploaded = await uploadOnCloudinary(req.files.license[0].path);
      uploads["drivingLicense.front"] = uploaded.url;
    }
    console.log("Uploaded URLs:", {
  profile: uploads.profilePhoto,
  cnic: uploads["cnic.front"],
  license: uploads["drivingLicense.front"]
});

    if (!rider) {
      throw new ApiError(400, "Complete personal info first");
    }

    await Rider.findByIdAndUpdate(rider._id, {
      $set: uploads
    });
  }

  return res.status(200).json(
    new ApiResponse(200, rider, "Rider profile updated")
  );
});


// const getAcceptedOrders = asyncHandler( async(req, res) => {
//   const { riderId } = req.body;
//   // let rider = await Rider.findById(riderId);
//   let acceptedDonations = await Donation.find({ 'rider.riderId': riderId});
//   res.status(200).json(
//     new ApiResponse(200, acceptedDonations,
//       (acceptedDonations.length == 0) ? "Success" : "User has no accepted donations yet."
//     )
//   );
// });

const patchChangeDonationDeliveryStatus = asyncHandler( async(req, res) => {
  const { donationId, riderId, status} = req.body;
  let donation = await Donation.findOne(
    { _id: donationId },
    { 'rider.riderId': riderId }
  );
  donation.listingStatus = status;
  let updateDonationStatus = await Donation.findOneAndUpdate(
    { _id: donationId },
    { "rider.riderId": riderId },
    {
      $set: {
        donationTrackingStatus: status
      }
    },{
      new: true
    }
  );
  if ( !updateDonationStatus ) {
    throw new ApiError(401, "Dontion not found and status not updated.")
  };
  return res.status(201).json(
    new ApiResponse(201, updateDonationStatus, "Donation updated successfully.")
  )
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
    patchAddAvailableTimings,
    postRiderForm,
    patchCNIC
};