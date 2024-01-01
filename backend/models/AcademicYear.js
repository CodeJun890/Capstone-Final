const mongoose = require("mongoose");

const academicYearSchema = new mongoose.Schema({
  academicYear: {
    type: String,
    required: true,
  },
  yearFrom: {
    type: String,
    required: true,
  },
  yearTo: {
    type: String,
    required: true,
  },
  semester: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "CLOSE",
  },
});

// Create a model for the academic year
const AcademicYear = mongoose.model("academicYear", academicYearSchema);

module.exports = AcademicYear;
