import Comment from "../models/comment.models.js";
import asyncHandler from "../utils/asyncHandler.js";
import Post from "../models/post.models.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
const newComment = asyncHandler(async (req, res) => {
    const { text } = req.body;
    if (!text) {
        throw new ApiError(400, "Please provide a comment text");
    }
    const comment = new Comment({
        text,
        user: req.user._id,
        post: req.params._id,
    });
    await comment.save();
    const post = await Post.findById(req.params._id);
    post.comments.push(comment._id);
    await post.save();
    return res.json(new ApiResponse(200,post,"comment created successfully"));
})

const getAllComments = asyncHandler(async (req, res) => {
    const comments = await Comment.find({ post: req.params._id });
    if (!comments) {
        throw new ApiError(404, "No comments found for this post");
    }
    return res.json(new ApiResponse(200, comments,"comments fetched successfully"));
})

const deleteComment = asyncHandler(async(req, res) =>{
    const comment = await Comment.findById(req.params._id).populate("post");
    if (!comment) {
        throw new ApiError(404, "Comment not found");
    }
    if (comment.user.toString()!== req.user._id.toString() && comment.post.user.toString()!== req.user._id.toString()) {
        throw new ApiError(403, "Unauthorized to delete this comment");
    }
    await Comment.findByIdAndDelete(req.params._id);
    const post = await Post.findById(comment.post);
    
   post.comments.pull(comment._id.toString());
    await post.save();
    return res.json(new ApiResponse(200, post, "comment deleted successfully"));
})

const editComment = asyncHandler(async (req, res) => { 
    const { text } = req.body;
    console.log(text);
    
    const comment = await Comment.findByIdAndUpdate(req.params._id, { text }, { new: true });
    comment.save();
    if (!comment) {
        throw new ApiError(404, "Comment not found");
    }
    if (comment.user.toString()!== req.user._id.toString()) {
        throw new ApiError(403, "Unauthorized to edit this comment");
    }

    return res.json(new ApiResponse(200, comment, "comment updated successfully")); 
});


export { newComment, getAllComments, deleteComment, editComment };