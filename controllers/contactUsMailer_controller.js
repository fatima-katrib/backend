import nodemailer from "nodemailer";
import * as dotenv from "dotenv";
dotenv.config();

const emailSender = process.env.EMAIL_SENDER;
const emailPass = process.env.EMAIL_PASSWORD;

const transport = {
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: emailSender,
    pass: emailPass,
  },
};

const transporter = nodemailer.createTransport(transport);

transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Server is ready to take messages");
  }
});

class Mailer {
  async send(req, res, next) {
    try {
      const name = req.body.fullName || "anonymous";
      const email = req.body.email;
      const message = req.body.message;
      const content = `name: ${name} \n email: ${email} \n message: ${message}`;
      const mailOptions = {
        from: emailSender,
        to: emailSender,
        subject: "New Message from Contact Form",
        text: content,
      };
      console.log(req.body);

      transporter.sendMail(mailOptions, (err, data) => {
        if (err) {
          return res.status(404).send({
            success: false,
            message: "message failed to be sent",
            error: err,
          });
        } else {
          return res
            .status(200)
            .send({ success: true, message: "message sent" });
        }
      });
    } catch (err) {
      next(err);
    }
  }
}

const ContactUsMailerController = new Mailer();
export default ContactUsMailerController;
