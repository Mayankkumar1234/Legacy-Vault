import express from "express"
import vaultItemController from "../controller/VaultItem.js";
import { upload } from "../middleware/upload.js"; 
import { verifyToken } from "../middleware/verifyToken.js";

const vaultRouter = express.Router()


vaultRouter.post("/addsecret", upload.single("file"), verifyToken, vaultItemController.vaultItemAdd);


export default vaultRouter