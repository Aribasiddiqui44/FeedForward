import mongoose, { Schema } from "mongoose";
import {User} from './user.model.js';

const supportSchema = new Schema({
    query: {type: String},
    queryType: {type: String},
    queryTypeDescription: {type: String},
    reply: {type: String},
    answeredBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

export const Support = mongoose.model('Support', supportSchema);