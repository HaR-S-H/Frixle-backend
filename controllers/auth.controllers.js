import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import User from "../models/user.models.js";

const registeUser = asyncHandler(async(req, res) =>{
    const { name, email, password, gender } = req.body;
    console.log(req.body);
    
    if (!name || !email || !password || !gender) {
        throw new ApiError(400,"All fields are required",);
    }
    const existingUser = await User.findOne({ email });
    
    if (existingUser) {
        throw new ApiError(400, "Email already exists");
    }
    const existingUserWithName = await User.findOne({ name });
    if (existingUserWithName) {
        throw new ApiError(400, "username already exists");
    }
    // console.log(existingUserWithName);
    
    // let avatarLocalPath = req.files?.avatar[0]?.path;
    // console.log(avatarLocalPath);
    
    let avatarUrl;
    // if (avatarLocalPath) { 
        
    //     avatarUrl = await uploadOnCloudinary(avatarLocalPath);
    //     avatarUrl = avatarUrl.url;
    // }
    // else {
        avatarUrl = gender == "male" ? 'https://res.cloudinary.com/dvlkfh2dl/image/upload/v1734186628/male_eo8sx9.jpg' : 'https://res.cloudinary.com/dvlkfh2dl/image/upload/v1734186791/female_vcgpxa.png';
    // }
    // console.log(avatarLocalPath);
    // if (!avatarUrl) { 
    //     throw new ApiError(500, "Error uploading avatar to cloudinary");
    // }
    const newUser = new User({
        name:name.toLowerCase(),
        email,
        password,
        avatar: avatarUrl,
        gender
    })
    newUser.save();
    const token = newUser.generateAccessToken();
    return res.status(201).cookie("token", token).json(
        new ApiResponse(200, { newUser, token }, "user successfully registered")
    )
})



const logInUser = asyncHandler(async (req, res) => {
    // console.log(req);
    // console.log("harsh");
 
    
    console.log(req.body);
    
    const { email, password } = req.body;
    if (!email || !password) {
        throw new ApiError(400, "All fields are required");
    }

    
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
        throw new ApiError(401, "user not registered");
    }
    const isMatch = await existingUser.isPasswordCorrect(password);

    if (!isMatch) {
        throw new ApiError(401, "invalid password");
    }
    console.log(req.body)
    const token = existingUser.generateAccessToken();
   const cookieOptions = {
        httpOnly: true,
       secure: process.env.NODE_ENV === "production", // Only send cookie over HTTPS in production
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    };

    return res
        .status(200)
        .cookie("token", token, cookieOptions)
        .json(new ApiResponse(200, {existingUser, token}, "user logged in successfully"));
})


const logOutUser = asyncHandler(async (req, res) => { 
    return res.status(200).clearCookie("token").json(new ApiResponse(200, {}, "user logged out successfully"));
})

export {
    registeUser,logInUser,logOutUser
}
