import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique:true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        default: "default.jpg",
    },
    gender: {
        type: String,
        enum: ["male", "female", "other"],
        default: "other",
    },
    bio: {
        type: String,
        maxLength: 150,
    },
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
    }],
    followings: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],

},{timestamps:true});

userSchema.pre('save',async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
})

userSchema.methods.isPasswordCorrect = async function (password) { 
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign({
        _id: this._id,
        email: this.email,
        name:this.name
    }, process.env.ACCESS_TOKEN_SECRET,
        {
       expiresIn:process.env.ACCESS_TOKEN_EXPIRY
   })
}

const User = mongoose.model("User", userSchema);

export default User;