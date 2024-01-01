import { CSVLink, CSVDownload } from "react-csv";

export default function ReportCSV({ studentInfo }) {
  const filteredStudentInfo = studentInfo.map((info) => {
    // Destructure the studentInfo object and omit the specified fields
    const { _id, __v, student_id, sectionYear, ...filteredData } = info;
    // Convert sectionYear to a string and format as text
    filteredData.sectionYear = "'" + sectionYear.toString();
    return filteredData;
  });
  return (
    <>
      <CSVLink
        data={filteredStudentInfo}
        filename="Student-Violation-Report"
        target="_blank"
        className="btn btn-success btn-sm"
      >
        CSV
      </CSVLink>
    </>
  );
}
