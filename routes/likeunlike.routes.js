import likeUnlikePost from "../controllers/likeunlike.controllers.js";
import express from "express";
import verifyJWT from "../middlewares/auth.middlewares.js";
const router = express.Router();

router.post("/:_id", verifyJWT, likeUnlikePost);

export default router;