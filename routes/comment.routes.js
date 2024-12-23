import express from "express";
import { getAllComments, newComment, deleteComment, editComment } from "../controllers/comment.controllers.js";
import verifyJWT from "../middlewares/auth.middlewares.js";
const router = express.Router();

router.get("/:_id", verifyJWT, getAllComments);
router.post("/:_id", verifyJWT, newComment);
router.put("/:_id", verifyJWT, editComment);
router.delete("/:_id", verifyJWT, deleteComment);


export default router;