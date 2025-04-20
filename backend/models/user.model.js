import mongoose, {Schema} from "mongoose";
import bcrypt from "bcrypt";
import JWT from "jsonwebtoken";

const userSchema = new Schema(
    {
        fullName: {
            type: String
        },
        password: {
            type: String,
            required: [true, 'Password is required']
        },
        email: {
            type: String,
            required: [true, "email is required field"],
            unique: true,
            match: [
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                "Please provide a valid email address"
            ]
        },
        isEmailVerified: {
            type: Boolean,
            default: false
        },
        userRole: {
            type: String,
            enum: ['donor', 'receiver', 'volunteer']
        },
        phoneNumber: {
            type: String,
            unique: true,

        },
        isPhoneNumberVerified: {
            type: Boolean,
            default: false
        },
        nationality: {
            type: String,

        },
        refreshToken: {
            type: String,

        }
    },
    {
        timestamps: true
    }
);

userSchema.pre("save", async function(next){
    //Hash only if password is modified.
    if(!this.isModified('password')) return next();

    try{
        //hash password generation
        // salt
        const salt = await bcrypt.genSalt(10);

        //hash password
        this.password = await bcrypt.hash(this.password, salt);
        next();
    }catch(error){
        return next(error);
    }

    
})

userSchema.methods.passwordValidator = async function(enteredPassword){
    try{
        return await bcrypt.compare(enteredPassword, this.password);
    }catch(err){
        throw err;
    }
};

userSchema.methods.generateAccessToken = function () {
    return JWT.sign(
        {
            _id: this._id,
            email: this.email,
            fullName: this.fullName,
            role: this.userRole
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    );
};

userSchema.methods.generateRefreshToken = function () {
    return JWT.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    );
};

export const User = mongoose.model("User", userSchema)