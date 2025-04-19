import mongoose, { Schema } from "mongoose";

const notificationSchema = new Schema({
    notificationTitle: {type: String},
    notificationType: {type: String},
    notificationTemplate: {type: String},
    notificationDescription: {type: String}
});


export const Notification = mongoose.model("Notification", notificationSchema)