import nodemailer from "nodemailer";


// using async here bcz sending mails can take variable amount of time
export const sendMail = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.MAILTRAP_HOST,
      port: parseInt(process.env.MAILTRAP_PORT),
      secure: false,
      auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: '"sufyan_ahmed" <no-reply@muhammadsufyanahmed.com>',
      to,
      subject,
      text,
    });

    console.log('Email sent:', info.messageId);
    return info // returning so we can use in future

  } catch (error) {
    console.log(`❌ Error in Nodemailer: ${error}`);
  }
};


// TODO: Add inngest mailer capability in this function now