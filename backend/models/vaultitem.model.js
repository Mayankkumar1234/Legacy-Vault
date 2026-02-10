import mongoose from "mongoose";

const VaultItemSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  type: { 
    type: String, 
    enum: ['text', 'image', 'file'], 
    required: true 
  },
  title: { type: String, required: true },
  encryptedData: { type: String, required: true }, 
  iv: { type: String, required: true },
  mimeType: { type: String, required: true }, 
});


const VaultItem = mongoose.model("VaultItem", VaultItemSchema)
export default VaultItem
