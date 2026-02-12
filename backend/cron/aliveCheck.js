import cron from "node-cron";
import User from "../models/user.model.js";
// import sendEmail from "../conn/email.js"
import VaultItem from "../models/vaultitem.model.js";
import transporter from "../conn/email.js";
import { confirmAlive, handover } from "../utils/mail-options.js";

const startManSwitch = () => {
  // Run every day at Midnight (00:00)
  cron.schedule("*/5 * * * *", async () => {
    console.log("Running  Check...");

    const today = new Date();

    const users = await User.find({ isAlive: true });

    console.log(users);

    users.forEach(async (user) => {
      const daysSinceCheckIn =
        (today - user.lastCheckIn) / (1000 * 60 * 60 * 24);
      const deadline = user.checkInFrequency;

      // STAGE 1: Warning (e.g., 5 days before deadline)
      console.log(deadline);
      if (daysSinceCheckIn > deadline - 5 && daysSinceCheckIn < deadline) {
        // await sendEmail(user.email, "Action Required", "Please check in to Legacy-Vault to confirm you are okay.");
        await transporter.sendMail(confirmAlive(user));
        console.log(
          "Action Required",
          "Please check in to Legacy-Vault to confirm you are okay",
          user.email,
        );
      }

      // STAGE 2: Deadline Crossed (Execute Protocol)
      if (daysSinceCheckIn > deadline) {
        console.log(
          `User ${user.username} is presumed inactive. Executing Handover.`,
        );

        // 1. Mark as Inactive
        // user.isAlive = false;
        await user.save();

        // 2. Fetch their Vault Data
        const vaultItems = await VaultItem.find({ userId: user._id });
        const emailAttachments = [];
        vaultItems.forEach(async (item) => {
          if (item.type === "file" || item.type === "image") {
            emailAttachments.push({
              filename: item.fileName,
              path: item.filePath,
            });
          } else if (item.type === "text") {
            emailAttachments.push({
              filename: item.fileName,
              content: item.content,
            });
          }
          emailAttachments.push({
            filename: "",
            content: `Use the Recovery Key provided by ${user.username} to decrypt these files on our website.`,
          });
        });
        console.log(vaultItems);

        // 3. Email the Nominee
        // await sendEmail(
        //   user.nomineeEmail,
        //   "Digital Inheritance Handover",
        //   `We regret to inform you that ${user.username}'s Legacy Vault has been unlocked.
        //    Attached is the encrypted data.
        //    Please use the 'Recovery Key' given to you by ${user.username} to decrypt it on our website.`
        // );

        await transporter.sendMail(handover(user, emailAttachments));
        console.log(
          "Digital Inheritance Handover",
          `We regret to inform you that ${user.username}'s Legacy Vault has been unlocked.
           Attached is the encrypted data. 
           Please use the 'Recovery Key' given to you by ${user.username} to decrypt it on our website.`,
          user.nomineeEmail,
        );
      }
    });
  });
};

export default startManSwitch;
