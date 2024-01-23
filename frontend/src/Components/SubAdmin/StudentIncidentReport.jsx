import React, { useState, useRef, useContext, useEffect } from "react";
import DataTable from "react-data-table-component";
import Modal from "react-bootstrap/Modal";
import InputGroup from "react-bootstrap/InputGroup";
import axios from "axios";
import MoonLoader from "react-spinners/MoonLoader";
import PulseLoader from "react-spinners/PulseLoader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import {
  faPlus,
  faMagnifyingGlass,
  faEraser,
  faTrashAlt,
  faExclamationTriangle,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import Button from "react-bootstrap/esm/Button";
import Form from "react-bootstrap/Form";
import Swal from "sweetalert2";
import { SubAdminContext } from "../../../Context/SubAdminContext";

import StudentListModal from "./StudentListModal";
import ViolationListModal from "./ViolationListModal";

import format from "date-fns/format";
import profileImg from "../../Assets/upload.jpg";
import { useNavigate } from "react-router-dom";

export default function StudentIncidentReport({ isToggled }) {
  const navigate = useNavigate();
  const { baseUrl, userData } = useContext(SubAdminContext);
  const [perPage, setPerPage] = useState(5);
  const [pending, setPending] = React.useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPageOptions = [5, 10];
  const [filterValue, setFilterValue] = useState("");
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [record, setRecord] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [incidentRecords, setIncidentRecords] = useState([]);
  const [show, setShow] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isNotMatch, setIsNotMatch] = useState(false);
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [isPassCorrect, setIsPassCorrect] = useState(false);

  const [fetchStudentViolationsFlag, setFetchStudentViolationsFlag] =
    useState(false);

  useEffect(() => {
    axios
      .get(baseUrl + "get-pending-incident-report")
      .then((res) => {
        if (res.status === 200) {
          const data = res.data.results;
          setRecord(data);
          setFilteredRecords(data);
          setPending(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });

    axios
      .get(baseUrl + "fetch-incident-reports")
      .then((res) => {
        if (res.status === 200) {
          setIncidentRecords(res.data.incidentReport);
        }
      })
      .catch((err) => {
        console.log(err);
      });

    setFetchStudentViolationsFlag(false);
  }, [fetchStudentViolationsFlag]);

  const columns = [
    {
      name: "Report #",
      selector: (row, index) => index + 1,
      sortable: true,
    },
    {
      name: "Reporter Name",
      selector: (row) => row.reporter_name,
      wrap: true,
      sortable: true,
    },

    {
      name: "Status",
      selector: (row) => format(new Date(row.createdAt), "MMMM d, yyyy"),
      sortable: true,
    },
    {
      name: "Incident Date",
      selector: (row) => format(new Date(row.createdAt), "MMMM d, yyyy"),
      sortable: true,
    },
    {
      name: "Time",
      selector: (row) => format(new Date(row.createdAt), "h:mm a"),
      sortable: true,
    },
    {
      name: "Status",
      cell: (row) => (
        <div className="d-flex mt-3 align-items-center justify-content-center">
          <p
            className="text-uppercase px-2 py-1 rounded text-light"
            style={{ backgroundColor: getStatusColor(row.status) }}
          >
            {row.status}
          </p>
        </div>
      ),
    },
    {
      name: "Actions",
      cell: (row) => (
        <div
          className=" h5 ms-3 btn-delete text-danger"
          style={{ cursor: "pointer" }}
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
                handleDeleteIncidentReport(row._id);
              }
            });
          }}
        >
          <FontAwesomeIcon icon={faTrashAlt} />
        </div>
      ),
    },
  ];

  const handleDeleteIncidentReport = (id) => {
    axios
      .delete(`${baseUrl}delete-incident-report/${id}`)
      .then((res) => {
        setRecord((prevRecords) =>
          prevRecords.filter((studentViolation) => studentViolation._id !== id)
        );
        setFilteredRecords((prevFilteredRecords) =>
          prevFilteredRecords.filter(
            (incidentReport) => incidentReport._id !== id
          )
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleClose = () => {
    setShow(false);
    setPassword("");
    setConfirmPassword("");
    setIsNotMatch(false);
    setIsPassCorrect(false);
  };
  const handleShow = () => setShow(true);

  const handleIncidentReport = (id) => {
    axios
      .delete(`${baseUrl}delete-students-violation/${id}`)
      .then((res) => {
        setRecord((prevRecords) =>
          prevRecords.filter((studentViolation) => studentViolation._id !== id)
        );
        setFilteredRecords((prevFilteredRecords) =>
          prevFilteredRecords.filter(
            (studentViolation) => studentViolation._id !== id
          )
        );
      })
      .catch((err) => {
        console.log(err);
        console.log(id);
      });
  };
  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "#dc3545";
      default:
        return "transparent";
    }
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
        row.course.toLowerCase().includes(value) ||
        row.remarks.toLowerCase().includes(value) ||
        row.violation_type.toLowerCase().includes(value) ||
        row.violation_offense.toLowerCase().includes(value) ||
        row.violation_description.toLowerCase().includes(value) ||
        row.academicYear.toLowerCase().includes(value) ||
        row.violation_sanction.toLowerCase().includes(value)
      );
    });

    setFilteredRecords(newData);
  };

  const tableHeaderStyles = {
    headCells: {
      style: {
        fontWeight: "bold",
        fontSize: "14px",
        backgroundColor: "#0d6efd",
        color: "#ffffff",
      },
    },
  };

  return (
    <>
      <div
        className={`container-fluid mt-5 px-3 px-md-5 pb-5 scrollable-container studentViolation ${
          isToggled ? "dark" : ""
        }`}
      >
        <div
          className={`violation-title mb-md-3 mb-4 text-md-start text-center ${
            isToggled ? "text-light" : ""
          }`}
        >
          <div
            className="display-6 fw-bold text-uppercase"
            style={{ letterSpacing: "2px" }}
          >
            Create Incident Report
          </div>
          <div className="h6 mb-5">Record and Manage Student Violations </div>
        </div>
        <div
          className="d-flex mt-3 justify-content-between align-items-center"
          id="action-btn-student-entry"
        >
          <div className="container-group" id="add-btn">
            <button
              className="btn btn-success btn-sm ms-1"
              onClick={() => setModalShow(true)}
            >
              <FontAwesomeIcon icon={faPlus} className="me-1" />
              Create New
            </button>
          </div>
          <div className="mb-1">
            <Form.Control
              type="text"
              onChange={handleFilter}
              value={filterValue}
              placeholder="search"
              id="search-filter-1"
            />
          </div>
        </div>

        <DataTable
          className="shadow violation-datatable"
          title="Incident Report List "
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
          fixedHeaderScrollHeight="300px"
        />
      </div>
      <CreateViolationEntry
        show={modalShow}
        setFetchStudentViolationsFlag={setFetchStudentViolationsFlag}
        onHide={() => setModalShow(false)}
      />
    </>
  );
}

