import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import bip39 from "bip39";
import fs from "fs";
import path from "path";

const userController = {
  userRegister: async (req, res) => {
    const { username, email, password } = req.body;
    try {
      if (!username || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
      }
      const checkUser = await User.findOne({ email });
      if (checkUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        username,
        email,
        password: hashedPassword,
      });
      const recoveryKey = generateRecoveryKey();

      await newUser.save();
      res.status(201).json({
        message: "User registered successfully",
        recoveryKey: recoveryKey,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  },
  loginUser: async (req, res) => {
    const { email, password } = req.body;
    try {
      if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" });
      }
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      res.status(200).json({ message: "Login successful", token });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  },

  completeProfile: async (req, res) => {
    const { nomineeName, nomineeEmail, checkInFrequency } = req.body;
    console.log(req.user._id);
    const { userId } = req.user;
    console.log(userId);
    try {
      if (!nomineeName || !nomineeEmail || !checkInFrequency) {
        return res.status(400).json({ message: "All fields are required" });
      }
      const checkUser = await User.findOne({ _id:userId });
      if (!checkUser) {
        return res.status(400).json({ message: "User not found" });
      }
      const checkEmail = await User.findOne({ email: nomineeEmail });
      if (checkEmail) {
        return res
          .status(400)
          .json({ message: "Nominee email already exists" });
      }
      await User.findByIdAndUpdate(
        userId,
        {
          nomineeName: nomineeName,
          nomineeEmail: nomineeEmail,
          checkInFrequency: checkInFrequency,
        },
        {
          new: true,
        },
      );
      res.status(200).json({ message: "Profile updated successfully" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  },
  confirmAlive: async (req, res) => {
    const userId = req.user._id;
    try {
      const user = await User.findOne({ userId });
      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }
      user.lastCheckIn = Date.now();
      await user.save();
      res.status(200).json({ message: "Alive confirmed successfully" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  },
};

function generateRecoveryKey() {
  const mnemonic = bip39.generateMnemonic();
  return mnemonic;
}

export default userController;
