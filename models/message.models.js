import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    // readBy: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "User",
    //     required: true
    // }],
    text: {
        type: String,
        trim:true,
        required: true
    },
    // media: {
    //     type: [String],
    //     default: [],
    // },
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat",
        required: true
    }
}, { timestamps: true });


const Message = mongoose.model("Message", messageSchema);

export default Message;