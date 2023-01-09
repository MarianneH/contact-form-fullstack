require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const cors = require("cors");
const app = express();

app.use(cors());
// parse application/json
app.use(bodyParser.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

const route = express.Router();
const port = process.env.PORT || 5002;

app.use("/v1", route);
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  port: 465, // true for 465, false for other ports
  host: process.env.SMTP_HOST,
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASS,
  },
  secure: true,
});
route.post("/text-mail", (req, res) => {
  const { from, subject, text } = req.body;
  const mailData = {
    from: from, // sender address
    to: process.env.SMTP_RECEIVER, // list of receivers
    subject: subject + " from " + from,
    text: text,
    html: "<div>" + text + "</div>",
  };

  transporter.sendMail(mailData, (error, info) => {
    if (error) {
      return console.log(error);
    }
    res.status(200).send({ message: "Mail send", message_id: info.messageId });
  });
});
