import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

export const getReciverSocketId = (reciverId) => {
  return userSocketMap[reciverId];
};

const userSocketMap = {};

io.on("connection", (socket) => {
  console.log("User Connected", socket.id);

  const userId = socket.handshake.query.userId;

  if (userId != "undefined") userSocketMap[userId] = socket.id;

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // Add this new event handler for new chats
  socket.on("newChat", ({ receiverId, chat }) => {
    const receiverSocketId = userSocketMap[receiverId];
    if (receiverSocketId) {
      socket.to(receiverSocketId).emit("newChat", chat);
    }
  });

  socket.on("newMessage", ({ receiverId, message, chatData }) => {
    const receiverSocketId = userSocketMap[receiverId];

    if (receiverSocketId) {
      if (chatData) {
        // Emit both the new chat and the message
        socket.to(receiverSocketId).emit("newChat", chatData);
        socket.to(receiverSocketId).emit("newMessage", message);
      } else {
        socket.to(receiverSocketId).emit("newMessage", message);
      }
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });

  socket.on("typing", ({ chatId, receiverId, isTyping }) => {
    const receiverSocketId = userSocketMap[receiverId];
    if (receiverSocketId) {
      socket.to(receiverSocketId).emit("userTyping", {
        chatId,
        userId: userId,
        isTyping
      });
    }
  });
});

export { io, server, app };