import User from "../models/user.models.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import mongoose from "mongoose";
const getUserStatus = asyncHandler(async (req, res) => {
    const _id = req.user._id;
    const user = await User.findById(_id).populate("followers followings");
    if (!user) {
      throw new ApiError(404,"user not found");
    }
    return res.status(200).json(new ApiResponse(201,user,"user status fetched successfully"));

})
const otherUserStatus = asyncHandler(async (req, res) => { 
    const _id = req.params._id;
    const user = await User.findById(_id).populate("followers followings");
    return res.status(200).json(new ApiResponse(201,user,"other user status fetched successfully"));
 });
const updateUserStatus = asyncHandler(async(req, res) =>{
    const { bio } = req.body;
    // console.log(req.body);
    console.log(req.files);
    
    
    let avatarLocalPath = req.files?.avatar[0]?.path;
    
    console.log(avatarLocalPath);
    const _id = req.user._id;
    let user = await User.findById(_id);
    const gender = user.gender;
    
    let avatarUrl;
    if (avatarLocalPath) { 
        
        avatarUrl = await uploadOnCloudinary(avatarLocalPath);
        avatarUrl = avatarUrl.url;
        console.log(avatarUrl);
        
    }
    else {
        avatarUrl = gender == "male" ? 'https://res.cloudinary.com/dvlkfh2dl/image/upload/v1734186628/male_eo8sx9.jpg' : 'https://res.cloudinary.com/dvlkfh2dl/image/upload/v1734186791/female_vcgpxa.png';
    }
    // console.log(avatarLocalPath);
    if (!avatarUrl) { 
        throw new ApiError(500, "Error uploading avatar to cloudinary");
    }

    user = await User.findByIdAndUpdate(_id, { bio, avatar: avatarUrl }, { new: true });
    console.log(user);
    return res.status(200).json(new ApiResponse(201,user,"user status updated successfully"));
});

// const followUserStatus = asyncHandler(async (req, res) => { 
//     // const _id = req.user._id;
//     // const followId = req.params._id;
//     const _id = new mongoose.Types.ObjectId(req.user._id);
// const followId = new mongoose.Types.ObjectId(req.params._id);
//     const targetUser = await User.findById(followId);
//     const user = await User.findById(_id);
//     targetUser.followers.push(_id);
//     user.followings.push(followId);
//     await targetUser.save();
//     await user.save();
//     return res.status(200).json(new ApiResponse(200,targetUser,"followers updated successfully"));
// })
// const unFollowUserStatus = asyncHandler(async (req, res) => { 
//     // const _id = req.user._id;
//     // const unFollowId = req.params._id;
//     const _id = new mongoose.Types.ObjectId(req.user._id);
// const followId = new mongoose.Types.ObjectId(req.params._id);
//     const user = await User.findById(_id);
//     const targetUser = await User.findById(unFollowId);
//     user.followings.pull(unFollowId);
//     targetUser.followers.pull(_id);
//     await user.save();
//     await targetUser.save();
//     return res.status(200).json(new ApiResponse(200, user, "unfollow updated successfully"));
// })

const followUserStatus = asyncHandler(async (req, res) => {
    const _id = req.user._id;
    const followId = req.params._id;

    // Validate ObjectIds
    if (!mongoose.Types.ObjectId.isValid(_id) || !mongoose.Types.ObjectId.isValid(followId)) {
        return res.status(400).json(
            new ApiResponse(400, null, "Invalid user ID format")
        );
    }

    // Check if trying to follow self
    if (_id.toString() === followId) {
        return res.status(400).json(
            new ApiResponse(400, null, "Users cannot follow themselves")
        );
    }

    const targetUser = await User.findById(followId);
    const user = await User.findById(_id);

    // Check if users exist
    if (!targetUser || !user) {
        return res.status(404).json(
            new ApiResponse(404, null, "User not found")
        );
    }

    // Check if already following
    if (targetUser.followers.includes(_id)) {
        return res.status(400).json(
            new ApiResponse(400, null, "Already following this user")
        );
    }

    // Convert IDs to ObjectId before pushing
    targetUser.followers.push(mongoose.Types.ObjectId(_id));
    user.followings.push(mongoose.Types.ObjectId(followId));

    await targetUser.save();
    await user.save();

    return res.status(200).json(
        new ApiResponse(200, targetUser, "Followers updated successfully")
    );
});

const unFollowUserStatus = asyncHandler(async (req, res) => {
    const _id = req.user._id;
    const unFollowId = req.params._id;

    // Validate ObjectIds
    if (!mongoose.Types.ObjectId.isValid(_id) || !mongoose.Types.ObjectId.isValid(unFollowId)) {
        return res.status(400).json(
            new ApiResponse(400, null, "Invalid user ID format")
        );
    }

    // Check if trying to unfollow self
    if (_id.toString() === unFollowId) {
        return res.status(400).json(
            new ApiResponse(400, null, "Users cannot unfollow themselves")
        );
    }

    const user = await User.findById(_id);
    const targetUser = await User.findById(unFollowId);

    // Check if users exist
    if (!targetUser || !user) {
        return res.status(404).json(
            new ApiResponse(404, null, "User not found")
        );
    }

    // Check if actually following
    if (!user.followings.includes(unFollowId)) {
        return res.status(400).json(
            new ApiResponse(400, null, "You are not following this user")
        );
    }

    // Convert IDs to ObjectId before pulling
    user.followings.pull(mongoose.Types.ObjectId(unFollowId));
    targetUser.followers.pull(mongoose.Types.ObjectId(_id));

    await user.save();
    await targetUser.save();

    return res.status(200).json(
        new ApiResponse(200, user, "Unfollow updated successfully")
    );
});

const allUserStatus = asyncHandler(async (req, res) => { 
    const users = await User.find();
    if (!users) {
        throw new ApiError(404,"users not found");
    }
    return res.status(200).json(new ApiResponse(200, users, "all users fetched successfully"));
})


export { getUserStatus, updateUserStatus,unFollowUserStatus,followUserStatus,otherUserStatus,allUserStatus };
