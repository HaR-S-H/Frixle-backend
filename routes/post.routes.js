import express from "express";
import { newPost,getPosts,deletePost,editPost } from "../controllers/post.controllers.js";
import verifyJWT from "../middlewares/auth.middlewares.js";
import { upload } from "../middlewares/multer.middlewares.js";
const router = express.Router();
router.post("/new",verifyJWT,upload.fields([
    {
        name: "media",
        maxCount:1
    }
]), newPost);
router.get("/all",verifyJWT, getPosts);
router.delete("/:_id", verifyJWT, deletePost);
router.put("/:_id", verifyJWT,  upload.fields([
    {
        name: "media",
        maxCount:1
    }
]),editPost);

export default router;