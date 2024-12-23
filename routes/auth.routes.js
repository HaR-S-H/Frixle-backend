import express from "express";
import { registeUser, logInUser, logOutUser } from "../controllers/auth.controllers.js";
import verifyJWT from "../middlewares/auth.middlewares.js"
import { upload } from "../middlewares/multer.middlewares.js"
const router = express.Router();

router.post("/signup", upload.fields([
    {
        name: "avatar",
        maxCount:1
    }
]), registeUser);
router.post("/login", logInUser);
router.post("/logout", logOutUser);

export default router;