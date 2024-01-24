const mongoose = require("mongoose");

const violationSchema = new mongoose.Schema(
  {
    academicYear: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "academicYear",
      required: true,
    },
    student_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "student",
    },
    report_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "report",
      default: null,
    },
    violation_type: {
      type: String,
    },
    violation_description: {
      type: String,
    },
    violation_offense: {
      type: String,
    },
    violation_sanction: {
      type: String,
    },
    remarks: {
      type: String,
      default: "N/A",
    },
    status: {
      type: String,
      enum: ["pending", "resolved"],
      default: "pending",
    },
    assigned_by: {
      type: String,
    },
    evidence_file: [],
  },
  { timestamps: true }
);

const ViolationModel = mongoose.model("violation", violationSchema);
module.exports = ViolationModel;
