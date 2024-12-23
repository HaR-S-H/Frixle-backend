import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectedDB from "./db/connection.js";
import authRoute from "./routes/auth.routes.js";
import userRoute from "./routes/user.routes.js";
import postRoute from "./routes/post.routes.js";
import likeRoute from "./routes/likeunlike.routes.js";
import commentRoute from "./routes/comment.routes.js";
import messageRoute from "./routes/message.routes.js";
import cors from "cors";
import { app, server } from "./socket/socket.js";

// Load environment variables
dotenv.config();
connectedDB();

// App and Port
const PORT = process.env.PORT || 8080;

// Trust Render Proxy
// app.set("trust proxy", 1);

// CORS Middleware
app.use(cors({
  origin: ['https://inquisitive-pavlova-f0b954.netlify.app'],
  credentials: true
}));

// Middleware
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/", (req, res) => {
    console.log("hello");
    return res.status(200).json({ message: "server is working" });
});
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/posts", postRoute);
app.use("/api/v1/posts/like", likeRoute);
app.use("/api/v1/posts/comment", commentRoute);
app.use("/api/v1/chats", messageRoute);

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Something went wrong!" });
});

// Start Server
server.listen(PORT, () => {
    console.log(`server is listening at ${PORT}`);
});
