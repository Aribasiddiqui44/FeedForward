import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

const checkifAdmin = asyncHandler( async(
    req, res, next
) => {
    if( !req.user.role == 'admin' ) {
        throw new ApiError(400, "Unauthorized Request, only admins can access this.")
    };
    return next();
});

export {
    checkifAdmin
};