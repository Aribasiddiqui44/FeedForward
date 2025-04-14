import { v2 as Cloudinary } from 'cloudinary';
import fs from 'fs';

//cofiguring cloudinary service
Cloudinary.config(
    {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
      api_key: process.env.CLOUDINARY_API_KEY, 
      api_secret: process.env.CLOUDINARY_API_SECRET
    }
);
// function for uploading on cloudinary.
const uploadOnCloudinary = async (localFilePath) => {
    try {
      //if no local file path provided then simpley return null.
      if (!localFilePath) return null;
  
      //uploading file on CLoudinary
      const response = await Cloudinary.uploader.upload(
        localFilePath,
        //providing upload options as second parameter.
        {
          resource_type: "auto"
        }
      );
  
      //file upload successfully.
      console.log("file Uploaded successfully on Cloudinary");
      console.log("File is uploaded and the url is : ", response.url);
      console.log("The response object is : ", response);
  
      return response;
    
    } catch (error) {
      fs.unlinkSync(localFilePath); // removes the locally saved file present at local file path for upload on cloudinary, as teh operation failed.
  
      return null;
  
    }
  };
  
export { uploadOnCloudinary };