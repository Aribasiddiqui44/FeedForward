import mongoose, {Schema} from "mongoose";

const organizationBlogSchema = new Schema({
    blogLink: {
        type: String
    }
},
{
    timestamps: true
});
export const OrganizationBlog = mongoose.model("OrganizationBlog", organizationBlogSchema);
