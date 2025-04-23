import {User} from './../models/user.model.js';
import asyncHandler from './../utils/asyncHandler.js';
import ApiError from './../utils/ApiError.js';
import ApiResponse from './../utils/ApiResponse.js';

const generateAccessAndRefresfTokens = async(userId) => {
    try {
        let user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({
            validateBeforeSave: false
        });

        return {
            accessToken,
            refreshToken
        }
    } catch( error ) {
        throw new ApiError(
            500,
            "Something went wrong while generating tokens"
        );
    }
};

// const post_CreateUser_SignUp_Register_Initial = asyncHandler(
//     async(req, res) => {
//         const { firstname, middlename, lastname, email, password, role} = req.body;
//         if(
//             [fullname, email, password, role].some((field) => field?.trim() === "")
//         ) {
//             throw new ApiError(400, "All fields are required");
//         };

//         // checking if user existed with this email.
//         const existedUser = await User.findOne({
//             email
//         });

//         if( existedUser ) {
//             throw new ApiError(
//                 409,
//                 "User with this email already existed."
//             )
//         };

//         // createing new user if not already exited.
//         const newUser = await User.create({
//             fullName: {firstname, middlename, lastname},
//             email,
//             password,
//             userRole
//         });
//         if ( !newUser._id ) {
//             throw new ApiError(500,
//                 "Internal Server Error. Something went wrong while signup"
//             )
//         } 
//         return res.status(201).json(
//             new ApiResponse(
//                 201,
//                 "User registered successfully"

//             )
//         )
//     }
// );

const post_CreateUser_SignUp_Register_Initial = asyncHandler(
    async(req, res) => {
        // console.log("request")
        const {fullName, email, password, } = req.body;
        // console.log(fullName, " ", email, " ", password);
        if(
            [fullName, email, password].some((field) => field?.trim() === "")
        ) {
            throw new ApiError(400, "All fields are required");
        };

        // checking if user existed with this email.
        const existedUser = await User.findOne({
            email
        });

        if( existedUser ) {
            throw new ApiError(
                409,
                "User with this email already existed."
            )
        };

        // createing new user if not already exited.
        const newUser = await User.create({
            fullName,
            email,
            password
        });
        if ( !newUser._id ) {
            throw new ApiError(500,
                "Internal Server Error. Something went wrong while signup"
            )
        } 
        return res.status(201).json(
            new ApiResponse(
                201,
                "User registered successfully"

            )
        )
    }
);
const patchAddRole = asyncHandler( async(req, res) => {
    const { user_id, role } = req.body;
    let updatedUser = await User.findByIdAndUpdate(
        user_id,
        { userRole: role },
        { new: true }
    );
    if ( !updatedUser ) {
        throw new ApiError(400, "Bad Request! User not found.");
    };
    return res.status(201).json(
        new ApiResponse(201, updatedUser, "Successfully updated the role.")
    );  
});
const post_SignUp_With_Google = asyncHandler( async(req, res) => {

});
const patch_verifyPhoneNumebr_via_OTP = async(phoneNumeber) => {
    
};
const patch_Add_Mobile_Phone = asyncHandler( async(req, res) => {
    const {phoneNumeber} = req.body;
    if( !phoneNumeber ){
        throw new ApiError(400, "User phone number is requried to proceed");
    };
    //Regex for different formats.
    // has to provide regex according to our policy.

    //then test for phone number format.
    // if (!phoneRegex.test(phoneNumber)) {
    //     return res.status(400).json({ message: "Invalid phone number format" });
    //   }

    // updating user and adding phone number.
    const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        {phoneNumeber},
        {new: true, runValidators: true, context: 'query'}
    );
    //validating updation
    if ( !updatedUser ) {
        throw new ApiError(404, "User not found or server error");
    }
    return res.status(200).json(
        new ApiResponse(
            200,
            {user: updatedUser},
            "Phone number successfully updated."
        )
    );

});

const postLoginUser = asyncHandler( async (req, res) => {
    const { email, password } = req.body;
    console.log(email, password)
    if ( !email ) {
        throw new ApiError(400, "email is required.")
    };
    const user = await User.findOne({email});

    if( !user ){
        throw new ApiError(404, "User does not exist.")
    };

    const isPasswordValid = await user.passwordValidator(password);
    if( !isPasswordValid ){
        throw new ApiError(401, "Invalid User credentials(password)")
    };
    const { accessToken, refreshToken } = await generateAccessAndRefresfTokens(user._id);

    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );
    const options = {
        httpOnly: true,
        secure: true,
        path: "/"
    };

    return res
    .status(201)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            201,
            {
                user: loggedInUser,
                accessToken,
                refreshToken
            },
            "User logged in Successfully."
        )
    )
});

const logoutUser = asyncHandler( async(req, res) => {
    await User.findById(
        req.user._id,
        {
            $set: {
                refreshToken: null
            }
        },
        {
            new: true
        }
    );

    // configuring cookie.
    const options = {
        httpOnly: true,
        secure: true
    };

    return res.status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(
        new ApiResponse(
            200,
            {},
            "User logged out"
        )
    )
});

export {
    post_CreateUser_SignUp_Register_Initial,
    postLoginUser,
    logoutUser,
    patchAddRole
}