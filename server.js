// server.js (place this in your project root)
const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;
const CSV_FILE = path.join(__dirname, "responses.csv");

// Middleware
app.use(bodyParser.json());
app.use(express.static(__dirname)); // Serves your HTML, CSS, JS, etc.

// Initialize CSV file if it doesn't exist
if (!fs.existsSync(CSV_FILE)) {
  fs.writeFileSync(CSV_FILE, "Name,Attendance,Message,Timestamp\n", "utf8");
}

// RSVP endpoint
app.post("/rsvp", (req, res) => {
  const { name, attendance, message } = req.body;
  const timestamp = new Date().toISOString();

  const csvRow = `"${name}","${attendance}","${message.replace(/"/g, '""')}","${timestamp}"\n`;
  fs.appendFileSync(CSV_FILE, csvRow, "utf8");

  // Email config
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_FROM,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: process.env.EMAIL_TO,
    subject: "New RSVP Received",
    text: `Name: ${name}\nAttendance: ${attendance}\nMessage: ${message || "None"}\nTime: ${timestamp}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });

  const redirect = attendance === "Attending" ? "thank-you-attending.html" : "thank-you-decline.html";
  res.json({ redirect });
});

// 🔐 Admin-protected CSV access endpoint
app.get("/admin/csv", (req, res) => {
  const enteredPassword = req.query.password;
  const adminPassword = process.env.ADMIN_PASS;

  if (enteredPassword !== adminPassword) {
    return res.status(403).send("❌ Forbidden: Incorrect password.");
  }

  fs.readFile(CSV_FILE, "utf8", (err, data) => {
    if (err) {
      return res.status(500).send("❌ Error reading CSV.");
    }
    res.type("text/plain").send(data);
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
