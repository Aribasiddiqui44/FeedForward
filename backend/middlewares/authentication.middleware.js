import ApiError from './../utils/ApiError.js';
import asyncHandler from './../utils/asyncHandler.js';
import jwt from 'jsonwebtoken';
import {User} from './../models/user.model.js';
import { Donor } from './../models/donor.model.js';
import { Receiver } from './../models/receiver.model.js';
import { Rider } from './../models/rider.model.js';
const verifyJWT = asyncHandler ( async (
    req,
    res,
    next
) => {
    try{
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "").trim( );
        const cookieRefreshToken = req.cookies?.refreshToken;
        // console.log(token);

        if ( !token ) {
            if ( !cookieRefreshToken ) {
                throw new ApiError(
                    401,
                    "Unauthorized request! please login"
                )
            } else {
                let decodedRefreshToken = jwt.verify(
                    cookieRefreshToken,
                    process.env.REFRESH_TOKEN_SECRET
                );

                let user = await User.findById(decodedRefreshToken._id).select(
                    "-password -refreshToken"
                );

                let accessToken = user.generateAccessToken();

                const options = {
                    httpOnly: true,
                    secure: true,
                    path: '/'
                };
                req.user = user;

                res.cookie("accessToken", accessToken, options);
                return next();
            };

        }
        let decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decodedToken?._id).select(
            "-password -refreshToken"
        );

        if ( !user ) {
            throw new ApiError(401, "Invalid Access Token");
        };

        // roleId = '';
        // if( user.role == 'donor' ) {
        //     let donor = await Donor.findOne({userRegisteredTheOrg: user._id});
        //     role = donor._id;
        // } else if(user.role == 'receiver') {
        //     let receiver = await Receiver.findOne({ userRegisteredTheOrg: user._id });
        //     role = receiver._id;
        // } else if(user.role == 'volunteer') {
        //     let rider = await Rider.findOne({ volunteerUserId: user._id });
        //     role = rider._id; 
        // };
                   
        req.user = user;
        // req.roleId = roleId;
        return next();
    } catch( error ) {
        throw new ApiError(
            401,
            error?.message || "Invalid access token"
        );
    }
});

export{
    verifyJWT
}
    