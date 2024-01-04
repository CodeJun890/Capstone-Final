require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/dbConn");
const AcademicYear = require("./models/AcademicYear");
const UserModel = require("./models/User");
const ProgramModel = require("./models/Program");
const ViolationModel = require("./models/Violation");
const ViolationListModel = require("./models/ViolationList");
const ReportModel = require("./models/Report");
const { google } = require("googleapis");
const multer = require("multer");
const http = require("http");
var nodemailer = require("nodemailer");
const { Readable } = require("stream");
const IncidentModel = require("./models/PendingIncidentReports");
const RequestModel = require("./models/StudentRequest");
const HistoryModel = require("./models/RequestHistory");
const revokedTokens = new Set();
const app = express();
const server = http.createServer(app);

console.log(process.env.NODE_ENV);

connectDB();

const PORT = process.env.PORT || 3001;

app.use(express.json());

// app.use(express.urlencoded({ extended: false }));

app.options(
  "*",
  cors({
    origin: [
      "http://discipline-recommender-system.xyz",
      "http://api.discipline-recommender-system.xyz",
    ],
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
    credentials: true,
  })
);

app.use(
  cors({
    origin: [
      "http://discipline-recommender-system.xyz",
      "http://api.discipline-recommender-system.xyz",
    ],
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
    credentials: true,
  })
);

app.use(cookieParser());
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

const verifyUserAdmin = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(400).json({ error: "Token is missing" });
  } else {
    jwt.verify(
      token,
      process.env.REACT_SERVER_SECRET_KEY,
      async (err, decoded) => {
        if (err) {
          return res.status(401).json({ error: "Error with token" });
        } else {
          if (decoded.role === "admin") {
            try {
              const admin = await UserModel.findOne({
                emailAddress: decoded.emailAddress,
              });
              if (!admin) {
                return res.status(404).json({ error: "Admin not found" });
              }
              req.adminUser = admin;
              next();
            } catch (error) {
              return res.status(500).json({ error: "Internal server error" });
            }
          } else {
            return res.status(403).json({ error: "Not a admin" });
          }
        }
      }
    );
  }
};

const verifyUserSubAdmin = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(400).json({ error: "Token is missing" });
  } else {
    jwt.verify(
      token,
      process.env.REACT_SERVER_SECRET_KEY,
      async (err, decoded) => {
        if (err) {
          return res.status(401).json({ error: "Error with token" });
        } else {
          if (decoded.role === "sub-admin") {
            try {
              const subAdmin = await UserModel.findOne({
                emailAddress: decoded.emailAddress,
              });
              if (!subAdmin) {
                return res.status(404).json({ error: "Sub Admin not found" });
              }
              req.subAdminUser = subAdmin;
              next();
            } catch (error) {
              return res.status(500).json({ error: "Internal server error" });
            }
          } else {
            return res.status(403).json({ error: "Not a admin" });
          }
        }
      }
    );
  }
};

const verifyUserStudent = (req, res, next) => {
  const token = req.cookies.token;
  const identifier = req.body.identifier;
  if (!token) {
    return res.status(400).json({ error: "Token is missing" });
  } else {
    jwt.verify(
      token,
      process.env.REACT_SERVER_SECRET_KEY,
      async (err, decoded) => {
        if (err) {
          return res.status(401).json({ error: "Error with token" });
        } else {
          if (decoded.role === "student") {
            try {
              const student = await UserModel.findOne({
                $or: [
                  { emailAddress: identifier },
                  { studentNumber: identifier },
                ],
              });
              if (!student) {
                return res.status(404).json({ error: "Student not found" });
              }

              req.studentUser = decoded;
              next();
            } catch (error) {
              return res.status(500).json({ error: "Internal server error" });
            }
          } else {
            return res.status(403).json({ error: "Not a student" });
          }
        }
      }
    );
  }
};
app.get("/student", verifyUserStudent, (req, res) => {
  const student = req.studentUser;
  res.status(200).json({ studentUser: student });
});
app.get("/subAdmin", verifyUserSubAdmin, (req, res) => {
  const subAdmin = req.subAdminUser;
  res.status(200).json({ subAdminUser: subAdmin });
});
app.get("/admin", verifyUserAdmin, (req, res) => {
  const admin = req.adminUser;
  res.status(200).json({ adminUser: admin });
});
// Delete students
app.delete("/delete-students/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const student = await UserModel.findOneAndDelete({ _id: id });
    const studentViolation = await ViolationModel.deleteMany({
      student_id: student._id,
    });

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.status(200).json({
      message: `Student deleted successfully`,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the student" });
  }
});

