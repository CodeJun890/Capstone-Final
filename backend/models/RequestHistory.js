const mongoose = require("mongoose");

const historySchema = new mongoose.Schema(
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
    },
    request_date: {
      type: String,
    },
  },
  { timestamps: true }
);

const HistoryModel = mongoose.model("history", historySchema);
module.exports = HistoryModel;
