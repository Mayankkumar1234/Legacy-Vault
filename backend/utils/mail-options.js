export const confirmAlive = (user) => {
  const mailOptions = {
    from: "mk1070355@gmail.com",
    to: `${user.email}`,
    subject: "Confirm Alive",
    text: `
      Hello ${user.username},

We noticed you haven't checked in to your Legacy-Vault recently.

According to your security settings, your "Dead Man's Switch" is scheduled to trigger in 5 days. If you do not check in by then, we will automatically assume you are inactive and execute your handover protocol to ${user.nomineeName}.

If you are okay, please click the button below to reset your timer:

I Am Alive - Check In Now

If you cannot access the link, please log in to your dashboard manually.

Stay safe, The Legacy-Vault Team
      `,
  };
  return mailOptions;
};

export const handover = (user, emailAttachments) => {
  const mailOptions = {
    from: "mk1070355@gmail.com",
    to: `${user.nomineeEmail}`,
    subject: "Digital Inheritance Handover",
    text: `
        Hello ${user.nomineeName},

We regret to inform you that ${user.username}'s Legacy Vault has been unlocked.

Attached is the encrypted data. 
Please use the 'Recovery Key' given to you by ${user.username} to decrypt it on our website.

Stay safe, The Legacy-Vault Team

 
        `,
    emailAttachments,
  };
  return mailOptions;
};
