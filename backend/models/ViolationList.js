const mongoose = require("mongoose");

const violationListSchema = new mongoose.Schema({
  violation_type: {
    type: String,
    required: true,
  },
  violation_description: {
    type: String,
    required: true,
  },
  violation_offense: {
    type: String,
    required: true,
  },
  violation_sanction: {
    type: String,
    required: true,
  },
});

const ViolationListModel = mongoose.model("violationList", violationListSchema);
module.exports = ViolationListModel;
