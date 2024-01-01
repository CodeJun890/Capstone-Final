const mongoose = require("mongoose");

const programSchema = new mongoose.Schema({
  program_code: {
    type: String,
    required: true,
  },
  program_description: {
    type: String,
    required: true,
  },
  program_type: {
    type: String,
    default: "COLLEGE",
  },
});

const ProgramModel = mongoose.model("program", programSchema);
module.exports = ProgramModel;
