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

const completeVolunteerProfile = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const {
        age,
        vehicleType,
        hasRiderExperience,
        motivationStatement,
        weeklyAvailableHours,
        cnicNumber
    } = req.body;

    // Check user
    const user = await User.findById(userId);
    if (!user || user.userRole !== "volunteer") {
        throw new ApiError(400, "Invalid volunteer user");
    }

    // Update rider profile
    const rider = await Rider.findOneAndUpdate(
        { volunteerUserId: userId },
        {
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
            "cnic.number": cnicNumber
        },
        { upsert: true, new: true }
    ); 

    return res.status(200).json(
        new ApiResponse(200, rider, "Volunteer profile completed successfully")
    );
});

const uploadVolunteerDocuments = asyncHandler(async (req, res) => {
    const { userId } = req.params;    
    const user = await User.findById(userId);
    if (!user || user.userRole !== "volunteer") {
        throw new ApiError(400, "Invalid volunteer user");
    }

    const rider = await Rider.findOne({ volunteerUserId: userId });
    if (!rider) {
        throw new ApiError(404, "Complete volunteer profile first");
    }

    // Process file uploads
    const fileUpdates = {};
    const fileFields = [
        'profilePhoto', 'cnicFront', 'cnicBack', 
        'licenseFront', 'licenseBack'
    ];

    await Promise.all(fileFields.map(async (field) => {
        if (req.files?.[field]?.[0]?.path) {
            const upload = await uploadOnCloudinary(req.files[field][0].path);
            switch(field) {
                case 'profilePhoto':
                    fileUpdates.profilePhoto = upload.url;
                    break;
                case 'cnicFront':
                    fileUpdates['cnic.front'] = upload.url;
                    break;
                case 'cnicBack':
                    fileUpdates['cnic.back'] = upload.url;
                    break;
                case 'licenseFront':
                    fileUpdates['drivingLicense.front'] = upload.url;
                    break;
                case 'licenseBack':
                    fileUpdates['drivingLicense.back'] = upload.url;
                    break;
            }
        }
    }));

    const updatedRider = await Rider.findByIdAndUpdate(
        rider._id,
        { $set: fileUpdates },
        { new: true }
    );

    return res.status(200).json(
        new ApiResponse(200, updatedRider, "Documents uploaded successfully")
    );
});

const patchAddAvailableTimings = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday } = req.body;
    
    const rider = await Rider.findOne({ volunteerUserId: userId });
    if (!rider) {
        throw new ApiError(404, "Rider not found");
    }

    const dayConfigs = { Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday };

    // Clear existing availability
    rider.availability = [];

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
    return res.status(201).json(
        new ApiResponse(201, rider, "Successfully updated available timings")
    );
});

// Remove the patchCNIC controller since it's now handled by uploadVolunteerDocuments

export {
    completeVolunteerProfile,
    uploadVolunteerDocuments,
    patchAddAvailableTimings
};