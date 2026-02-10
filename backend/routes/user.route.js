import express from "express";
import userController from "../controller/User.js";
import { verifyToken } from "../middleware/verifyToken.js";
const router = express.Router();

router.post("/register", userController.userRegister);
router.post("/login", userController.loginUser);  
router.post("/completeprofile", verifyToken, userController.completeProfile);
  
export default router;

