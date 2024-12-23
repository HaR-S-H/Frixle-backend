import Post from "../models/post.models.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const likeUnlikePost = asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params._id);
    if (!post) {
        throw new ApiError(404, "Post not found");
    }
    if (post.likes.includes(req.user._id)) {
        post.likes.pull(req.user._id);
        await post.save();
        return res.json(new ApiResponse(201,post,"post unliked successfully !"));
    } else {
        post.likes.push(req.user._id);
        await post.save();
        return res.json(new ApiResponse(201,post,"post liked successfully !"));
    }
});

export default likeUnlikePost;