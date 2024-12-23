import mongoose from "mongoose";

const postSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    text: {
        type: String,
        required: true,
        trim: true,
        maxLength: 500
    },
    media: {
        type: [String], // Array of media URLs
        default: [],
        required: true
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Likes",
    }],
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
}, { timestamps: true });

const Post = mongoose.model("Post", postSchema);
export default Post;