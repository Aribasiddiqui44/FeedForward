import mongoose, {Schema} from "mongoose";
import { User } from "./user.model.js";

const userNotificationSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    notifications: [
        {
            notification: {
                title: {type: String},
                body: { type: String },
                isRead: {type: Boolean, default: false}
            }
        }
    ]
});

export const UserNotification = mongoose.model("UserNotification", userNotificationSchema);
