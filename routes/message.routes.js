// import express from 'express';
// import { allMessages, sendMessage } from '../controllers/message.controllers';
// import verifyJWT from "../middlewares/auth.middlewares.js";
// import { upload } from '../middlewares/multer.middlewares.js';
// const router = express.Router();
// router.get("/:chatId", verifyJWT, allMessages);
// router.post("/", verifyJWT,upload.fields([
//     {
//         name: "media",
//         maxCount:1
//     }
// ]) , sendMessage);

// export default router;


import express from "express";
import verifyJWT from "../middlewares/auth.middlewares.js";
import { getAllMessages,sendMessage,getAllChats } from "../controllers/message.controllers.js";
const router = express.Router();
router.get("/all", verifyJWT, getAllChats);
router.post("/", verifyJWT, sendMessage);
router.get("/:id", verifyJWT, getAllMessages);



export default router;