// Delete Multiple students
app.post("/delete-students", async (req, res) => {
  const { selectedRows } = req.body;

  try {
    if (!Array.isArray(selectedRows)) {
      return res.status(400).json({ message: "selectedRows must be an array" });
    }

    for (const id of selectedRows) {
      if (typeof id !== "string" || !mongoose.isValidObjectId(id)) {
        return res
          .status(400)
          .json({ message: "Invalid ID format in selectedRows" });
      }
    }

    const result = await UserModel.deleteMany({
      _id: { $in: selectedRows },
    });

    if (result.deletedCount > 0) {
      res.json({ message: "Selected rows have been deleted successfully" });
    } else {
      res.status(404).json({ message: "No matching rows found for deletion" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get individual student

app.get("/students/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const student = await UserModel.findById(id);
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }
    return res.status(200).json({ student });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server Error" });
  }
});

// Get all students

app.use("/fetch-total-violation", async (req, res) => {
  try {
    const openAcademicYear = await AcademicYear.findOne({ status: "OPEN" });

    if (!openAcademicYear) {
      return res.status(400).json({ error: "No open academic year found" });
    }

    const countViolation = await ViolationListModel.countDocuments();
    const countStudentViolation = await ViolationModel.countDocuments({
      academicYear: openAcademicYear._id,
    });

    if (!countViolation) {
      return res
        .status(400)
        .json({ error: "Cannot retrieve total violation list" });
    }

    return res.status(200).json({
      numberOfViolations: countViolation,
      numberOfStudentViolations: countStudentViolation,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server Error" });
  }
});

app.use("/fetch-students", async (req, res) => {
  try {
    const openAcademicYear = await AcademicYear.findOne({ status: "OPEN" });

    if (!openAcademicYear) {
      return res.status(400).json({ error: "No open academic year found" });
    }

    const countViolation = await ViolationListModel.countDocuments();
    const countStudent = await UserModel.countDocuments({
      academicYear: openAcademicYear._id,
      role: "student",
    });
    const students = await UserModel.find({
      academicYear: openAcademicYear._id,
      role: "student",
    });
    res.status(200).json({
      students,
      numberOfStudents: countStudent,
      numberOfViolations: countViolation,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server Error" });
  }
});

app.post("/fetch-students-by-academic-year", async (req, res) => {
  const { selectedAcademicYear, selectedSemester } = req.body;

  try {
    const selectedYear = await AcademicYear.findOne({
      academicYear: selectedAcademicYear,
      semester: selectedSemester,
    });

    if (!selectedYear) {
      return res.status(400).json({ error: "No selected academic year" });
    }

    const studentViolations = await ViolationModel.aggregate([
      {
        $match: {
          academicYear: selectedYear._id,
        },
      },
      {
        $group: {
          _id: "$student_id",
          totalViolations: { $sum: 1 },
        },
      },
    ]);

    if (!studentViolations || studentViolations.length === 0) {
      return res.status(201).json({
        error:
          "No students with violations found for the selected academic year",
      });
    }

    const studentsWithViolations = [];

    for (const entry of studentViolations) {
      const student = await UserModel.findById(entry._id);
      studentsWithViolations.push({
        student,
        totalViolations: entry.totalViolations,
      });
    }

    if (!studentsWithViolations || studentsWithViolations.length === 0) {
      return res.status(400).json({ error: "Cannot find students" });
    }

    return res.status(200).json({ studentsWithViolations });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Server Error" });
  }
});

// verify admin resolve

app.post("/verify-admin-resolve", async (req, res) => {
  const { emailAddress, password, violationId } = req.body;
  try {
    if (!emailAddress || !password) {
      return res
        .status(400)
        .json({ message: "Bad Request: Email and password are required" });
    }

    const admin = await UserModel.findOne({ emailAddress });

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    bcrypt.compare(password, admin.password, async (err, response) => {
      if (response) {
        const violation = await ViolationModel.findOneAndDelete({
          _id: violationId,
        });
        const incidentReport = await ReportModel.findOneAndDelete({
          _id: violation.report_id,
        });

        return res.status(200).json({ verified: true });
      } else {
        return res
          .status(201)
          .json({ message: "Unauthorized: Incorrect password" });
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

//sign up registered student

app.post("/signup-student", async (req, res) => {
  try {
    const openAcademicYear = await AcademicYear.findOne({ status: "OPEN" });

    if (!openAcademicYear) {
      return res.status(400).json({ error: "No open academic year found" });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "cvsuviolation@gmail.com",
        pass: "eatljpjvjjucybhw",
      },
    });

    const {
      studentNumber,
      emailAddress,
      password,
      firstName,
      middleName,
      lastName,
      birthDate,
      course,
      gender,
      sectionYear,
      suffix,
      phoneNumber,
      streetAddress,
      barangay,
      city,
      base64,
      region,
      province,
      isChecked,
    } = req.body;

    const hash = await bcrypt.hash(password, 10);
    const student = await UserModel.create({
      studentNumber,
      emailAddress,
      password: hash,
      firstName,
      middleName,
      lastName,
      birthDate,
      course,
      gender,
      sectionYear,
      suffix,
      phoneNumber,
      streetAddress,
      barangay,
      city,
      profileImage: base64,
      region,
      province,
      academicYear: openAcademicYear._id,
    });

    if (isChecked) {
      const mailOptions = {
        from: "cvsuviolation@gmail.com",
        to: student.emailAddress,
        subject: "Account Created: Welcome to CvSU Violation System",
        html: `
          <p>Dear ${student.lastName},</p>
          <p>We hope this email finds you well.</p>
          <p>We are writing to inform you that your account on CvSU Violation System has been successfully created. Below are your login credentials:</p>
          <p>Email Address: ${student.emailAddress}</p>
          <p>Password (Temporary): ${password}</p>
          <p>Please note that the provided password is temporary, and for security reasons, we recommend that you change it as soon as you log in to your account. You can update your password from your account settings after logging in.</p>
          <p>You can now log in to your account using these credentials to access our system.</p>
          <p>If you have any questions or encounter any issues, please do not hesitate to contact our support team.</p>
          <p>Thank you for choosing CvSU Violation System. We look forward to serving you!</p>
        `,
      };
      const info = await transporter.sendMail(mailOptions);
      console.log("Email sent:", info.response);
    }

    return res.status(200).json({ Status: 200, student });
  } catch (err) {
    console.error("Error:", err);
    return res.status(400).json(err);
  }
});

// login registered student
app.post("/login-user", (req, res) => {
  const { identifier, password, rememberMe } = req.body;

  UserModel.findOne({
    $or: [{ emailAddress: identifier }, { studentNumber: identifier }],
  })
    .then((user) => {
      if (!user) {
        return res.json({ Status: 404, error: "User not found" });
      }

      bcrypt.compare(password, user.password, (err, response) => {
        if (response) {
          const expiresIn = rememberMe ? "30d" : "1d";
          const role = user.role;
          const status = user.status;
          const oneDayInMilliseconds = 24 * 60 * 60 * 1000;
          const maxAge =
            expiresIn === "30d"
              ? 30 * oneDayInMilliseconds
              : oneDayInMilliseconds;

          const tokenPayload = {
            role: role,
          };

          if (
            (role === "admin" && status === "enabled") ||
            (role === "sub-admin" && status === "enabled")
          ) {
            tokenPayload.emailAddress = user.emailAddress;
          } else if (role === "student") {
            tokenPayload.identifier = identifier;
          } else {
            return res.json({ Status: 403, error: "Not authorized" });
          }

          const token = jwt.sign(
            tokenPayload,
            process.env.REACT_SERVER_SECRET_KEY,
            { expiresIn }
          );

          const cookies = {
            secure: false,
            httpOnly: false,
            maxAge,
            sameSite: "strict",
            domain: "discipline-recommender-system.xyz",
          };

          res.cookie("token", token, cookies);
          res.cookie(`${role.toLowerCase()}LoggedIn`, true, cookies);

          return res.json({
            Status: 200,
            role: role,
          });
        } else {
          return res.json({ Status: 401, error: "The password is incorrect" });
        }
      });
    })
    .catch((error) => {
      console.error("Login error:", error);
      return res.status(500).json({ error: "Internal server error" });
    });
});

// logout user

app.post("/logout", (req, res) => {
  const token = req.cookies.token;
  if (token) {
    const decoded = jwt.decode(token);
    if (decoded) {
      const jti = decoded.jti;
      revokedTokens.add(jti);
      res.clearCookie("token");
      return res.status(200).json({ message: "Logout successful" });
    } else {
      res
        .status(400)
        .json({ error: "Session not found: You may already be logged out." });
    }
  }
});

// check student course description

app.get("/program/:course", async (req, res) => {
  try {
    const course = req.params.course;
    const program = await ProgramModel.findOne({ program_code: course });

    if (!program) {
      return res.status(404).json({ error: "Program not found" });
    }

    return res.status(200).json(program);
  } catch (err) {
    console.error("Error:", err);
    return res.status(400).json(err);
  }
});

// Admin

// create admin users

app.post("/create-admin-users", async (req, res) => {
  try {
    const openAcademicYear = await AcademicYear.findOne({ status: "OPEN" });

    if (!openAcademicYear) {
      return res.status(400).json({ error: "No open academic year found" });
    }
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "cvsuviolation@gmail.com",
        pass: "eatljpjvjjucybhw",
      },
    });

    const {
      emailAddress,
      password,
      firstName,
      middleName,
      lastName,
      suffix,
      role,
      status,
      isChecked,
    } = req.body;

    const isEmailExist = await UserModel.findOne({ emailAddress });

    if (isEmailExist) {
      return res.status(201).json({ message: "This email already exists" });
    }
    if (!status) {
      return res.status(202).json({ message: "status value was not provided" });
    }
    if (!role) {
      return res.status(203).json({ message: "role value was not provided" });
    }
    const hash = await bcrypt.hash(password, 10);
    const admin = await UserModel.create({
      emailAddress,
      password: hash,
      firstName,
      middleName,
      lastName,
      suffix,
      role,
      status,
      academicYear: openAcademicYear._id,
    });

    if (isChecked) {
      const mailOptions = {
        from: "cvsuviolation@gmail.com",
        to: admin.emailAddress,
        subject: "Account Created: Welcome to CvSU Violation System",
        html: `
          <p>Dear ${admin.lastName},</p>
          <p>We hope this email finds you well.</p>
          ${
            admin.role === "admin"
              ? `<p>We are writing to inform you that your admin account on CvSU Violation System has been successfully created. Below are your login credentials:</p>`
              : `<p>We are writing to inform you that your sub-administrator account on CvSU Violation System has been successfully created. Below are your login credentials:</p>`
          }
          <p>Email Address: ${admin.emailAddress}</p>
          <p>Password (Temporary): ${password}</p>
          <p>Please note that the provided password is temporary, and for security reasons, we recommend that you change it as soon as you log in to your account. You can update your password from your account settings after logging in.</p>
          <p>You can now log in to your account using these credentials to access our system.</p>
          <p>If you have any questions or encounter any issues, please do not hesitate to contact our support team.</p>
          <p>Thank you for choosing CvSU Violation System. We look forward to serving you!</p>
        `,
      };

      const info = await transporter.sendMail(mailOptions);
      console.log("Email sent:", info.response);
    }

    res.status(200).json({ Status: 200, admin });
  } catch (err) {
    console.error("Error:", err);
    res.status(400).json(err);
  }
});

// update individual users

//Update Student Data
app.patch("/admin-update/:id", async (req, res) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: "No such user data" });
    }

    const currentUser = await UserModel.findById(id);

    if (!currentUser) {
      return res.status(400).json({ error: "No such user data" });
    }

    if (req.body.newPassword) {
      const isPasswordValid = await bcrypt.compare(
        req.body.newPassword,
        currentUser.password
      );

      if (isPasswordValid) {
        return res.status(400).json({ checkPasswordExist: true });
      }

      const hashedPassword = await bcrypt.hash(req.body.newPassword, 10);

      req.body.password = hashedPassword;

      delete req.body.newPassword;
    }
    const user = await UserModel.findOneAndUpdate({ _id: id }, req.body, {
      new: true,
    });

    if (!user) {
      return res.status(400).json({ error: "No such user data" });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error("Error updating student:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// get individual admin users

app.get("/get-admin-user/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const admin = await UserModel.findById(id);
    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }
    return res.status(200).json({ admin });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server Error" });
  }
});

// delete admin users

app.delete("/delete-admin/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const adminDelete = await UserModel.findOneAndDelete({
      _id: id,
    });

    if (!adminDelete) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      message: `User deleted successfully`,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the user" });
  }
});

// fetch admin users

app.get("/get-all-admin-users-active", async (req, res) => {
  try {
    // Find users with role 'admin' or 'sub-admin'
    const admin = await UserModel.find({
      role: { $in: ["admin", "sub-admin"] },
    });

    if (admin.length === 0) {
      return res
        .status(400)
        .json({ error: "There are no currently active admin users" });
    }

    return res.status(200).json({ admin });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// get user emails

app.get("/admin-user-emails", (req, res) => {
  UserModel.find({}, "emailAddress")
    .then((emails) => {
      return res.status(200).json({ emails });
    })
    .catch((err) => {
      return res.status(400).json({ error: "Cannot fetch all emails" });
    });
});

// email validation to send email for reset password
app.post("/forgot-password-admin", async (req, res) => {
  const { emailAddress } = req.body;

  try {
    const oldUser = await UserModel.findOne({ emailAddress });
    if (!oldUser) {
      return res.status(404).json({ error: "User does not exist" });
    }
    const secret = process.env.REACT_SERVER_SECRET_KEY + oldUser.password;
    const token = jwt.sign(
      {
        emailAddress: oldUser.emailAddress,
        id: oldUser._id,
      },
      secret,
      { expiresIn: "1d" }
    );
    const link = `http://api.discipline-recommender-system.xyz/reset-password-admin/${oldUser._id}/${token}`;
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "cvsuviolation@gmail.com",
        pass: "eatljpjvjjucybhw",
      },
    });

    const mailOptions = {
      from: "cvsuviolation@gmail.com",
      to: oldUser.emailAddress,
      subject: "Password Reset Link - Action Required",
      html: `
        <p>Dear ${oldUser.lastName},</p>
        <p>We hope this email finds you well.</p>
        <p>You have recently requested a password reset for your account on CvSU Violation System. To complete this process and secure your account, please click on the link below:</p>
        <a href="${link}">Recovery Password Link</a>
        <p>Please note that this link will expire in 24 hours for security purposes. If you did not request this password reset, please disregard this email.</p>
      `,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });

    res.status(200).json({
      message:
        "Password recovery email sent! Please check your inbox for instructions.",
      link,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred on the server" });
  }
});

app.get("/reset-password-admin/:id/:token", async (req, res) => {
  const { id, token } = req.params;
  const oldUser = await UserModel.findOne({ _id: id });
  if (!oldUser) {
    res.status(404).json({ error: "User does not exist" });
  }
  const secret = process.env.REACT_SERVER_SECRET_KEY + oldUser.password;
  try {
    const verify = jwt.verify(token, secret);
    res.render("admin", {
      emailAddress: verify.emailAddress,
      status: "Not verified",
    });
  } catch (error) {
    res.status(403).json({ error: "User is not Verified" });
  }
});

//reset password

app.post("/reset-password-admin/:id/:token", async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;

  const oldUser = await UserModel.findOne({ _id: id });
  if (!oldUser) {
    res.status(404).json({ error: "User does not exist" });
  }
  const secret = process.env.REACT_SERVER_SECRET_KEY + oldUser.password;
  try {
    const verify = jwt.verify(token, secret);
    const encryptedPassword = await bcrypt.hash(password, 10);
    await UserModel.updateOne(
      {
        _id: id,
      },
      {
        $set: {
          password: encryptedPassword,
        },
      }
    );
    res.render("admin", { email: verify.emailAddress, status: "verified" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "Something Went Wrong" });
  }
});
//Update Student Data
app.patch("/admin-update/:id", async (req, res) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: "No such user data" });
    }

    const currentAdmin = await UserModel.findById(id);

    if (!currentAdmin) {
      return res.status(400).json({ error: "No such user data" });
    }

    if (req.body.newPassword) {
      const isPasswordValid = await bcrypt.compare(
        req.body.newPassword,
        currentAdmin.password
      );

      if (isPasswordValid) {
        return res.status(400).json({ checkPasswordExist: true });
      }

      const hashedPassword = await bcrypt.hash(req.body.newPassword, 10);

      req.body.password = hashedPassword;

      delete req.body.newPassword;
    }
    const admin = await UserModel.findOneAndUpdate({ _id: id }, req.body, {
      new: true,
    });

    if (!admin) {
      return res.status(400).json({ error: "No such user data" });
    }

    res.status(200).json(admin);
  } catch (err) {
    console.error("Error updating student:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Student

// email validation to send email for reset password
app.post("/forgot-password", async (req, res) => {
  const { emailAddress } = req.body;

  try {
    const oldUser = await UserModel.findOne({ emailAddress });
    if (!oldUser) {
      return res.status(404).json({ error: "User does not exist" });
    }
    const secret = process.env.REACT_SERVER_SECRET_KEY + oldUser.password;
    const token = jwt.sign(
      {
        emailAddress: oldUser.emailAddress,
        id: oldUser._id,
      },
      secret,
      { expiresIn: "1d" }
    );
    const link = `http://api.discipline-recommender-system.xyz/reset-password/${oldUser._id}/${token}`;
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "cvsuviolation@gmail.com",
        pass: "eatljpjvjjucybhw",
      },
    });

    const mailOptions = {
      from: "cvsuviolation@gmail.com",
      to: oldUser.emailAddress,
      subject: "Password Reset Link - Action Required",
      html: `
        <p>Dear ${oldUser.lastName},</p>
        <p>We hope this email finds you well.</p>
        <p>You have recently requested a password reset for your account on CvSU Violation System. To complete this process and secure your account, please click on the link below:</p>
        <a href="${link}">Recovery Password Link</a>
        <p>Please note that this link will expire in 24 hours for security purposes. If you did not request this password reset, please disregard this email.</p>
      `,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });

    res.status(200).json({
      message:
        "Password recovery email sent! Please check your inbox for instructions.",
      link,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred on the server" });
  }
});

