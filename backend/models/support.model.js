import mongoose, { Schema } from "mongoose";
import {User} from './user.model.js';

const supportSchema = new Schema({
    askedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    query: {type: String},
    queryType: {type: String},
    queryTypeDescription: {type: String},
    reply: {type: String},
    status: {
        type: String //pending, answered.
    },
    answeredBy: {
        id: {
            
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: null
        },
        name: { type: String, default: null }
    },
    answeredAt: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});

export const Support = mongoose.model('Support', supportSchema);