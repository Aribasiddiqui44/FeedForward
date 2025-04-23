// import { v2 as Cloudinary } from 'cloudinary';
// import fs from 'fs';

// //cofiguring cloudinary service
// Cloudinary.config(
//     {
//       cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
//       api_key: process.env.CLOUDINARY_API_KEY, 
//       api_secret: process.env.CLOUDINARY_API_SECRET
//     }
// );
// // function for uploading on cloudinary.
// const uploadOnCloudinary = async (localFilePath) => {
//     try {
//       //if no local file path provided then simpley return null.
//       if (!localFilePath) return null;
  
//       //uploading file on CLoudinary
//       const response = await Cloudinary.uploader.upload(
//         localFilePath,
//         //providing upload options as second parameter.
//         {
//           resource_type: "auto"
//         }
//       );
  
//       //file upload successfully.
//       console.log("file Uploaded successfully on Cloudinary");
//       console.log("File is uploaded and the url is : ", response.url);
//       console.log("The response object is : ", response);
  
//       return response;
    
//     } catch (error) {
//       fs.unlinkSync(localFilePath); // removes the locally saved file present at local file path for upload on cloudinary, as teh operation failed.
  
//       return null;
  
//     }
//   };
  
// export { uploadOnCloudinary };

// ES6 import
// import { v2 as Cloudinary } from "cloudinary"; // used ALIAS for v2


// its common JS equivalent
// const Cloudinary = require('cloudinary').v2;
import { v2 as cloudinary} from 'cloudinary';
import fs from 'fs';
// const fs = require("fs");
   
//configuring cloudinary service.


const uploadOnCloudinary = async (localFilePath) => {
  cloudinary.config(
    {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
      api_key: process.env.CLOUDINARY_API_KEY, 
      api_secret: process.env.CLOUDINARY_API_SECRET
      // secure: true          
    }
  );
  try {
    //if no local file path provided then simpley return null.
    if (!localFilePath) return null;
    // console.log(localFilePath)
    //uploading file on CLoudinary
    const response = await cloudinary.uploader.upload(
      localFilePath,
      //providing upload options as second parameter.
      {
        resource_type: "auto"
      }
    ).catch((error) => { console.log(error)});

    //file upload successfully.
    console.log("file Uploaded successfully on Cloudinary");
    console.log("File is uploaded and the url is : ", response.url);
    console.log("The response object is : ", response);

    fs.unlinkSync(localFilePath);

    return response;
  
  } catch (error) {
    fs.unlinkSync(localFilePath); // removes the locally saved file present at local file path for upload on cloudinary, as teh operation failed.

    return null;

  }
};
export default uploadOnCloudinary;


// import { v2 as cloudinary } from 'cloudinary';


// const uploadOnCloudinary = async(localFilePath) => {

  
//   // Configuration
//   cloudinary.config({ 
//         cloud_name: 'dpz7yb8zv', 
//         api_key: '863429586948943', 
//         api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
//     });
    
//     // Upload an image
//     const uploadResult = await cloudinary.uploader
//        .upload(
//           localFilePath, 
//           {
//             reference_type: "auto"
//           }
//        )
//        .catch((error) => {
//          console.log(error);
//        });
    
//     console.log(uploadResult);
    
    // Optimize delivery by resizing and applying auto-format and auto-quality
    // const optimizeUrl = cloudinary.url('shoes', {
    //     fetch_format: 'auto',
    //     quality: 'auto'
    // });
    
    // console.log(optimizeUrl);
    
    // // Transform the image: auto-crop to square aspect_ratio
    // const autoCropUrl = cloudinary.url('shoes', {
    //     crop: 'auto',
    //     gravity: 'auto',
    //     width: 500,
    //     height: 500,
    // });
    
    // console.log(autoCropUrl);    

//         }
// export default uploadOnCloudinary;