app.get("/reset-password/:id/:token", async (req, res) => {
  const { id, token } = req.params;
  const oldUser = await UserModel.findOne({ _id: id });
  if (!oldUser) {
    res.status(404).json({ error: "User does not exist" });
  }
  const secret = process.env.REACT_SERVER_SECRET_KEY + oldUser.password;
  try {
    const verify = jwt.verify(token, secret);
    res.render("index", {
      emailAddress: verify.emailAddress,
      status: "Not verified",
    });
  } catch (error) {
    res.status(403).json({ error: "User is not Verified" });
  }
});

//reset password
app.post("/reset-password/:id/:token", async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;

  const oldUser = await UserModel.findOne({ _id: id });
  if (!oldUser) {
    res.status(404).json({ error: "User does not exist" });
  }
  const secret = process.env.REACT_SERVER_SECRET_KEY + oldUser.password;
  try {
    const verify = jwt.verify(token, secret);
    const encryptedPassword = await bcrypt.hash(password, 10);
    await UserModel.updateOne(
      {
        _id: id,
      },
      {
        $set: {
          password: encryptedPassword,
        },
      }
    );
    res.render("index", { email: verify.emailAddress, status: "verified" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "Something Went Wrong" });
  }
});

// Check if either email or student number already exist
app.post("/check-existence", (req, res) => {
  const { emailAddress, studentNumber } = req.body;

  UserModel.findOne({
    $or: [{ emailAddress }, { studentNumber }],
  })
    .then((student) => {
      if (student) {
        // If a student with the same email or student number exists
        return res.json({ isTaken: true });
      } else {
        // If neither email nor student number exists
        return res.json({ isTaken: false });
      }
    })
    .catch((err) => {
      return res.json({ error: "There is a problem with the server" });
    });
});

