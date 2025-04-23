import mongoose, { Schema } from 'mongoose';
import {User} from './user.model.js';
import { Receiver } from './receiver.model.js';

const systemFAQSchema = new Schema({
    question: {type: String},
    answer: { type: String },
    addedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    type: { type: String }, // charity, system,
    npoId: {
        type: Schema.Types.ObjectId,
        ref: 'Receiver'
    }
},{
    timestamps: true
});
export const SystemFAQ = mongoose.model('SystemFAQ', systemFAQSchema);