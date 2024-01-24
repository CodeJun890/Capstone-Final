const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    reporter_name: {
      type: String,
    },
    assigned_staff: {
      type: String,
      required: true,
    },
    student_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    incident_date: {
      type: Date,
      default: null,
    },
    incident_description: {
      type: String,
    },
    place: {
      type: String,
    },
    persons_involved: {
      type: String,
    },
    witness: {
      type: String,
    },
    time: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

const ReportModel = mongoose.model("report", reportSchema);

module.exports = ReportModel;