//check email exist
app.post("/check-email", (req, res) => {
  const { emailAddress } = req.body;
  UserModel.findOne({ emailAddress })
    .then((student) => {
      if (student) {
        return res.json({ isTaken: true });
      } else {
        return res.json({ isTaken: false });
      }
    })
    .catch((err) => {
      return res.json({ error: "There is a problem with the server" });
    });
});

//Update Student Data
app.patch("/student-update/:id", async (req, res) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: "No such user data" });
    }

    const currentStudent = await UserModel.findById(id);

    if (!currentStudent) {
      return res.status(400).json({ error: "No such user data" });
    }

    if (req.body.newPassword) {
      const isPasswordValid = await bcrypt.compare(
        req.body.newPassword,
        currentStudent.password
      );

      if (isPasswordValid) {
        return res.status(400).json({ checkPasswordExist: true });
      }

      const hashedPassword = await bcrypt.hash(req.body.newPassword, 10);

      req.body.password = hashedPassword;

      delete req.body.newPassword;
    }
    const student = await UserModel.findOneAndUpdate({ _id: id }, req.body, {
      new: true,
    });

    if (!student) {
      return res.status(400).json({ error: "No such user data" });
    }

    res.status(200).json(student);
  } catch (err) {
    console.error("Error updating student:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get all student email
app.get("/student-emails", (req, res) => {
  UserModel.find({}, "emailAddress")
    .then((emails) => {
      return res.status(200).json({ emails });
    })
    .catch((err) => {
      return res.status(400).json({ error: "Cannot fetch all emails" });
    });
});

// create academic year
app.post("/create-academic-year", (req, res) => {
  const { academicYear, yearFrom, yearTo, semester } = req.body;
  AcademicYear.findOne({ academicYear, semester })
    .then((existingYear) => {
      if (existingYear) {
        // Academic year already exists
        return res.status(200).json({ isExist: true });
      }

      // If not, create the academic year
      return AcademicYear.create({
        academicYear,
        yearFrom,
        yearTo,
        semester,
      }).then((acadYear) => {
        return res.status(201).json({ acadYear });
      });
    })
    .catch((err) => {
      console.log(err);
      return res.status(400).json({ error: "Cannot create the academic year" });
    });
});

// get all academic year
app.use("/fetch-academic-year", async (req, res) => {
  try {
    const acadYear = await AcademicYear.find();
    if (!acadYear) {
      return res.status(400).json({ error: "Academic year does not exist" });
    }
    return res.status(200).json({ acadYear });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Server Error" });
  }
});

// Change academic year status
app.put("/update-academic-year/:academicYearId", async (req, res) => {
  try {
    const { academicYearId } = req.params;
    const { status } = req.body;

    const academicYearToUpdate = await AcademicYear.findById(academicYearId);

    if (!academicYearToUpdate) {
      return res.status(404).json({ error: "Academic year not found" });
    }

    if (status === "OPEN") {
      // Close all other academic years
      await AcademicYear.updateMany(
        { _id: { $ne: academicYearId } },
        { $set: { status: "CLOSE" } }
      );
    } else if (status === "CLOSE") {
      // Open only the specified academic year
      await AcademicYear.updateOne(
        { _id: academicYearId },
        { $set: { status: "OPEN" } }
      );
    }

    academicYearToUpdate.status = status;
    const updatedAcademicYear = await academicYearToUpdate.save();

    return res.status(200).json({ academicYear: updatedAcademicYear });
  } catch (err) {
    console.error("Error updating academic year:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// delete violation from violation list

// Delete students

app.delete("/delete-violation-list/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const violationList = await ViolationListModel.findOneAndDelete({
      _id: id,
    });

    if (!violationList) {
      return res.status(404).json({ error: "Violation not found" });
    }

    res.status(200).json({
      message: `Violation deleted successfully`,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the violation" });
  }
});

// add a violation to violation list
app.post("/generate-violation", async (req, res) => {
  try {
    const {
      violationType,
      violationDescription,
      violationOffense,
      violationSanction,
    } = req.body;

    const existingViolation = await ViolationListModel.findOne({
      violation_description: violationDescription,
      violation_sanction: violationSanction,
    });

    if (existingViolation) {
      return res.status(200).json({ isExist: true });
    }

    const violation = await ViolationListModel.create({
      violation_type: violationType,
      violation_description: violationDescription,
      violation_offense: violationOffense,
      violation_sanction: violationSanction,
    });

    return res.status(201).json({ violation });
  } catch (err) {
    return res.status(400).json({ error: err });
  }
});

// get details of specific violation from violation list
app.get("/violation-list/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const violationList = await ViolationListModel.findById(id);
    if (!violationList) {
      return res
        .status(404)
        .json({ error: "Violation list can not be found!" });
    }
    return res.status(200).json({ violationList });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// update details of violation in the violation list
app.patch("/update-violation-list-row/:id", async (req, res) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: "No such violation data!" });
    }

    const currentViolationList = await ViolationListModel.findById(id);
    if (!currentViolationList) {
      return res
        .status(400)
        .json({ error: "Can not find the violation list!" });
    }

    const violationList = await ViolationListModel.findOneAndUpdate(
      { _id: id },
      req.body,
      { new: true }
    );

    if (!violationList) {
      return res.status(404).json({ error: "No such violation data!" });
    }

    res.status(200).json(violationList);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// get all the stored violations list
app.get("/list-all-violation", async (req, res) => {
  try {
    const violation = await ViolationListModel.find();
    if (!violation) {
      return res
        .status(400)
        .json({ error: "Violation List can not be found!" });
    }

    return res.status(200).json({ violation });
  } catch (err) {
    return res.status(500).json({ error: err });
  }
});

// add a program to program list
app.post("/generate-program", async (req, res) => {
  try {
    const { programDescription, programCode } = req.body;

    const existingProgram = await ProgramModel.findOne({
      program_description: programDescription,
      program_code: programCode,
    });

    if (existingProgram) {
      return res.status(200).json({ isExist: true });
    }

    const program = await ProgramModel.create({
      program_description: programDescription,
      program_code: programCode,
    });

    return res.status(201).json({ program });
  } catch (err) {
    return res.status(400).json({ error: err });
  }
});

// update details of program in the program list
app.patch("/update-program-list-row/:id", async (req, res) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: "No such program data!" });
    }

    const currentProgramList = await ProgramModel.findById(id);
    if (!currentProgramList) {
      return res.status(400).json({ error: "Can not find the program list!" });
    }

    const programList = await ProgramModel.findOneAndUpdate(
      { _id: id },
      req.body,
      { new: true }
    );

    if (!programList) {
      return res.status(404).json({ error: "No such program data!" });
    }

    res.status(200).json(programList);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// get all programs
app.get("/program-list", async (req, res) => {
  try {
    const program = await ProgramModel.find();
    if (!program) {
      return res.status(400).json({ error: "Program List can not be found!" });
    }
    return res.status(200).json({ program });
  } catch (err) {
    return res.status(500).json({ error: err });
  }
});

// get details of specific program from program list
app.get("/program-list/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const program = await ProgramModel.findById(id);
    if (!program) {
      return res.status(404).json({ error: "Program list can not be found!" });
    }
    return res.status(200).json({ program });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// delete specific program from program list
app.delete("/delete-program-list/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const programList = await ProgramModel.findOneAndDelete({
      _id: id,
    });

    if (!programList) {
      return res.status(404).json({ error: "Program not found" });
    }

    res.status(200).json({
      message: `Program deleted successfully`,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the program" });
  }
});

