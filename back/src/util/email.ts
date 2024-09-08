import nodemailer from "nodemailer";
export const emailOption = {
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "tkwatck@gmail.com",
    pass: "xfiouwrbrxodfayv",
  },
};

const transporter = nodemailer.createTransport(emailOption);

export const sendEmail = async (to: string, subject: string, text: string) => {
  try {
    const info = await transporter.sendMail({
      from: "tkwatck@gmail.com",
      to: to,
      subject: subject,
      text: text,
    });

    console.log("Message sent: %s", info.messageId);
    return info;
  } catch (error) {
    console.error("Error occurred while sending email:", error);
    throw error; // Re-throwing the error for higher-level error handling
  }
};
