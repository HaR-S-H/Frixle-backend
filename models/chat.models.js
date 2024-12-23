import mongoose from "mongoose";

const chatModel = new mongoose.Schema(
  {
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    latestMessage: {
      text: String,
      sender: { type:mongoose.Schema.Types.ObjectId,ref: "User" },
      
    },
    
  },
  { timestamps: true }
);

const Chat = mongoose.model("Chat", chatModel);

export default Chat;