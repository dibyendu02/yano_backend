const nodemailer = require("nodemailer");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const UserPatient = require("../models/UserPatient");

exports.sendEmailPatientData = async (req, res) => {
  const { id } = req.params;

  try {
    const patient = await UserPatient.findById(id);

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // Create a PDF document
    const doc = new PDFDocument();
    const pdfPath = `./patient_${id}.pdf`;
    const writeStream = fs.createWriteStream(pdfPath);

    // Pipe the document to a writable stream
    doc.pipe(writeStream);

    // Title
    doc.fontSize(25).text("Patient Details", { align: "center" });
    doc.moveDown(2);

    // User Image (if exists)
    // if (patient.userImg && patient.userImg.secure_url) {
    //   doc.image(patient.userImg.secure_url, {
    //     fit: [100, 100],
    //     align: "center",
    //     valign: "center",
    //   });
    //   doc.moveDown(2);
    // }

    // Basic Information
    doc.fontSize(18).text(`Name: ${patient.firstName} ${patient.lastName}`, {
      align: "left",
    });
    doc.fontSize(14).text(`Email: ${patient.email}`);
    doc.text(`Phone: ${patient.phoneNumber}`);
    doc.text(
      `Date of Birth: ${new Date(patient.dateOfBirth).toLocaleDateString()}`
    );
    doc.text(`Gender: ${patient.gender}`);
    doc.text(`Blood Type: ${patient.bloodType}`);
    doc.moveDown(2);

    // Health Information
    doc.fontSize(18).text("Health Information", { align: "left" });
    doc.fontSize(14).text(`Height: ${patient.height} cm`);
    doc.text(`Weight: ${patient.weight} kg`);
    doc.moveDown(2);

    // Emergency Contact
    doc.fontSize(18).text("Emergency Contact", { align: "left" });
    doc.fontSize(14).text(`Name: ${patient.emergencyContactName}`);
    doc.text(`Phone: ${patient.emergencyContactPhone}`);
    doc.moveDown(2);

    // Family Members
    // if (patient.familyLink && patient.familyLink.length > 0) {
    //   doc.fontSize(18).text("Family Members", { align: "left" });
    //   patient.familyLink.forEach((familyMember) => {
    //     doc.fontSize(14).text(`Relation: ${familyMember.relation}`);
    //     doc.text(`Name: ${familyMember.name}`);

    //     // Add family member's image if available
    //     if (familyMember.userImg && familyMember.userImg.secure_url) {
    //       doc.image(familyMember.userImg.secure_url, {
    //         fit: [50, 50],
    //         align: "left",
    //         valign: "center",
    //       });
    //       doc.moveDown();
    //     }
    //   });
    //   doc.moveDown(2);
    // }

    // Footer or any other details you'd like to include
    doc.text("Report generated on: " + new Date().toLocaleDateString(), {
      align: "center",
    });

    // Finalize the PDF and end the stream
    doc.end();

    // When the PDF is written, send it via email
    writeStream.on("finish", () => {
      // Set up the nodemailer transporter
      const transporter = nodemailer.createTransport({
        service: "Gmail",
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: "sonaliasrtech@gmail.com",
          pass: process.env.EMAIL_PASSWORD, // replace with your real credentials
        },
      });

      // Set up mail options with the attachment
      const mailOptions = {
        from: "sonaliasrtech@gmail.com",
        // to: patient.email, // Send to the patient's email
        to: "get2dibyendu@gmail.com",
        subject: "Your Patient Report",
        text: "Please find attached your patient report.",
        attachments: [
          {
            filename: `patient_${id}.pdf`,
            path: pdfPath, // Path to the PDF
          },
        ],
      };

      // Send the email with the PDF attachment
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email: ", error);
          res.status(500).json({ message: "Error sending email" });
        } else {
          console.log("Email sent: ", info.response);
          res.status(200).json({ message: "Email sent successfully" });
        }

        // Remove the PDF file after sending the email
        fs.unlink(pdfPath, (err) => {
          if (err) console.error("Error deleting PDF file:", err);
        });
      });
    });
  } catch (error) {
    console.error("Error finding patient by ID:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Function to generate OTP and send email
exports.sendEmailVerificationOTP = async (req, res) => {
  const { email } = req.body;

  try {
    // Find the user by email
    const user = await UserPatient.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Set OTP expiration to 10 minutes from now
    const otpExpires = Date.now() + 10 * 60 * 1000;

    // Save the OTP and expiration time in the database
    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    // Send OTP via email using nodemailer
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "sonaliasrtech@gmail.com",
        pass: process.env.EMAIL_PASSWORD, // replace with your real credentials
      },
    });

    const mailOptions = {
      from: "sonaliasrtech@gmail.com",
      to: email,
      subject: "Your OTP for Email Verification",
      text: `Your OTP for email verification is ${otp}. It will expire in 10 minutes.`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return res.status(500).json({ message: "Error sending email" });
      } else {
        res.status(200).json({ message: `OTP sent to ${email}` });
      }
    });
  } catch (error) {
    console.error("Error generating OTP:", error);
    res.status(500).json({ message: "Server error" });
  }
};
