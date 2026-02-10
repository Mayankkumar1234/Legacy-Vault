
import { encrypt } from "../utils/encryption.js";
import fs from "fs";
import path from "path";
import   VaultItem from "../models/vaultitem.model.js"

const VaultItemController = {
 
  vaultItemAdd: async (req, res)=>{
    try {
    const { title, type, textData, userKey } = req.body;
   const userId = req.user._id
    if (!userKey) {
      return res.status(400).json({ message: "Encryption key (userKey) is required" });
    }

    let finalEncryptedData = "";
    let iv = "";
    let mimeType = "text/plain";
 
    if (type === 'text') {
      if (!textData) {
        return res.status(400).json({ message: "textData is required for type 'text'" });
      }

      const encrypted = encrypt(textData, userKey);
      finalEncryptedData = encrypted.encryptedData; // Store Hex String directly in DB
      iv = encrypted.iv;

      console.log(finalEncryptedData, iv)
    } 
 
    else if (type === 'image' || type === 'file') {
      if (!req.file) {
        return res.status(400).json({ message: "File upload is required for this type" });
      }

      try {
        const fileBuffer = fs.readFileSync(req.file.path);

        const encrypted = encrypt(fileBuffer, userKey);
        
        // 3. Define where to save the ENCRYPTED file
        // We add .enc extension to distinguish it
        const encryptedFilename = `enc-${Date.now()}-${req.file.originalname}.enc`;
        const encryptedFilePath = path.join('uploads/vault', encryptedFilename);

        // 4. Ensure directory exists
        const dir = path.dirname(encryptedFilePath);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

        // 5. Write the ENCRYPTED HEX STRING to disk
        // (Since your encrypt function returns hex, we write it as text)
        fs.writeFileSync(encryptedFilePath, encrypted.encryptedData);

        // 6. Prepare data for DB
        finalEncryptedData = encryptedFilePath; // Store PATH in DB, not content
        iv = encrypted.iv;
        mimeType = req.file.mimetype;

        // 7. Cleanup: Delete the unencrypted temp file from Multer
        removeFile(req.file.path);

      } catch (fileError) {
        removeFile(req.file.path); // Cleanup on error
        throw fileError;
      }
    } else {
      return res.status(400).json({ message: "Invalid type provided" });
    }

    // ============================================
    // SAVE TO DATABASE
    // ============================================
    const newItem = await VaultItem.create({
      userId,
      title,
      type,
      encryptedData: finalEncryptedData, // Contains either ciphertext OR filepath
      iv,
      mimeType
    });

    res.status(201).json({
      success: true,
      data: newItem
    });

  } catch (error) {
    console.error("Vault Creation Error:", error);
    // If a file was uploaded but DB save failed, you might want to cleanup the .enc file here too
    if (req.file) removeFile(req.file.path); 
    res.status(500).json({ message: "Server Error", error: error.message });
  }
  }
  
}


function removeFile(filePath){
if (filePath && fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}

 

export default VaultItemController