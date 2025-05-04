import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

const checkRole = (allowedRoles) => {
    return asyncHandler(async (req, res, next) => {
        try {
            // If allowedRoles is a string, convert it to array
            const roles = typeof allowedRoles === 'string' ? [allowedRoles] : allowedRoles;
            
            // Check if user has one of the allowed roles
            if (!roles.includes(req.user.userRole)) {
                throw new ApiError(403, 'You do not have permission to access this resource');
            }
            
            next();
        } catch (error) {
            throw new ApiError(error.statusCode || 403, error.message || 'Forbidden');
        }
    });
};

export { checkRole };