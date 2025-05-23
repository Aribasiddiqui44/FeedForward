import mongoose, {Schema} from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Donor } from "./donor.model.js";
import { Rider } from "./rider.model.js";
import { Receiver } from "./receiver.model.js";

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
            default: 'noRole',
            enum: ['noRole', 'donor', 'receiver', 'volunteer', 'admin']
        },
        phoneNumber: {
            type: String,
            // unique: true,

        },
        isPhoneNumberVerified: {
            type: Boolean,
            default: false
        },
        address: {
            address: { type: String },
            longitude: { type: Schema.Types.Decimal128 },
            latitude: { type: Schema.Types.Decimal128 },
            subregion: { type: String },
            longitudeDelta: { type: Schema.Types.Decimal128 },
            latitudeDelta: { type: Schema.Types.Decimal128 }


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

userSchema.methods.generateAccessToken = async function () {
    let roleId = ''
    if(this.userRole === 'donor'){
        let donor = await Donor.findOne({userRegisteredTheOrg: this._id});
        if(donor) roleId = donor._id;
    } else if(this.userRole === 'rider'){
        let rider = await Rider.findOne({volunteerUserId: this._id});
        if(rider) roleId = rider._id;
    } else if (this.userRole === 'receiver'){
        let receiver = await Receiver.findOne({userRegisteredTheOrg: this._id});
        if (receiver) roleId = receiver._id;
    }
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            fullName: this.fullName,
            roleId: roleId
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    );
};

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
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