import asyncHandler from "../utils/asyncHandler.js";
import Message from "../models/message.models.js";
import User from "../models/user.models.js";
import Chat from "../models/chat.models.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { getReciverSocketId, io } from "../socket/socket.js";
//@description     Get all Messages
//@route           GET /api/Message/:chatId
//@access          Protected
const getAllMessages = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  const chat = await Chat.findOne({
    users: { $all: [userId, id] },
  });

  if (!chat)
    return res.status(404).json({
      message: "No Chat with these users",
    });

  const messages = await Message.find({
    chat: chat._id,
  });

  res.json(messages);
});

//@description     Create New Message
//@route           POST /api/Message/
//@access          Protected
const sendMessage = asyncHandler(async (req, res) => {
  const { text, recieverId } = req.body;

  if (!text || !recieverId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
    }
  const senderId = req.user._id;
  //   let mediaLocalPath = req.files?.media[0]?.path;
  //   if (!mediaLocalPath) { 
        
  //       throw new ApiError(400, "please provide a media");
  //   }
  //  let  mediaUrl = await uploadOnCloudinary(mediaLocalPath);
  //   mediaUrl = mediaUrl.url;
  let chat = await Chat.findOne({
    users: { $all: [senderId, recieverId] },
  })

  if (!chat) {
    chat = new Chat({
      users: [senderId, recieverId],
      latestMessage: {
        text: text,
        sender: senderId,
      },
    });
    await chat.save();
  }

  const newMessage = new Message({
    chat: chat._id,
    sender: senderId,
    text: text,
  });
  await newMessage.save();

  await chat.updateOne({
    latestMessage: {
      text: text,
      sender: senderId,
    },
  });
  const reciverSocketId = getReciverSocketId(recieverId);

  if (reciverSocketId) {
    io.to(reciverSocketId).emit("newMessage", newMessage);
  }
  res.status(201).json(newMessage);
});

const getAllChats = async (req, res) => {
  try {
    const chats = await Chat.find({
      users: req.user._id,
    }).populate({
      path: "users",
      select: "name avatar",
    });

    chats.forEach((e) => {
      e.users = e.users.filter(
        (user) => user._id.toString() !== req.user._id.toString()
      );
    });

    res.json(chats);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

export { getAllMessages, sendMessage,getAllChats };