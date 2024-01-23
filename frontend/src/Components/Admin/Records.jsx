import React from "react";
import { useState, useContext, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import DataTable from "react-data-table-component";
import axios from "axios";
import MoonLoader from "react-spinners/MoonLoader";
import { AdminContext } from "../../../Context/AdminContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Swal from "sweetalert2";
import {
  faMagnifyingGlassPlus,
  faFileArrowDown,
} from "@fortawesome/free-solid-svg-icons";
import format from "date-fns/format";
import ReportPDF from "./ExportFiles/ReportPDF";
import { PDFDownloadLink } from "@react-pdf/renderer";
import ReportCSV from "./ExportFiles/ReportCSV";
import IncidentReportPDF from "./ExportFiles/IncidentReportPDF";

export default function Records({ showRecord, setShowRecord }) {
  const {
    baseUrl,
    setSelectedStudentId,
    selectedStudentId,
    selectedStudentIncidentReport,
    setSelectedStudentIncidentReport,
  } = useContext(AdminContext);
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [pending, setPending] = React.useState(false);
  const rowsPerPageOptions = [5, 10, 20, 30];
  const [filterValue, setFilterValue] = useState("");
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [record, setRecord] = useState([]);
  const [studentHistory, setStudentHistory] = useState([]);
  const [currentStudent, setCurrentStudent] = useState("");
  const [allAcademicYear, setAllAcademicYear] = useState([]);
  const [academicYear, setAcademicYear] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedAcademicYear, setSelectedAcademicYear] = useState("");
  const [studentInfo, setStudentInfo] = useState(null);
  const [studentInfoIncident, setStudentInfoIncident] = useState(null);
  const [studentInfoCSV, setStudentInfoCSV] = useState(null);
  const [violationInfo, setViolationInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [publicUrls, setPublicUrls] = useState(null);
  const [recordPublicUrls, setRecordPublicUrls] = useState(null);
  const [showPublicUrls, setShowPublicUrls] = useState(false);

  useEffect(() => {
    if (academicYear && selectedAcademicYear && selectedSemester) {
      setPending(true);
      setStudentHistory([]);
      axios
        .post(baseUrl + "fetch-students-by-academic-year", {
          selectedAcademicYear,
          selectedSemester,
        })
        .then((res) => {
          if (res.status === 201) {
            setRecord([]);
            setFilteredRecords([]);
            setStudentHistory([]);
            setPending(false);
            return;
          }
          const studentsWithViolations = res.data.studentsWithViolations;
          const studentsWithTotalViolations = studentsWithViolations.map(
            (item) => {
              return {
                totalViolations: item.totalViolations,
                ...item.student,
              };
            }
          );

          setRecord(studentsWithTotalViolations);
          setFilteredRecords(studentsWithTotalViolations);
          setPending(false);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setPending(false);
    }
  }, [academicYear, selectedAcademicYear, selectedSemester]);

  useEffect(() => {
    if (currentStudent) {
      axios
        .get(baseUrl + `list-all-student-violation/${currentStudent}`)
        .then((res) => {
          if (res.status === 200) {
            setStudentHistory(res.data.studentViolation);
            setPending(false);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [currentStudent]);

  useEffect(() => {
    axios
      .get(baseUrl + "fetch-academic-year")
      .then((res) => {
        if (res.status === 200) {
          setAllAcademicYear(res.data.acadYear);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleClose = () => {
    setShowRecord(!showRecord);
    setSelectedStudentId(null);
  };
  const handleClosePublicUrls = () => {
    setShowPublicUrls(false);
  };

  const columns = [
    {
      name: "Student Number",
      selector: (row) => row.studentNumber,
      wrap: true,
      sortable: true,
    },
    {
      name: "Full Name",
      selector: (row) =>
        row.lastName +
          ", " +
          row.firstName +
          " " +
          row.middleName +
          "." +
          row.suffix ?? "",
      wrap: true,
      sortable: true,
    },
    {
      name: "Course",
      selector: (row) => row.course,
      sortable: true,
    },
    {
      name: "Section",
      selector: (row) => row.course + " " + row.sectionYear,
      sortable: true,
    },
    {
      name: "Total Violation",
      selector: (row) => row.totalViolations,
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div
          className="btn-cont d-flex align-items-center justify-content-center"
          id="btn-container-records"
        >
          <div
            onClick={() => handleViewHistory(row._id)}
            style={{ cursor: "pointer", fontSize: "1.15rem" }}
            className="text-primary"
          >
            <Button size="sm" variant="primary">
              View
            </Button>
          </div>
        </div>
      ),
    },
    {
      name: "Violation Report",
      wrap: true,
      cell: (row) => (
        <div
          className="btn-cont d-flex align-items-center justify-content-center"
          id="btn-container-records"
        >
          <div
            className="ms-2 mt-0 text-success"
            onClick={() => {
              handleDownloadPdf(row._id);
              setLoading(true);
            }}
            style={{
              marginTop: "5px",
              cursor: "pointer",
              fontSize: "1.15rem",
            }}
          >
            {selectedStudentId === row._id ? (
              <div className="gap-1">
                <PDFDownloadLink
                  document={<ReportPDF studentInfo={studentInfo} />}
                  fileName="Student-Violation-Report"
                >
                  <Button size="sm" variant="danger" className="me-1">
                    PDF
                  </Button>
                </PDFDownloadLink>
                <ReportCSV studentInfo={studentInfo} />
              </div>
            ) : (
              <Button size="sm" variant="success">
                Download File
              </Button>
            )}
          </div>
        </div>
      ),
    },
  ];

  const columnsViolationHistory = [
    {
      name: "Violation Type",
      wrap: true,
      selector: (row) => row.violation_type,
      sortable: true,
    },
    {
      name: "Violation Description",
      wrap: true,
      selector: (row) => row.violation_description,
      sortable: true,
    },
    {
      name: "Sanction",
      wrap: true,
      selector: (row) => row.violation_sanction,
      sortable: true,
    },
    {
      name: "Date",
      wrap: true,
      selector: (row) => format(new Date(row.createdAt), "MMMM d, yyyy"),
      sortable: true,
    },
    {
      name: "Time",
      wrap: true,
      selector: (row) => format(new Date(row.createdAt), "h:mm a"),
      sortable: true,
    },
    {
      name: "Incident Report",
      wrap: true,
      cell: (row) => (
        <div
          className="btn-cont d-flex align-items-center justify-content-center"
          id="btn-container-records"
        >
          <div
            className="ms-2 mt-0 text-success"
            onClick={() => {
              handleDownloadIncidentPdf(row.report_id);
              setLoading(true);
            }}
            style={{
              marginTop: "5px",
              cursor: "pointer",
              fontSize: "1.15rem",
            }}
          >
            {row.report_id ? (
              selectedStudentIncidentReport === row.report_id ? (
                <div>
                  <PDFDownloadLink
                    document={
                      <IncidentReportPDF
                        studentInfoIncident={studentInfoIncident}
                      />
                    }
                    fileName="Incident-Report"
                  >
                    <Button size="sm" variant="danger" className="me-1">
                      PDF
                    </Button>
                  </PDFDownloadLink>
                </div>
              ) : (
                <Button
                  size="sm"
                  variant="success"
                  onClick={() => {
                    handleDownloadIncidentPdf(row.report_id);
                    setLoading(true);
                  }}
                >
                  Download File
                </Button>
              )
            ) : (
              <div className="btn btn-outline btn-outline-danger btn-sm">
                Not Available
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      name: "File Attachment",
      wrap: true,
      cell: (row) => (
        <div>
          {row.evidence_file.length > 0 ? (
            <div
              className="btn btn-primary btn-sm ms-4"
              onClick={() => handlePublicURLs(row.evidence_file)}
            >
              View File
            </div>
          ) : (
            <div className="btn btn-outline btn-outline-danger btn-sm">
              Not Available
            </div>
          )}
        </div>
      ),
    },
  ];

  const handlePublicURLs = (URLs) => {
    setShowPublicUrls(true);
    setPublicUrls(URLs);
  };

  const handleDownloadIncidentPdf = (incidentId) => {
    if (incidentId) {
      axios
        .get(`${baseUrl}get-particular-report/${incidentId}`)
        .then((res) => {
          if (res.status === 200) {
            setStudentInfoIncident(res.data.incidentReport);
            setSelectedStudentIncidentReport(incidentId);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleDownloadPdf = (userId) => {
    axios
      .post(baseUrl + "display-all-student-violation-based-id", {
        selectedAcademicYear,
        selectedSemester,
        userId,
      })
      .then((res) => {
        if (res.status === 200) {
          const data = res.data.results;
          const unifiedArray = data.map((item) => ({
            ...item.studentInfo,
            ...item.violation,
            academicYear: item.academicYear.academicYear,
            semester: item.academicYear.semester,
          }));
          setStudentInfo(unifiedArray);
          setSelectedStudentId(userId);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleFilter = (e) => {
    const value = e.target.value.toLowerCase();
    setFilterValue(value);

    const newData = record.filter((row) => {
      return (
        row.studentNumber.toLowerCase().includes(value) ||
        row.firstName.toLowerCase().includes(value) ||
        row.middleName.toLowerCase().includes(value) ||
        row.lastName.toLowerCase().includes(value) ||
        row.sectionYear.toLowerCase().includes(value) ||
        row.suffix.toLowerCase().includes(value) ||
        row.course.toLowerCase().includes(value)
      );
    });

    setFilteredRecords(newData);
  };

  const handleViewHistory = (id) => {
    setCurrentStudent(id);
  };

  const tableHeaderStyles = {
    headCells: {
      style: {
        fontWeight: "bold",
        fontSize: "14px",
        background: "#0d6efd",
        color: "white",
      },
    },
    cell: {
      style: {
        padding: "20px 0px",
      },
    },
  };

  const handleDeleteFileEvidence = (webLink) => {
    if (webLink) {
      const regex = /(?:\/d\/|\/file\/d\/|id=|open\?id=)([^\/\?]+)/;
      const match = webLink.match(regex);
      const data = {
        webLink,
        fileId: match[1],
      };
      axios
        .post(baseUrl + "delete-file-evidence", data)
        .then((res) => {
          if (res.status === 200) {
            setPublicUrls((prevUrls) =>
              prevUrls.filter((url) => url !== webLink)
            );
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <>
      <Modal
        show={showPublicUrls}
        onHide={handleClosePublicUrls}
        backdrop="static"
        centered
        size="xl"
      >
        <Modal.Header closeButton className="bg-success">
          <Modal.Title className="text-light text-uppercase fw-bold">
            File Attachments
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container-fluid py-3">
            <div className="h4 fw-bold text-uppercase text-center bg-secondary p-2 rounded w-50 text-light mx-auto">
              Available Evidence Files
            </div>
            <div className="row justify-content-center">
              {publicUrls &&
                publicUrls.map((url, index) => (
                  <div className="col-md-6" key={index}>
                    <div className="input-wrap mt-2">
                      <Form.Label className="fw-bold" htmlFor={index + 1}>
                        Evidence #{index + 1}
                      </Form.Label>
                      <Form.Control
                        type="text"
                        value={url}
                        id={index + 1}
                        readOnly
                      />
                    </div>
                    <div className="text-center">
                      <a
                        href={url}
                        target="_blank"
                        className="btn btn-primary btn-sm mt-1"
                      >
                        View File
                      </a>
                      <a
                        className="btn btn-danger btn-sm mt-1 ms-2"
                        onClick={() => {
                          Swal.fire({
                            title: "Are you sure?",
                            text: "You won't be able to revert this!",
                            icon: "warning",
                            showCancelButton: true,
                            confirmButtonColor: "#3085d6",
                            cancelButtonColor: "#d33",
                            confirmButtonText: "Yes, delete it!",
                          }).then((result) => {
                            if (result.isConfirmed) {
                              Swal.fire(
                                "Deleted!",
                                "Student Violation has been deleted.",
                                "success"
                              );
                              handleDeleteFileEvidence(url);
                              handleClose(false);
                            }
                          });
                        }}
                      >
                        Delete File
                      </a>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClosePublicUrls}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={showRecord}
        onHide={handleClose}
        backdrop="static"
        size="xl"
        top="true"
      >
        <Modal.Header closeButton className="bg-success text-light">
          <Modal.Title className="text-uppercase fw-bold">Records</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container-fluid">
            <div className="row d-flex justify-content-between">
              <div className="col-md-4">
                <h6
                  className="fw-bold text-uppercase"
                  style={{ width: "300px", display: "inline-block" }}
                >
                  Filter By Academic Year
                </h6>
                <Form.Select
                  id="ay-code"
                  value={academicYear}
                  onChange={(e) => {
                    setAcademicYear(e.target.value);

                    const [selectedAcademicYear, selectedSemester] =
                      e.target.value.split(" | ");
                    setSelectedSemester(selectedSemester);
                    setSelectedAcademicYear(selectedAcademicYear);
                  }}
                >
                  <option value="" hidden>
                    Select Academic Year
                  </option>
                  {allAcademicYear &&
                    allAcademicYear.map((year, index) => (
                      <option
                        key={index}
                        value={`${year.academicYear} | ${year.semester}`}
                      >
                        {year.academicYear} | {year.semester}
                      </option>
                    ))}
                </Form.Select>
              </div>
              <div className="col-md-4">
                <h6
                  className="fw-bold text-uppercase"
                  style={{ width: "300px", display: "inline-block" }}
                >
                  Find Student
                </h6>
                <Form.Control
                  type="text"
                  onChange={handleFilter}
                  value={filterValue}
                  placeholder="search"
                  id="search-filter-records"
                />
              </div>
            </div>
            <h6 className="text-uppercase fw-bold mt-4">Student List</h6>
            <DataTable
              className="shadow violation-datatable"
              customStyles={tableHeaderStyles}
              columns={columns}
              data={filteredRecords}
              fixedHeader
              persistTableHead
              pagination
              selectableRowsHighlight
              highlightOnHover
              paginationPerPage={perPage}
              paginationRowsPerPageOptions={rowsPerPageOptions}
              paginationTotalRows={filteredRecords.length}
              onChangeRowsPerPage={(currentRowsPerPage, currentPage) => {
                setPerPage(currentRowsPerPage);
                setCurrentPage(currentPage);
              }}
              paginationDefaultPage={currentPage}
              onChangePage={(currentPage) => {
                setCurrentPage(currentPage);
              }}
              sortServer={false}
              progressPending={pending}
              progressComponent={
                <div className="my-5">
                  <MoonLoader
                    className="mx-auto"
                    color={"#000000"}
                    loading={pending}
                    size={40}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                  />
                  <div className="leader text-center">Please wait...</div>
                </div>
              }
            />
            <h6 className="text-uppercase fw-bold">
              Student Violation History
            </h6>
            <DataTable
              className="shadow violation-datatable"
              customStyles={tableHeaderStyles}
              columns={columnsViolationHistory}
              data={studentHistory}
              fixedHeader
              persistTableHead
              pagination
              selectableRowsHighlight
              highlightOnHover
              paginationPerPage={perPage}
              paginationRowsPerPageOptions={rowsPerPageOptions}
              paginationTotalRows={studentHistory.length}
              onChangeRowsPerPage={(currentRowsPerPage, currentPage) => {
                setPerPage(currentRowsPerPage);
                setCurrentPage(currentPage);
              }}
              paginationDefaultPage={currentPage}
              onChangePage={(currentPage) => {
                setCurrentPage(currentPage);
              }}
              sortServer={false}
              progressPending={pending}
              progressComponent={
                <div className="my-5">
                  <MoonLoader
                    className="mx-auto"
                    color={"#000000"}
                    loading={pending}
                    size={40}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                  />
                  <div className="leader text-center">Please wait...</div>
                </div>
              }
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
