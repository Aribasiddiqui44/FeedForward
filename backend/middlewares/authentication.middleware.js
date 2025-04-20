import ApiError from './../utils/ApiError.js';
import asyncHandler from './../utils/asyncHandler.js';
import jwt from 'jsonwebtoken';
import User from './../models/user.model.js';

const verifyJWT = asyncHandler ( async (
    req,
    res,
    next
) => {
    try{
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer", "");
        const cookieRefreshToken = req.cookies?.refreshToken;

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

        req.user = user;
        return next();

    } catch( error ) {
        throw new ApiError(
            401,
            error?.message || "Invalid access token"
        );
    }
});

module.exports = verifyJWT;