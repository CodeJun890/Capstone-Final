const mongoose = require("mongoose");

const studentRequestSchema = new mongoose.Schema(
  {
    student_id: {
      type: String,
    },
    student_name: {
      type: String,
    },
    student_program: {
      type: String,
    },
    student_sex: {
      type: String,
    },
    request_purpose: {
      type: String,
    },
    request_status: {
      type: String,
      default: "pending",
    },
  },
  { timestamps: true }
);

const RequestModel = mongoose.model("request", studentRequestSchema);

module.exports = RequestModel;