//delete incident report from sub-admin

app.delete("/delete-incident-report/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const incidentReport = await IncidentModel.findOneAndDelete({ _id: id });
    if (!incidentReport) {
      return res.status(404).json({ error: "Incident Report not found" });
    }

    res.status(200).json({ message: "Incident Report deleted successfully" });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ error: "An error occured while deleting the program" });
  }
});
// send pending student violation to admin

app.post("/send-incident-report-to-admin", async (req, res) => {
  try {
    const {
      reporter_name,
      student_id,
      violation_id,
      assigned_staff,
      incident_date,
      incident_description,
      place,
      persons_involved,
      witness,
      time,
      makeIncidentReport,
    } = req.body.incidentReportInput;

    if (makeIncidentReport === true) {
      if (!student_id) {
        return res.status(404).json({ error: "Student does not exist" });
      }

      const student = await UserModel.findById(student_id);

      if (!student) {
        return res.status(404).json({ error: "Student does not exist" });
      }

      // Update the field name to match the one used in the client ("file")
      const incidentReportInput = {
        reporter_name,
        student_id,
        violation_id,
        assigned_staff,
        incident_date,
        incident_description,
        place,
        persons_involved,
        witness,
        time,
      };

      const incidentReport = await IncidentModel.create(incidentReportInput);

      return res.status(200).json({ incidentReport });
    }
    const incidentReportInput = {
      student_id,
      violation_id,
    };

    const incidentReport = await IncidentModel.create(incidentReportInput);
    return res.status(200).json({ incidentReport });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

//display incident report based on student_id

app.get("/get-particular-incident-report/:id", async (req, res) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid Incident Report ID" });
    }
    const incidentReport = await IncidentModel.findById(id);

    if (!incidentReport) {
      return res.status(404).json({ error: "Incident Report not found" });
    }

    return res.status(200).json({ incidentReport });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

//display incident report based on student_id

app.get("/get-particular-report/:id", async (req, res) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(201).json({ error: "Invalid Incident Report ID" });
    }
    const incidentReport = await ReportModel.findById(id);

    if (!incidentReport) {
      return res.status(404).json({ error: "Incident Report not found" });
    }

    return res.status(200).json({ incidentReport });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// display pending incident Report

app.get("/get-pending-incident-report", async (req, res) => {
  try {
    const incidentReport = await IncidentModel.find();

    return res.status(200).json({ results: incidentReport });
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: "Internal Server Error" });
  }
});
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post("/delete-file-evidence", async (req, res) => {
  const { webLink, fileId } = req.body;

  const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
  );

  const drive = google.drive({
    version: "v3",
    auth: oauth2Client,
  });

  oauth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

  try {
    const deleteWebLink = await ViolationModel.updateOne(
      { evidence_file: webLink },
      { $pull: { evidence_file: webLink } }
    );

    if (deleteWebLink.nModified > 0) {
      const deleteFile = await drive.files.delete({
        fileId,
      });

      return res.status(200).json({ deleteFile });
    } else {
      return res
        .status(404)
        .json({ error: "Web link not found in evidence_file array" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

//

app.post(
  "/upload-files-and-make-violation",
  upload.array("files", 5),
  async (req, res) => {
    const formDataObject = req.body;
    const uploadedFiles = req.files;
    if (uploadedFiles !== null) {
      //Upload Google Drive Files
      const oauth2Client = new google.auth.OAuth2(
        process.env.CLIENT_ID,
        process.env.CLIENT_SECRET,
        process.env.REDIRECT_URI
      );

      const drive = google.drive({
        version: "v3",
        auth: oauth2Client,
      });

      oauth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });
      try {
        const studentFolder = await findOrCreateStudentFolder(
          drive,
          formDataObject.student_num,
          formDataObject.fullName
        );
        const fileURLs = [];

        for (const uploadedFile of uploadedFiles) {
          const fileMetadata = {
            name: uploadedFile.originalname,
            parents: [studentFolder.id],
          };

          const media = {
            mimeType: uploadedFile.mimetype,
            body: Readable.from(uploadedFile.buffer),
          };

          const driveResponse = await drive.files.create({
            resource: fileMetadata,
            media: media,
            fields: "id,webViewLink",
          });

          const fileURL = driveResponse.data.webViewLink;
          fileURLs.push(fileURL);
        }
        if (formDataObject.makeIncidentReport == "true") {
          if (!formDataObject.student_id) {
            return res.status(404).json({ error: "Student does not exist" });
          }
          const student = await UserModel.findById(formDataObject.student_id);
          if (!student) {
            return res.status(404).json({ error: "Student does not exist" });
          }

          const openAcademicYear = await AcademicYear.findOne({
            status: "OPEN",
          });

          if (!mongoose.Types.ObjectId.isValid(formDataObject.student_id)) {
            return res.status(400).json({ error: "Invalid student_id" });
          }

          const existingViolation = await ViolationModel.findOne({
            student_id: formDataObject.student_id,
            violation_description: formDataObject.violation_description,
            violation_offense: formDataObject.violation_offense,
          });

          if (existingViolation) {
            return res
              .status(201)
              .json({ error: "Violation already exists", existingViolation });
          }

          const incidentReportInput = {
            reporter_name: formDataObject.reporter_name,
            student_id: formDataObject.student_id,
            assigned_staff: formDataObject.assigned_staff,
            incident_date: formDataObject.incident_date,
            incident_description: formDataObject.incident_description,
            place: formDataObject.place,
            persons_involved: formDataObject.persons_involved,
            witness: formDataObject.witness,
            time: formDataObject.time,
          };

          const incidentReport = await ReportModel.create(incidentReportInput);
          const violationData = {
            academicYear: openAcademicYear,
            student_id: formDataObject.student_id,
            report_id: incidentReport._id,
            violation_type: formDataObject.violation_type,
            violation_description: formDataObject.violation_description,
            violation_offense: formDataObject.violation_offense,
            violation_sanction: formDataObject.violation_sanction,
            evidence_file: fileURLs,
          };
          if (formDataObject.remarks) {
            violationData.remarks = formDataObject.remarks;
          }
          const studentViolation = await ViolationModel.create(violationData);
          if (formDataObject.currentId) {
            const deleteSubAdminReport = await IncidentModel.findOneAndDelete({
              _id: formDataObject.currentId,
            });
          }

          return res.status(200).json({ studentViolation, incidentReport });
        } else {
          const openAcademicYear = await AcademicYear.findOne({
            status: "OPEN",
          });

          if (!mongoose.Types.ObjectId.isValid(formDataObject.student_id)) {
            return res.status(400).json({ error: "Invalid student_id" });
          }
          const existingViolation = await ViolationModel.findOne({
            student_id: formDataObject.student_id,
            violation_description: formDataObject.violation_description,
            violation_offense: formDataObject.violation_offense,
          });
          if (existingViolation) {
            return res
              .status(201)
              .json({ error: "Violation already exists", existingViolation });
          }

          const violationData = {
            academicYear: openAcademicYear,
            student_id: formDataObject.student_id,
            violation_type: formDataObject.violation_type,
            violation_description: formDataObject.violation_description,
            violation_offense: formDataObject.violation_offense,
            violation_sanction: formDataObject.violation_sanction,
            evidence_file: fileURLs,
          };
          if (formDataObject.remarks) {
            violationData.remarks = formDataObject.remarks;
          }
          const studentViolation = await ViolationModel.create(violationData);
          return res.status(200).json({ studentViolation });
        }
      } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal server error" });
      }
    } else {
      try {
        if (formDataObject.makeIncidentReport == "true") {
          if (!formDataObject.student_id) {
            return res.status(404).json({ error: "Student does not exist" });
          }
          const student = await StudentModel.findById(
            formDataObject.student_id
          );
          if (!student) {
            return res.status(404).json({ error: "Student does not exist" });
          }

          const openAcademicYear = await AcademicYear.findOne({
            status: "OPEN",
          });

          if (!mongoose.Types.ObjectId.isValid(formDataObject.student_id)) {
            return res.status(400).json({ error: "Invalid student_id" });
          }

          const existingViolation = await ViolationModel.findOne({
            student_id: formDataObject.student_id,
            violation_description: formDataObject.violation_description,
            violation_offense: formDataObject.violation_offense,
          });

          if (existingViolation) {
            return res
              .status(201)
              .json({ error: "Violation already exists", existingViolation });
          }

          const incidentReportInput = {
            reporter_name: formDataObject.reporter_name,
            student_id: formDataObject.student_id,
            assigned_staff: formDataObject.assigned_staff,
            incident_date: formDataObject.incident_date,
            incident_description: formDataObject.incident_description,
            place: formDataObject.place,
            persons_involved: formDataObject.persons_involved,
            witness: formDataObject.witness,
            time: formDataObject.time,
            // evidence_file: uploadedFileData,
          };

          const incidentReport = await ReportModel.create(incidentReportInput);
          const violationData = {
            academicYear: openAcademicYear,
            student_id: formDataObject.student_id,
            report_id: incidentReport._id,
            violation_type: formDataObject.violation_type,
            violation_description: formDataObject.violation_description,
            violation_offense: formDataObject.violation_offense,
            violation_sanction: formDataObject.violation_sanction,
          };
          if (formDataObject.remarks) {
            violationData.remarks = formDataObject.remarks;
          }
          const studentViolation = await ViolationModel.create(violationData);
          if (formDataObject.currentId) {
            const deleteSubAdminReport = await IncidentModel.findOneAndDelete({
              _id: formDataObject.currentId,
            });
          }

          return res.status(200).json({ studentViolation, incidentReport });
        } else {
          const openAcademicYear = await AcademicYear.findOne({
            status: "OPEN",
          });

          if (!mongoose.Types.ObjectId.isValid(formDataObject.student_id)) {
            return res.status(400).json({ error: "Invalid student_id" });
          }
          const existingViolation = await ViolationModel.findOne({
            student_id: formDataObject.student_id,
            violation_description: formDataObject.violation_description,
            violation_offense: formDataObject.violation_offense,
          });
          if (existingViolation) {
            return res
              .status(201)
              .json({ error: "Violation already exists", existingViolation });
          }

          const violationData = {
            academicYear: openAcademicYear,
            student_id: formDataObject.student_id,
            violation_type: formDataObject.violation_type,
            violation_description: formDataObject.violation_description,
            violation_offense: formDataObject.violation_offense,
            violation_sanction: formDataObject.violation_sanction,
          };
          if (formDataObject.remarks) {
            violationData.remarks = formDataObject.remarks;
          }
          // const deleteSubAdminReport = await IncidentModel.findOneAndDelete({
          //   _id: formDataObject.currentId,
          // });
          const studentViolation = await ViolationModel.create(violationData);
          return res.status(200).json({ studentViolation });
        }
      } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal server error" });
      }
    }
  }
);

async function findOrCreateStudentFolder(drive, studentNumber, fullName) {
  const folderName = `${fullName}_${studentNumber}`;

  // Check if the folder already exists
  const existingFolders = await drive.files.list({
    q: `name='${folderName}' and mimeType='application/vnd.google-apps.folder'`,
    fields: "files(id, name)",
  });

  if (existingFolders.data.files.length > 0) {
    // Folder already exists, return the first matching folder
    return existingFolders.data.files[0];
  } else {
    // Folder doesn't exist, create a new folder
    const folderMetadata = {
      name: folderName,
      mimeType: "application/vnd.google-apps.folder",
    };

    const createdFolder = await drive.files.create({
      resource: folderMetadata,
      fields: "id",
    });

    return createdFolder.data;
  }
}

//approve request

app.get("/approve-request-student/:id", async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid student id" });
    }

    const request = await RequestModel.findById(id).session(session);

    if (!request) {
      return res.status(404).json({ message: "Student request not found" });
    }

    const history = await HistoryModel.create(
      [
        {
          student_id: request.student_id,
          student_name: request.student_name,
          student_program: request.student_program,
          student_sex: request.student_sex,
          request_purpose: request.request_purpose,
          request_date: request.createdAt,
          request_status: "approved",
        },
      ],
      { session: session }
    );

    const deletedRequest = await RequestModel.findOneAndDelete({
      _id: id,
    }).session(session);

    await session.commitTransaction();

    return res
      .status(200)
      .json({ message: "Request approved successfully", deletedRequest });
  } catch (err) {
    console.error(err);
    await session.abortTransaction();
    return res.status(500).json({ error: "Internal Server Error" });
  } finally {
    session.endSession();
  }
});

