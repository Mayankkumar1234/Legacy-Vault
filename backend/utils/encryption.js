import crypto from "crypto";
import dotenv from "dotenv";
import fs from "fs";
dotenv.config();

const algorithm = 'aes-256-cbc';
 
export const encrypt = (text, userKey) => {
  const key = crypto.createHash('sha256').update(String(userKey)).digest('base64').substr(0, 32);
  const iv = crypto.randomBytes(16);
  
  let cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  
  return { 
    iv: iv.toString('hex'), 
    encryptedData: encrypted.toString('hex') 
  };
};

// encrypt("Hello World", "my_super_secret_32_byte_key_12345");

// 2. Decrypt (When Nominee uses the key)
export const decrypt = (text, iv, userKey) => {
  const key = crypto.createHash('sha256').update(String(userKey)).digest('base64').substr(0, 32);
  let ivBuffer = Buffer.from(iv, 'hex');
  let encryptedText = Buffer.from(text, 'hex');
  
  let decipher = crypto.createDecipheriv(algorithm, key, ivBuffer);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
   
  // console.log(decrypted.toString())
  return decrypted

 };


// const decryptedImageBuffer  = decrypt("", "a2726029ba0ae82d46b06b82c5634600", "my_super_secret_32_byte_key_12345");

// fs.writeFileSync("restored_photo.jpg", decryptedImageBuffer);
 