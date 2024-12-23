import express from "express";
import { upload } from "../middlewares/multer.middlewares.js";
import { getUserStatus, updateUserStatus,unFollowUserStatus,followUserStatus,otherUserStatus, allUserStatus } from "../controllers/user.controllers.js";
import verifyJWT from "../middlewares/auth.middlewares.js";
const router = express.Router();

router.put("/update",upload.fields([
    {
        name: "avatar",
        maxCount:1
    }
]) ,verifyJWT,updateUserStatus);
router.get("/me",verifyJWT, getUserStatus);
router.get("/all",verifyJWT, allUserStatus);
router.post("/follow/:_id",verifyJWT, followUserStatus);
router.post("/unfollow/:_id", verifyJWT, unFollowUserStatus);
router.post("/:_id", verifyJWT, otherUserStatus);

export default router;