// view student request history

app.get("/view-request-history/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "This student id is not valid" });
    }
    const request = await HistoryModel.findById(id);

    return res.status(200).json({ history: request });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});
// fetch student request history

app.get("/fetch-request-history/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "This student id is not valid" });
    }
    const request = await HistoryModel.find({ student_id: id });

    if (!request) {
      return res.status(201).json({ emptyHistory: true });
    }

    return res.status(200).json({ history: request });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// delete good moral request for student

app.delete("/delete-goodmoral-request/:id", async (req, res) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid student id" });
    }

    const deleteRequest = await RequestModel.findOneAndDelete({ _id: id });

    if (!deleteRequest) {
      return res.status(404).json({ message: "Student request not found" });
    }

    const history = await HistoryModel.create({
      student_id: deleteRequest.student_id,
      student_name: deleteRequest.student_name,
      student_program: deleteRequest.student_program,
      student_sex: deleteRequest.student_sex,
      request_purpose: deleteRequest.request_purpose,
      request_date: deleteRequest.createdAt,
      request_status: "rejected",
    });

    return res.status(200).json(deleteRequest);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

//create good moral request for student

app.post("/create-goodmoral-request", async (req, res) => {
  try {
    const {
      student_id,
      student_name,
      student_program,
      student_sex,
      request_purpose,
    } = req.body;

    if (!student_id || !student_name || !student_program || !request_purpose) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const createdRequest = await RequestModel.create({
      student_id,
      student_name,
      student_program,
      student_sex,
      request_purpose,
    });

    return res.status(201).json({
      createdRequest,
      id: createdRequest._id,
      message: "Good moral request created successfully",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// update individual goodmoral request from student

app.patch("/update-goodmoral-request/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "This request id is not valid" });
    }

    const updateRequest = await RequestModel.findOneAndUpdate(
      { _id: id },
      req.body,
      {
        new: true,
      }
    );

    if (!updateRequest) {
      return res
        .status(400)
        .json({ error: "There is a problem updating the request" });
    }

    return res.status(200).json({ updateRequest });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// fetch individual goodmoral request from student
app.get("/fetch-individual-request/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "This request id is not valid" });
    }

    const request = await RequestModel.findById(id);

    if (!request) {
      return res.status(404).json({ error: "Cannot find the request" });
    }

    return res.status(200).json({ request });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});
// fetch all goodmoral request from student

app.get("/fetch-all-goodmoral-requests", async (req, res) => {
  try {
    const getRequest = await RequestModel.find();
    return res.status(200).json({ allRequest: getRequest });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

//fetch incident reports

app.get("/fetch-incident-reports", async (req, res) => {
  try {
    const incidentReport = await ReportModel.find();

    if (!incidentReport) {
      return res.status(404).json({ error: "Incident Report not found" });
    }
    return res.status(200).json({ incidentReport });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/check-student-violation/:id", async (req, res) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    const violationExist = await ViolationModel.find({ student_id: id });

    if (violationExist.length === 0) {
      return res.status(201).json({ violationExist: false });
    }

    return res.status(200).json({ violationExist });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// fetch individual student violation
app.get("/list-all-student-violation/:id", async (req, res) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }
    const violationCount = await ViolationModel.countDocuments({
      student_id: id,
    });
    const studentViolation = await ViolationModel.find({ student_id: id });

    if (!studentViolation) {
      return res.status(404).json({ error: "Student violation not found" });
    }
    return res.status(200).json({ studentViolation, violationCount });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});
// fetch individual student violation
app.get("/list-user-student-violation/:id", async (req, res) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    const studentViolation = await ViolationModel.find({ _id: id });

    if (!studentViolation) {
      return res.status(404).json({ error: "Student violation not found" });
    }
    return res.status(200).json({ studentViolation });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Fetch All student who have violation

app.get("/list-all-student-violation", async (req, res) => {
  try {
    const studentViolations = await ViolationModel.aggregate([
      {
        $group: {
          _id: "$student_id",
          totalViolations: { $sum: 1 },
        },
      },
    ]);

    if (!studentViolations || studentViolations.length === 0) {
      return res
        .status(400)
        .json({ error: "No students with violations found" });
    }

    const studentsWithViolations = [];

    for (const entry of studentViolations) {
      const student = await UserModel.findById(entry._id);
      studentsWithViolations.push({
        student,
        totalViolations: entry.totalViolations,
      });
    }

    if (!studentsWithViolations || studentsWithViolations.length === 0) {
      return res.status(400).json({ error: "Cannot find students" });
    }

    return res.status(200).json({ studentsWithViolations });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

//fetch all student violations based on id

app.post("/display-all-student-violation-based-id", async (req, res) => {
  const { selectedAcademicYear, selectedSemester, userId } = req.body;
  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Provided an invalid id" });
    }

    if (!selectedSemester) {
      return res.status(400).json({ error: "No Semester Provided" });
    }
    if (!selectedAcademicYear) {
      return res.status(400).json({ error: "No Academic Year Provided" });
    }
    const academicYear = await AcademicYear.findOne({
      academicYear: selectedAcademicYear,
      semester: selectedSemester,
    });
    if (!academicYear) {
      return res.status(404).json({ error: "Academic year not found" });
    }
    const studentInfo = await UserModel.findOne({ _id: userId });
    const studentViolations = await ViolationModel.find({
      academicYear: academicYear._id,
      student_id: studentInfo._id,
    });

    const studentInfoPromises = studentViolations.map(async (violation) => {
      const studentInfo = await UserModel.findById(violation.student_id).select(
        "profileImage studentNumber firstName lastName middleName suffix course sectionYear"
      );
      return { violation, studentInfo };
    });

    const results = await Promise.all(studentInfoPromises);

    if (!results) {
      return res.status(404).json({ err: "Cannot fetch student violations" });
    }

    // Populate the academic year data
    const populatedResults = results.map((result) => ({
      violation: result.violation,
      studentInfo: result.studentInfo,
      academicYear,
    }));

    return res.status(200).json({ results: populatedResults });
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: "Internal Server Error" });
  }
});
//fetch all student violations

app.get("/display-all-student-violation", async (req, res) => {
  try {
    const openAcademicYear = await AcademicYear.findOne({ status: "OPEN" });
    const studentViolations = await ViolationModel.find({
      academicYear: openAcademicYear._id,
    });
    const studentInfoPromises = studentViolations.map(async (violation) => {
      const studentInfo = await UserModel.findById(violation.student_id);
      return { violation, studentInfo };
    });

    const results = await Promise.all(studentInfoPromises);

    if (!results) {
      return res.status(404).json({ err: "Cannot fetch student violations" });
    }

    // Populate the academic year data
    const populatedResults = results.map((result) => ({
      violation: result.violation,
      studentInfo: result.studentInfo,
      academicYear: openAcademicYear, // Add academic year data
    }));

    return res.status(200).json({ results: populatedResults });
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: "Internal Server Error" });
  }
});

// Delete student violation

app.delete("/delete-students-violation/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const student = await ViolationModel.findOneAndDelete({ _id: id });
    const incident = await ReportModel.findOneAndDelete({
      student_id: student.student_id,
    });

    if (!student && !incident) {
      return res
        .status(404)
        .json({ error: "Student Violation and Incident report not found" });
    }

    res.status(200).json({
      message: `Student Violation as well as Incident Report deleted successfully`,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the student" });
  }
});

app.post("/fetch-student-and-violations-info", async (req, res) => {
  const { selectedAcademicYear, selectedSemester, userId } = req.body;
  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Provided an invalid id" });
    }

    if (!selectedSemester) {
      return res.status(400).json({ error: "No Semester Provided" });
    }
    if (!selectedAcademicYear) {
      return res.status(400).json({ error: "No Academic Year Provided" });
    }
    const academicYear = await AcademicYear.findOne({
      academicYear: selectedAcademicYear,
      semester: selectedSemester,
    });
    if (!academicYear) {
      return res.status(404).json({ error: "Academic year not found" });
    }
    const studentInfo = await UserModel.findById(userId).select(
      "studentNumber firstName lastName middleName course sectionYear"
    );
    const studentViolations = await ViolationModel.find({
      academicYear: academicYear._id,
      student_id: studentInfo._id,
    }).select(
      "violation_description violation_type violation_offense violation_sanction createdAt"
    );

    const studentInfoPromises = studentViolations.map(async (violation) => {
      const studentInfo = await UserModel.findById(violation.student_id);
      return { violation, studentInfo };
    });

    const results = await Promise.all(studentInfoPromises);

    if (!results) {
      return res.status(404).json({ err: "Cannot fetch student violations" });
    }

    // Populate the academic year data
    const populatedResults = results.map((result) => ({
      violation: result.violation,
      studentInfo: result.studentInfo,
      academicYear,
    }));

    return res.status(200).json({ results: populatedResults });
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: "Internal Server Error" });
  }
});

app.get("/fetch-all-courses", async (req, res) => {
  try {
    const allCourses = await ProgramModel.distinct("program_code");

    const coursesWithCount = await ViolationModel.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "student_id",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $lookup: {
          from: "programs",
          localField: "user.course",
          foreignField: "program_code",
          as: "program",
        },
      },
      {
        $unwind: "$program",
      },
      {
        $group: {
          _id: {
            program_code: "$program.program_code",
            student_id: "$user._id",
          },
          student_count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: "$_id.program_code",
          student_count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          program_code: "$_id",
          student_count: 1,
        },
      },
    ]);

    const coursesWithoutViolation = allCourses.filter(
      (course) => !coursesWithCount.some((item) => item.program_code === course)
    );

    // Append courses without violations to the result
    coursesWithoutViolation.forEach((course) => {
      coursesWithCount.push({ program_code: course, student_count: 0 });
    });

    return res.status(200).json({ courses: coursesWithCount, allCourses });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});

mongoose.connection.on("error", (err) => {
  console.log(err);
});
