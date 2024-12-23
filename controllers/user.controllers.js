import User from "../models/user.models.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
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

const followUserStatus = asyncHandler(async (req, res) => { 
    const _id = req.user._id;
    const followId = req.params._id;
    const targetUser = await User.findById(followId);
    const user = await User.findById(_id);
    targetUser.followers.push(_id);
    user.followings.push(followId);
    await targetUser.save();
    await user.save();
    return res.status(200).json(new ApiResponse(200,targetUser,"followers updated successfully"));
})
const unFollowUserStatus = asyncHandler(async (req, res) => { 
    const _id = req.user._id;
    const unFollowId = req.params._id;
    const user = await User.findById(_id);
    const targetUser = await User.findById(unFollowId);
    user.followings.pull(unFollowId);
    targetUser.followers.pull(_id);
    await user.save();
    await targetUser.save();
    return res.status(200).json(new ApiResponse(200, user, "unfollow updated successfully"));
})

const allUserStatus = asyncHandler(async (req, res) => { 
    const users = await User.find();
    if (!users) {
        throw new ApiError(404,"users not found");
    }
    return res.status(200).json(new ApiResponse(200, users, "all users fetched successfully"));
})


export { getUserStatus, updateUserStatus,unFollowUserStatus,followUserStatus,otherUserStatus,allUserStatus };