function CreateViolationEntry({ setFetchStudentViolationsFlag, ...props }) {
  const {
    baseUrl,
    academicYear,
    setAcademicYear,
    currentStudent,
    currentViolationList,
    setCurrentViolationList,
    setCurrentStudent,
    selectedStudentDetails,
    setSelectedStudentDetails,
    selectedViolationDetails,
    setSelectedViolationDetails,
    userData,
  } = useContext(SubAdminContext);

  const [perPage, setPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPageOptions = [5, 10, 20, 30];
  const [filterValue, setFilterValue] = useState("");
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [record, setRecord] = useState([]);
  const [showStudentListModal, setShowStudentListModal] = useState(false);
  const [showViolationListModal, setShowViolationListModal] = useState(false);
  const current = currentStudent || currentViolationList;
  const [incidentDate, setIncidentDate] = useState(new Date());
  const [incidentDescription, setIncidentDescription] = useState("N/A");
  const [reporterName, setReporterName] = useState("N/A");
  const [remarks, setRemarks] = useState("");
  const [isExist, setIsExist] = useState(false);
  const [pending, setPending] = useState(false);
  const [violationInput, setViolationInput] = useState(false);
  const [makeIncidentReport, setMakeIncidentReport] = useState(false);
  const [selectedFileEvidence, setSelectedFileEvidence] = useState([]);
  const [isClickedIncidentReport, setIsClickedIncidentReport] = useState(null);
  const [uploading, setIsUploading] = useState(false);
  const [personInvolved, setPersonInvolved] = useState("");
  const [incidentTime, setIncidentTime] = useState(new Date());
  const [witness, setWitness] = useState("");
  const [place, setPlace] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      if (currentStudent) {
        try {
          const [
            studentResponse,
            academicYearResponse,
            studentViolationResponse,
          ] = await Promise.all([
            axios.get(baseUrl + `students/${currentStudent}`),
            axios.get(baseUrl + "fetch-academic-year"),
            axios.get(baseUrl + `list-all-student-violation/${currentStudent}`),
          ]);

          if (studentResponse.status === 200) {
            setSelectedStudentDetails(studentResponse.data.student);
          }

          if (academicYearResponse.status === 200) {
            const openAcademicYears = academicYearResponse.data.acadYear.filter(
              (year) => year.status === "OPEN"
            );
            setAcademicYear(openAcademicYears);
          }

          if (studentViolationResponse.status === 200) {
            setRecord(studentViolationResponse.data.studentViolation);
            setFilteredRecords(studentViolationResponse.data.studentViolation);
            setPending(false);
          }
        } catch (err) {
          console.error(err);
        }
      }
    };

    fetchData();
  }, [currentStudent]);

  useEffect(() => {
    if (currentViolationList) {
      axios
        .get(baseUrl + `violation-list/${currentViolationList}`)
        .then((res) => {
          if (res.status === 200) {
            setSelectedViolationDetails(res.data.violationList);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [currentViolationList]);

  const columns = [
    {
      name: "Violation Type",
      selector: (row, index) => row.violation_type,
      sortable: true,
    },
    {
      name: "Violation Description",
      selector: (row) => row.violation_description,
      wrap: true,
      sortable: true,
    },
    {
      name: "Offense",
      selector: (row) => row.violation_offense,
      sortable: true,
    },
    {
      name: "Sanction",
      selector: (row) => row.violation_sanction,
      sortable: true,
    },
    {
      name: "Date",
      selector: (row) => format(new Date(row.createdAt), "MMMM d, yyyy"),
      sortable: true,
    },
    {
      name: "Time",
      selector: (row) => format(new Date(row.createdAt), "h:mm a"),
      sortable: true,
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    if (currentStudent && currentViolationList && makeIncidentReport) {
      const incidentReportInput = {
        reporter_name: reporterName,
        student_id: selectedStudentDetails._id,
        violation_id: selectedViolationDetails._id,
        assigned_staff:
          userData.firstName +
            " " +
            userData.middleName.charAt(0) +
            " " +
            userData.lastName +
            " " +
            userData.suffix ?? "",
        incident_date: incidentDate,
        incident_description: incidentDescription,
        place: place,
        persons_involved: personInvolved,
        witness: witness,
        time: incidentTime,
        makeIncidentReport: makeIncidentReport,
      };
      if (current) {
        axios
          .post(baseUrl + "send-incident-report-to-admin", {
            incidentReportInput,
          })
          .then(async (res) => {
            if (res.status === 200) {
              setRecord((prevRecords) => [
                ...prevRecords,
                res.data.incidentReport,
              ]);
              setFilteredRecords((prevFilteredRecords) => [
                ...prevFilteredRecords,
                res.data.incidentReport,
              ]);
              setFetchStudentViolationsFlag(true);
              setIsUploading(false);
              Swal.fire({
                position: "center",
                icon: "success",
                title: "Success!",
                text: "Student Violation Added Successfully!",
                showConfirmButton: false,
                timer: 2000,
                padding: "3em",
              });
            } else {
              setIsExist(true);
              setIsUploading(false);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    } else {
      setViolationInput(true);
      setIsUploading(false);
    }
  };
  const tableHeaderStyles = {
    headCells: {
      style: {
        fontWeight: "bold",
        fontSize: "14px",
        backgroundColor: "#0d6efd",
        color: "#ffffff",
      },
    },
  };
  const clearInputFields = () => {
    setAcademicYear("");
    setSelectedStudentDetails([]);
    setCurrentStudent("");
    setSelectedViolationDetails([]);
    setCurrentViolationList("");
    setFilteredRecords([]);
    setRecord([]);
    setRemarks("N/A");
    setIsExist(false);
    setViolationInput(false);
    setIncidentDate(null);
    setIncidentDescription("N/A");
    setReporterName("N/A");
    setMakeIncidentReport(false);
    setSelectedFileEvidence([]);
  };

  const selectStudentDetails = () => {
    setShowStudentListModal(true);
    setIsExist(false);
    setViolationInput(false);
  };

  const selectViolationDetails = () => {
    setShowViolationListModal(true);
    setIsExist(false);
    setViolationInput(false);
  };

  const fullName = `${selectedStudentDetails.lastName ?? ""}, ${
    selectedStudentDetails.firstName ?? ""
  } ${
    selectedStudentDetails.middleName
      ? selectedStudentDetails.middleName.charAt(0)
      : ""
  }. ${selectedStudentDetails.suffix ?? ""}`;

  return (
    <>
      {showStudentListModal ? (
        <StudentListModal
          showStudentListModal={showStudentListModal}
          setShowStudentListModal={setShowStudentListModal}
        />
      ) : null}
      {showViolationListModal ? (
        <ViolationListModal
          showViolationListModal={showViolationListModal}
          setShowViolationListModal={setShowViolationListModal}
        />
      ) : null}
      <Modal
        {...props}
        backdrop="static"
        onHide={() => {
          props.onHide();
          clearInputFields();
        }}
        dialogClassName="modal-90w"
        aria-labelledby="example-custom-modal-styling-title"
      >
        <Modal.Header closeButton className="bg-success text-light">
          <Modal.Title
            className="text-uppercase fw-bold"
            id="example-custom-modal-styling-title"
          >
            <FontAwesomeIcon
              icon={faExclamationTriangle}
              className="icons me-2"
            />
            Create Incident Report
          </Modal.Title>
        </Modal.Header>
        <Form ref={inputRef} onSubmit={handleSubmit}>
          <Modal.Body>
            {isExist ? (
              <p className="alert alert-danger text-center">
                You already assigned this violation to the selected student
              </p>
            ) : (
              ""
            )}
            {violationInput ? (
              <p className="alert alert-warning text-center">
                Provide incident report and fill the necessary information to
                create student violation
              </p>
            ) : (
              ""
            )}
            <div className="container-fluid" id="violation-entry-cont">
              <div className="row d-flex justify-content-even">
                <div className="col-lg-6">
                  <fieldset className="border rounded-3 p-3">
                    <legend
                      className="text-uppercase float-none w-auto px-3 fw-bold"
                      style={{ fontSize: "1rem" }}
                    >
                      Student Details
                    </legend>
                    <div className="container-fluid d-flex student-outer">
                      <div
                        className="profile-image-container mt-2 pe-3"
                        style={{ maxWidth: "125px" }}
                      >
                        <img
                          src={
                            selectedStudentDetails.profileImage === null ||
                            selectedStudentDetails.profileImage === undefined
                              ? profileImg
                              : selectedStudentDetails.profileImage
                          }
                          className="rounded img-fluid"
                          alt="profile-image"
                          style={{
                            width: "100%",
                            position: "relative",
                          }}
                        />
                      </div>
                      <div className="student-details-container p-2">
                        <div className="row">
                          <div className="input-wrap d-flex align-items-center mt-1">
                            <Form.Label
                              htmlFor="inputAcadYear"
                              style={{ minWidth: "125px" }}
                            >
                              Academic Year
                            </Form.Label>
                            <Form.Control
                              type="text"
                              id="inputAcadYear"
                              value={
                                academicYear
                                  ? academicYear.map(
                                      (year) => year.academicYear
                                    )
                                  : ""
                              }
                              readOnly
                            />
                          </div>
                          <div className="input-wrap d-flex align-items-center mt-1">
                            <InputGroup>
                              <Form.Label
                                htmlFor="inputStudentNumber"
                                style={{ minWidth: "125px" }}
                              >
                                Student Number
                              </Form.Label>
                              <Form.Control
                                type="text"
                                id="inputStudentNumber"
                                value={
                                  selectedStudentDetails.studentNumber ?? ""
                                }
                                required
                                readOnly
                              />
                              <InputGroup.Text
                                id="basic-addon2"
                                className="bg-primary text-light"
                                style={{ cursor: "pointer" }}
                                onClick={selectStudentDetails}
                              >
                                <FontAwesomeIcon icon={faMagnifyingGlass} />
                              </InputGroup.Text>
                            </InputGroup>
                          </div>
                        </div>
                        <div className="input-wrap d-flex align-items-center mt-1">
                          <Form.Label
                            htmlFor="inputName"
                            style={{ minWidth: "125px" }}
                          >
                            Name
                          </Form.Label>
                          <Form.Control
                            type="text"
                            id="inputName"
                            value={
                              selectedStudentDetails.firstName ? fullName : ""
                            }
                            readOnly
                          />
                        </div>
                        <div className="input-wrap d-flex align-items-center mt-1">
                          <Form.Label
                            htmlFor="inputYearSection"
                            style={{ minWidth: "125px" }}
                          >
                            Year | Section
                          </Form.Label>
                          <Form.Control
                            type="text"
                            id="inputYearSection"
                            value={selectedStudentDetails.sectionYear ?? ""}
                            readOnly
                          />
                        </div>
                        <div className="input-wrap d-flex align-items-center mt-1">
                          <Form.Label
                            htmlFor="inputPhoneNumber"
                            style={{ minWidth: "125px" }}
                          >
                            Phone Number
                          </Form.Label>
                          <Form.Control
                            type="text"
                            id="inputPhoneNumber"
                            value={selectedStudentDetails.phoneNumber ?? ""}
                            readOnly
                          />
                        </div>
                      </div>
                    </div>
                  </fieldset>
                </div>
                <div className="col-lg-6">
                  <fieldset className="border rounded-3 p-3">
                    <legend
                      className="text-uppercase float-none w-auto px-3 fw-bold"
                      style={{ fontSize: "1rem" }}
                    >
                      Offense Details
                    </legend>
                    <div className="container-fluid d-flex">
                      <div className="student-details-container p-2">
                        <div className="row">
                          <div className="input-wrap d-flex align-items-center mt-1">
                            <InputGroup>
                              <Form.Label
                                htmlFor="inputType"
                                style={{ minWidth: "125px" }}
                              >
                                Type
                              </Form.Label>
                              <Form.Control
                                type="text"
                                id="inputType"
                                value={
                                  selectedViolationDetails.violation_type ?? ""
                                }
                                required
                                readOnly
                              />
                              <InputGroup.Text
                                id="basic-addon2"
                                className="bg-primary text-light"
                                style={{ cursor: "pointer" }}
                                onClick={selectViolationDetails}
                              >
                                <FontAwesomeIcon icon={faMagnifyingGlass} />
                              </InputGroup.Text>
                            </InputGroup>
                          </div>
                          <div className="input-wrap d-flex align-items-center mt-1">
                            <Form.Label
                              htmlFor="inputViolationDescript"
                              style={{ minWidth: "125px" }}
                            >
                              Violation
                            </Form.Label>
                            <Form.Control
                              type="text"
                              id="inputViolationDescript"
                              value={
                                selectedViolationDetails.violation_description ??
                                ""
                              }
                              readOnly
                            />
                          </div>
                        </div>
                        <div className="input-wrap d-flex align-items-center mt-1">
                          <Form.Label
                            htmlFor="inputOffense"
                            style={{ minWidth: "125px" }}
                          >
                            Offense
                          </Form.Label>
                          <Form.Control
                            type="text"
                            id="inputOffense"
                            value={
                              selectedViolationDetails.violation_offense ?? ""
                            }
                            readOnly
                          />
                        </div>
                        <div className="input-wrap d-flex align-items-center mt-1">
                          <Form.Label
                            htmlFor="inputSanction"
                            style={{ minWidth: "125px" }}
                          >
                            Sanction
                          </Form.Label>
                          <Form.Control
                            type="text"
                            id="inputSanction"
                            value={
                              selectedViolationDetails.violation_sanction ?? ""
                            }
                            readOnly
                          />
                        </div>
                        <div className="input-wrap d-flex align-items-center mt-1">
                          <Form.Label
                            htmlFor="inputRemarks"
                            style={{ minWidth: "125px" }}
                          >
                            Remarks
                          </Form.Label>
                          <Form.Control
                            type="text"
                            id="inputRemarks"
                            value={remarks ?? ""}
                            onChange={(e) => setRemarks(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </fieldset>
                </div>
              </div>
              <div className="d-flex justify-content-start text-uppercase">
                <Form className="mt-3">
                  <Form.Check
                    onClick={() => {
                      setMakeIncidentReport(!makeIncidentReport);
                      setIsClickedIncidentReport(true);
                    }}
                    type="switch"
                    id="custom-switch"
                    label="Make Incident Report"
                  />
                </Form>
              </div>

              {makeIncidentReport && (
                <div className="container-fluid mt-2">
                  <fieldset className="border rounded-3 p-3">
                    <legend
                      className="text-uppercase float-none w-auto px-3 fw-bold"
                      style={{ fontSize: "1rem" }}
                    >
                      Incident Report
                    </legend>
                    <div className="container-fluid">
                      <div className="row">
                        <div className="col-lg-6">
                          <Form.Group className="mb-3">
                            <Form.Label className="fw-bold">
                              Assigned Staff
                            </Form.Label>
                            <Form.Control
                              type="text"
                              id="reporterRole"
                              className="text-uppercase"
                              value={`${
                                userData.firstName
                              } ${userData.middleName.charAt(0)}. ${
                                userData.lastName
                              } ${userData.suffix ?? ""}`}
                              readOnly
                              disabled
                            />
                          </Form.Group>
                          <Form.Group className="mb-3">
                            <Form.Label className="fw-bold">
                              Reporter Name
                            </Form.Label>
                            <Form.Control
                              type="text"
                              id="assignedReporter"
                              value={reporterName}
                              onChange={(e) => setReporterName(e.target.value)}
                            />
                          </Form.Group>
                          <Form.Group className="mb-1">
                            <Form.Label className="fw-bold">
                              Persons Involved{" "}
                              <span className="fw-light fst-italic">
                                (Use Comma to seperate name)
                              </span>
                            </Form.Label>
                            <Form.Control
                              type="text"
                              id="personsInvolved"
                              value={personInvolved}
                              onChange={(e) =>
                                setPersonInvolved(e.target.value)
                              }
                            />
                          </Form.Group>
                          <Form.Group className="mb-1">
                            <Form.Label className="fw-bold">
                              Place of Incident
                            </Form.Label>
                            <Form.Control
                              type="text"
                              id="placeOfIncident"
                              value={place}
                              onChange={(e) => setPlace(e.target.value)}
                            />
                          </Form.Group>
                        </div>
                        <div className="col-lg-6">
                          <Form.Group className="mb-3">
                            <Form.Label className="fw-bold">Witness</Form.Label>
                            <Form.Control
                              type="text"
                              id="witness"
                              value={witness}
                              onChange={(e) => setWitness(e.target.value)}
                            />
                          </Form.Group>
                          <div className="d-flex align-items-center">
                            <div className="row">
                              <div className="col-lg-6">
                                <div className="input_wrap">
                                  <label
                                    htmlFor="incidentDate"
                                    className="text-start w-100 fw-bold"
                                  >
                                    Date of Incident
                                  </label>
                                  <DatePicker
                                    className="form-control form-control-lg bg-light fs-6"
                                    popperPlacement="top-start"
                                    id="incidentDate"
                                    name="incidentDate"
                                    selected={incidentDate}
                                    onChange={(date) => setIncidentDate(date)}
                                    dateFormat="dd/MM/yyyy"
                                    placeholderText="dd/mm/yyyy"
                                    showYearDropdown
                                    scrollableMonthYearDropdown
                                    maxDate={new Date()}
                                    required
                                  />
                                </div>
                              </div>
                              <div className="col-lg-6">
                                <div className="input_wrap mt-1">
                                  <label
                                    htmlFor="timeOfIncident"
                                    className="text-start w-100 fw-bold"
                                  >
                                    Time of Incident
                                  </label>
                                  <DatePicker
                                    className="form-control form-control-lg bg-light fs-6"
                                    selected={incidentTime}
                                    popperPlacement="top-start"
                                    onChange={(date) => setIncidentTime(date)}
                                    showTimeSelect
                                    showTimeSelectOnly
                                    timeIntervals={15}
                                    timeCaption="Time"
                                    dateFormat="h:mm aa"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          <Form.Group
                            className="mb-1"
                            controlId="exampleForm.ControlTextarea1"
                          >
                            <Form.Label className="fw-bold">
                              Incident Description
                            </Form.Label>
                            <Form.Control
                              value={incidentDescription}
                              onChange={(e) =>
                                setIncidentDescription(e.target.value)
                              }
                              as="textarea"
                              rows={4}
                            />
                          </Form.Group>
                        </div>
                      </div>
                    </div>
                  </fieldset>
                </div>
              )}
              <div className="container-fluid mt-2">
                <fieldset className="border rounded-3 p-3">
                  <legend
                    className="text-uppercase float-none w-auto px-3 fw-bold"
                    style={{ fontSize: "1rem" }}
                  >
                    Student Violation History
                  </legend>
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
                  />
                </fieldset>
              </div>
            </div>
          </Modal.Body>
        </Form>
        <Modal.Footer>
          <div className="container-fluid d-flex justify-content-between">
            <Button
              variant="primary"
              className="text-light"
              onClick={clearInputFields}
            >
              <FontAwesomeIcon icon={faEraser} className="me-1" />
              Clear Form
            </Button>
            <div>
              <Button variant="success" className="me-1" onClick={handleSubmit}>
                Submit{" "}
                {
                  <PulseLoader
                    className="ms-2"
                    color={"#ffffff"}
                    loading={uploading}
                    size={5}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                  />
                }
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  props.onHide();
                  clearInputFields();
                }}
              >
                Close
              </Button>
            </div>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
}
