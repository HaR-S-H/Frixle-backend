import Post from "../models/post.models.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const newPost = asyncHandler(async (req, res) => {
    const { text } = req.body;
    if (!text) {
        throw new ApiError(400, "plase provide a caption !");
    }
    let mediaLocalPath = req.files?.media[0]?.path;
    if (!mediaLocalPath) { 
        
        throw new ApiError(400, "please provide a media");
    }
   let  mediaUrl = await uploadOnCloudinary(mediaLocalPath);
    mediaUrl = mediaUrl.url;

    const post = new Post({
        text,
        media:mediaUrl,
        user: req.user._id
    });
    await post.save();
    return res.json(new ApiResponse(201, post, "post created successfully"));
})

const getPosts = asyncHandler(async (req, res) => {
    const posts = await Post.find().populate('user') // Populate the user in the Post model
    .populate({
      path: 'comments', // Populate the comments
      populate: {
        path: 'user', // Populate the user inside each comment
      }
    });
    return res.json(new ApiResponse(200, posts, "posts fetched successfully"));
})

const editPost = asyncHandler(async (req, res) => {
    // Find and verify post
    let post = await Post.findById(req.params._id);
    if (!post) {
        throw new ApiError(404, "Post not found");
    }
    
    if (req.user._id != post.user.toString()) {
        throw new ApiError(403, "You are not authorized to edit this post");
    }

    const { text } = req.body;
    let mediaUrl = post.media; // Keep existing media by default

    // Handle new media upload if files are present
    if (req.files && req.files.media) {
        // If it's an array of files, take the first one
        const mediaFile = Array.isArray(req.files.media) 
            ? req.files.media[0] 
            : req.files.media;

        if (mediaFile && mediaFile.path) {
            const uploadedMedia = await uploadOnCloudinary(mediaFile.path);
            if (uploadedMedia && uploadedMedia.url) {
                mediaUrl = uploadedMedia.url;
            }
        }
    }

    // Update post
    post = await Post.findByIdAndUpdate(
        req.params._id, 
        { 
            text,
            media: mediaUrl
        }, 
        { new: true }
    );

    return res.json(new ApiResponse(200, post, "Post updated successfully"));
});
const deletePost = asyncHandler(async (req, res) => { 
    let post = await Post.findById(req.params._id);
    if (req.user._id != post.user.toString()) { 
        throw new ApiError(403, "you are not authorized to delete this post");  // 403 Forbidden  // 401 Unauthorized  // 404 Not Found  // 400 Bad Request  // 200 OK  // 201 Created  // 202 Accepted  // 204 No Content  // 301 Moved Permanently  // 302 Found  // 304 Not Modified  // 405 Method Not Allowed  // 410 Gone  // 500 Internal Server Error  // 501 Not Implemented  // 502 Bad Gateway  // 503 Service Unavailable   // 504 Gateway Timeout   // 511 Network Authentication Required   // 204 No Content  // 206 Partial Content   // 401 Unauthorized  //
    }
     post = await Post.findByIdAndDelete(req.params._id);
    if (!post) {
        throw new ApiError(404, "post not found");
    }
    return res.json(new ApiResponse(200, post, "post deleted successfully"));
});
export { newPost, getPosts, editPost, deletePost };