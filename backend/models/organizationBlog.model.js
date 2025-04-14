import mongoose, {Schema} from "mongoose";

const organizationBlogSchema = new Schema({

},
{
    timestamps: true
});
export const OrganizationBlog = mongoose.model("OrganizationBlog", organizationBlogSchema);
