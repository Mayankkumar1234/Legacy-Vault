import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoute from "./routes/user.route.js";
import connectDB from "./conn/connection.js";
import vaultRouter from "./routes/legacyvault.route.js";
import startManSwitch from "./cron/aliveCheck.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({extended: true}));

app.listen(process.env.PORT, () => {
  connectDB();
  startManSwitch();
  console.log(`Server is running on port ${process.env.PORT}`);
});

app.use("/api/auth", userRoute);
app.use("/api/vault", vaultRouter);
