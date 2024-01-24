const mongoose = require("mongoose");

const pendingIncidentSchema = new mongoose.Schema(
  {
    reporter_name: {
      type: String,
      default: "N/A",
    },
    assigned_staff: {
      type: String,
      default: "N/A",
    },
    student_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    violation_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "violationList",
    },
    incident_date: {
      type: Date,
      default: null,
    },
    incident_description: {
      type: String,
      default: "N/A",
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
    status: {
      type: String,
      default: "pending",
    },
  },
  { timestamps: true }
);

const IncidentModel = mongoose.model("incidentReport", pendingIncidentSchema);

module.exports = IncidentModel;
