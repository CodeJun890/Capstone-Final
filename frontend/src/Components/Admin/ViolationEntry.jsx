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
import { AdminContext } from "../../../Context/AdminContext";

import StudentListModal from "./StudentListModal";
import ViolationListModal from "./ViolationListModal";

import format from "date-fns/format";
import profileImg from "../../Assets/upload.jpg";
import { useNavigate } from "react-router-dom";
import { parseISO } from "date-fns";

export default function ViolationEntry({ isToggled }) {
  const navigate = useNavigate();
  const {
    baseUrl,
    userData,
    incidentModalTrigger,
    resolveStudentRecord,
    setResolveStudentRecord,
    recordResolve,
    setRecordResolve,
    incidentRecord,
    setIncidentRecord,
    resolveViolationId,
    setResolveViolationId,
  } = useContext(AdminContext);
  const [perPage, setPerPage] = useState(5);
  const [pending, setPending] = React.useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPageOptions = [5, 10];
  const [filterValue, setFilterValue] = useState("");
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [record, setRecord] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [incidentRecords, setIncidentRecords] = useState([]);
  const [showVerify, setShowVerify] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isNotMatch, setIsNotMatch] = useState(false);
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [isPassCorrect, setIsPassCorrect] = useState(false);
  const [academicYear, setAcademicYear] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [resolving, setResolving] = useState(false);
  const [personInvolved, setPersonInvolved] = useState("");
  const [incidentTime, setIncidentTime] = useState(new Date());
  const [witness, setWitness] = useState("");
  const [place, setPlace] = useState("");

  const [fetchStudentViolationsFlag, setFetchStudentViolationsFlag] =
    useState(false);

  useEffect(() => {
    axios
      .get(baseUrl + "display-all-student-violation")
      .then((res) => {
        if (res.status === 200) {
          const data = res.data.results;
          const unifiedArray = data.map((item) => ({
            ...item.studentInfo,
            ...item.violation,
            academicYear: item.academicYear.academicYear,
          }));
          setRecord(unifiedArray);
          setFilteredRecords(unifiedArray);
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
  }, [fetchStudentViolationsFlag || refresh]);

  const columns = [
    {
      name: "Student Number",
      selector: (row) => row.studentNumber,
      sortable: true,
    },
    {
      name: "Name",
      wrap: true,
      selector: (row) =>
        row.lastName +
          ", " +
          row.firstName +
          " " +
          row.middleName.charAt(0) +
          "." +
          row.suffix ?? "",
      sortable: true,
    },
    {
      name: "Section",
      selector: (row) => row.course + " " + row.sectionYear,
      sortable: true,
    },
    {
      name: "Type",
      selector: (row) => row.violation_type,
      sortable: true,
    },
    {
      name: "Offense",
      selector: (row) => row.violation_offense,
      sortable: true,
    },
    {
      name: "Academic Year",
      selector: (row) => row.academicYear,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="d-flex">
          <div
            className="btn btn-success btn-sm"
            onClick={() =>
              handleShowVerify(row._id, row.student_id, row.report_id)
            }
          >
            Resolve
          </div>
        </div>
      ),
    },
    {
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
                handleDeleteStudentViolation(row._id);
              }
            });
          }}
        >
          <FontAwesomeIcon icon={faTrashAlt} />
        </div>
      ),
    },
  ];

  const handleClose = () => {
    setShowVerify(false);
    setPassword("");
    setConfirmPassword("");
    setIsNotMatch(false);
    setIsPassCorrect(false);
  };
  const handleShowVerify = (violationId, studentId, reportId) => {
    setShowVerify(true);
    studentResolveDisplayInfo(violationId, studentId, reportId);
    setResolveViolationId(violationId);
  };

  const studentResolveDisplayInfo = async (
    violationId,
    studentId,
    reportId
  ) => {
    if (violationId && studentId) {
      try {
        const [
          studentResponse,
          academicYearResponse,
          incidentReportResponse,
          studentViolationResponse,
        ] = await Promise.all([
          axios.get(baseUrl + `students/${studentId}`),
          axios.get(baseUrl + "fetch-academic-year"),
          axios.get(baseUrl + `get-particular-report/${reportId}`),
          axios.get(baseUrl + `list-all-student-violation/${studentId}`),
        ]);

        if (studentResponse.status === 200) {
          setResolveStudentRecord(studentResponse.data.student);
        }

        if (academicYearResponse.status === 200) {
          const openAcademicYears = academicYearResponse.data.acadYear.filter(
            (year) => year.status === "OPEN"
          );
          setAcademicYear(openAcademicYears);
        }

        if (incidentReportResponse.status === 200) {
          setIncidentRecord(incidentReportResponse.data.incidentReport);
        }

        if (studentViolationResponse.status === 200) {
          setRecordResolve(studentViolationResponse.data.studentViolation[0]);
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleDeleteStudentViolation = (id) => {
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

  const ExpandedComponent = ({ data }) => {
    const selectedRecord = record.find((info) => info._id === data._id);
    const selectedIncidentRecord = incidentRecords.find(
      (incident) => incident._id === data.report_id
    );

    return (
      <>
        <div className="container-fluid d-flex flex-column mx-3 py-3 ">
          <div className="row">
            <div className="col-lg-6">
              <div className="lead">VIOLATION OFFENSE</div>
              <div className="violation_wrap">
                <div className="fw-bold">
                  Violation Description:
                  <span className="fw-light ms-3">
                    {selectedRecord.violation_description}
                  </span>
                </div>
              </div>
              <div
                className="violation_wrap text-capitalize"
                style={{ width: "600px" }}
              >
                <div className="fw-bold">
                  Violation Sanction:
                  <span className="fw-light text-danger ms-2">
                    {selectedRecord.violation_sanction}
                  </span>
                </div>
              </div>
              <div className="violation_wrap">
                <div className="fw-bold">
                  Remarks:
                  <span className="fw-light ms-2">
                    {selectedRecord.remarks}
                  </span>
                </div>
              </div>
              <div className="violation_wrap text-capitalize">
                <div className="fw-bold">
                  Violation Submitted:
                  <span className="fw-light ms-2">
                    {format(new Date(selectedRecord.createdAt), "MMMM d, yyyy")}
                  </span>
                </div>
              </div>
            </div>
            {selectedIncidentRecord && (
              <div className="col-lg-6">
                <div className="lead">INCIDENT REPORT</div>
                <div className="violation_wrap">
                  <div className="fw-bold">
                    Reporter Name:
                    <span className="fw-light ms-3">
                      {selectedIncidentRecord.reporter_name}
                    </span>
                  </div>
                </div>
                <div
                  className="violation_wrap text-capitalize"
                  style={{ width: "600px" }}
                >
                  <div className="fw-bold">
                    Assigned Staff:
                    <span className="fw-light ms-2">
                      {selectedIncidentRecord.assigned_staff}
                    </span>
                  </div>
                </div>
                <div className="violation_wrap">
                  <div className="fw-bold">
                    Incident Description:
                    <span className="fw-light ms-2">
                      {selectedIncidentRecord.incident_description}
                    </span>
                  </div>
                </div>
                <div className="violation_wrap text-capitalize">
                  <div className="fw-bold">
                    Incident Date:
                    <span className="fw-light ms-2">
                      {format(
                        new Date(selectedIncidentRecord.incident_date),
                        "MMMM d, yyyy"
                      )}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </>
    );
  };

  const handleVerifySubmit = (e) => {
    e.preventDefault();
    setResolving(true);
    const verifyPassword = {
      password,
      emailAddress: userData.emailAddress,
      violationId: resolveViolationId,
    };
    if (password !== confirmPassword) {
      setIsNotMatch(true);
    } else {
      axios
        .post(baseUrl + "verify-admin-resolve", verifyPassword)
        .then((res) => {
          if (res.status === 200) {
            Swal.fire({
              position: "center",
              icon: "success",
              title: "Success!",
              text: "Student Violation Added Successfully!",
              showConfirmButton: false,
              timer: 2000,
              padding: "3em",
            });
            setRefresh(true);
            setResolving(false);
          } else if (res.status === 201) {
            setIsPassCorrect(true);
            setResolving(false);
          }
        })
        .catch((err) => {
          console.log(err);
          setResolving(false);
        });
    }
  };

  return (
    <>
      <Modal size="xl" show={showVerify} onHide={handleClose} animation={false}>
        <Modal.Header
          closeButton
          className="bg-success text-light fw-bold text-uppercase"
        >
          <Modal.Title>RESOLVE THIS STUDENT VIOLATION</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleVerifySubmit} autoComplete="off">
          <Modal.Body>
            <div className="container-fluid">
              <div className="row">
                <div className="col-lg-6">
                  <div className="h5 text-uppercase fw-bold my-3">
                    Student Details
                  </div>
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
                          ? academicYear.map((year) => year.academicYear)
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
                        value={resolveStudentRecord.studentNumber ?? ""}
                        required
                        readOnly
                      />
                    </InputGroup>
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
                        resolveStudentRecord.firstName +
                          " " +
                          resolveStudentRecord.middleName +
                          " " +
                          resolveStudentRecord.lastName +
                          " " +
                          resolveStudentRecord.suffix ??
                        "" ??
                        ""
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
                      value={resolveStudentRecord.sectionYear ?? ""}
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
                      value={resolveStudentRecord.phoneNumber ?? ""}
                      readOnly
                    />
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="h5 text-uppercase fw-bold my-3">
                    Violation Details
                  </div>
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
                        value={recordResolve.violation_type ?? ""}
                        required
                        readOnly
                      />
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
                      value={recordResolve.violation_description ?? ""}
                      readOnly
                    />
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
                      value={recordResolve.violation_offense ?? ""}
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
                      value={recordResolve.violation_sanction ?? ""}
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
                      value={recordResolve.remarks ?? ""}
                      readOnly
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="h5 text-uppercase fw-bold my-3">
                  Incident Report
                </div>
                <div className="col-lg-6">
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Assigned Staff</Form.Label>
                    <Form.Control
                      type="text"
                      id="reporterRole"
                      className="text-uppercase"
                      value={incidentRecord.assigned_staff ?? ""}
                      readOnly
                      disabled
                    />
                  </Form.Group>
                  <Form.Group className="mb-1">
                    <Form.Label className="fw-bold">Reporter Name</Form.Label>
                    <Form.Control
                      type="text"
                      id="assignedReporter"
                      className="text-capitalize"
                      value={incidentRecord.reporter_name ?? ""}
                      readOnly
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
                      value={incidentRecord.persons_involved ?? ""}
                      readOnly
                    />
                  </Form.Group>
                  <Form.Group className="mb-1">
                    <Form.Label className="fw-bold">
                      Place of Incident
                    </Form.Label>
                    <Form.Control
                      type="text"
                      id="placeOfIncident"
                      value={incidentRecord.place ?? ""}
                      readOnly
                    />
                  </Form.Group>
                </div>
                <div className="col-lg-6">
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Witness</Form.Label>
                    <Form.Control
                      type="text"
                      id="witness"
                      value={incidentRecord.witness ?? ""}
                      readOnly
                    />
                  </Form.Group>

                  <div className="d-flex align-items-center">
                    <div className="row">
                      <div className="col-lg-6">
                        <div className="input_wrap mt-1">
                          <label
                            htmlFor="birthDate"
                            className="text-start w-100 fw-bold"
                          >
                            Incident Date
                          </label>
                          <DatePicker
                            className="form-control form-control-lg bg-light fs-6"
                            popperPlacement="top-start"
                            id="birthDate"
                            name="birthDate"
                            dateFormat="dd/MM/yyyy"
                            placeholderText="dd/mm/yyyy"
                            showYearDropdown
                            scrollableMonthYearDropdown
                            value={
                              incidentRecord.incident_date
                                ? format(
                                    parseISO(incidentRecord.incident_date),
                                    "dd/MM/yyyy"
                                  )
                                : new Date()
                            }
                            required
                            readOnly
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
                            selected={
                              incidentRecord.time
                                ? parseISO(incidentRecord.time)
                                : incidentTime
                            }
                            popperPlacement="top-start"
                            showTimeSelect
                            value={
                              incidentRecord.time
                                ? format(
                                    parseISO(incidentRecord.time),
                                    "dd/MM/yyyy"
                                  )
                                : new Date()
                            }
                            showTimeSelectOnly
                            timeIntervals={15}
                            timeCaption="Time"
                            dateFormat="h:mm aa"
                            readOnly
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <Form.Group
                    className="mb-3"
                    controlId="exampleForm.ControlTextarea1"
                  >
                    <Form.Label className="fw-bold">
                      Incident Description
                    </Form.Label>
                    <Form.Control
                      value={incidentRecord.incident_description ?? ""}
                      as="textarea"
                      rows={4}
                      readOnly
                    />
                  </Form.Group>
                </div>
              </div>
            </div>
            <div className="container-fluid">
              <h6 className="text-center text-uppercase alert alert-warning">
                For security reasons, please verify your password before
                proceeding.
              </h6>
              {isPassCorrect ? (
                <p className="alert alert-danger text-danger isMatchText text-center">
                  Password is incorrect. Please check your input
                </p>
              ) : null}
              {isNotMatch && (
                <p className="alert alert-danger mx-md-5 mx-2 text-center">
                  Passwords don't match. Double-check and confirm your password
                  entry.
                </p>
              )}

              <div className="row">
                <div className="col-lg-6">
                  <div className="input_wrap">
                    <label htmlFor="password" className="fw-bold">
                      Password
                    </label>
                    <InputGroup>
                      <input
                        type={showPassword1 ? "text" : "password"}
                        className="form-control form-control-lg bg-light fs-6"
                        placeholder="Enter your password"
                        id="password"
                        name="password"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          setIsNotMatch(false);
                          setIsPassCorrect(false);
                        }}
                        required
                      />
                      <Button
                        onClick={() => setShowPassword1(!showPassword1)}
                        variant="secondary"
                      >
                        {showPassword1 ? (
                          <FontAwesomeIcon
                            icon={faEyeSlash}
                            className="fa-solid fa-eye-slash showPassIcon"
                          />
                        ) : (
                          <FontAwesomeIcon
                            icon={faEye}
                            className="fa-solid fa-eye showPassIcon"
                          />
                        )}
                      </Button>
                    </InputGroup>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="input_wrap">
                    <label htmlFor="confirmPassword" className="fw-bold">
                      Confirm Password
                    </label>
                    <InputGroup>
                      <input
                        type={showPassword2 ? "text" : "password"}
                        className={`form-control form-control-lg bg-light fs-6 ${
                          isNotMatch ? "border-danger " : ""
                        }`}
                        placeholder="Confirm your password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                          setIsNotMatch(false);
                          setIsPassCorrect(false);
                        }}
                        required
                      />
                      <Button
                        onClick={() => setShowPassword2(!showPassword2)}
                        variant="secondary"
                      >
                        {showPassword2 ? (
                          <FontAwesomeIcon
                            icon={faEyeSlash}
                            className="fa-solid fa-eye-slash showPassIcon"
                          />
                        ) : (
                          <FontAwesomeIcon
                            icon={faEye}
                            className="fa-solid fa-eye showPassIcon"
                          />
                        )}
                      </Button>
                    </InputGroup>
                  </div>
                </div>
              </div>
            </div>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button type="submit" variant="primary">
              Proceed{" "}
              {
                <PulseLoader
                  className="ms-2"
                  color={"#ffffff"}
                  loading={resolving}
                  size={5}
                  aria-label="Loading Spinner"
                  data-testid="loader"
                />
              }
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
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
            Add Student Violation
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
              Add New
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
          title="Student Violation List"
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
          expandableRows
          expandableRowsComponent={ExpandedComponent}
          fixedHeaderScrollHeight="300px"
        />
      </div>
      <CreateViolationEntry
        show={modalShow || incidentModalTrigger}
        setFetchStudentViolationsFlag={setFetchStudentViolationsFlag}
        onHide={() => setModalShow(!modalShow)}
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
    currentViolationIncidentId,
    currentStudentIncidentId,
    setIncidentModalTrigger,
    currentEvidenceFile,
    setCurrentEvidenceFile,
    incident,
    setIncident,
    currentId,
    setCurrentId,
    setCurrentViolationIncidentId,
    setCurrentStudentIncidentId,
  } = useContext(AdminContext);

  const [perPage, setPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPageOptions = [5, 10, 20, 30];
  const [filterValue, setFilterValue] = useState("");
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [record, setRecord] = useState([]);
  const [showStudentListModal, setShowStudentListModal] = useState(false);
  const [showViolationListModal, setShowViolationListModal] = useState(false);
  const current = currentStudent || currentViolationList;
  const currentID = currentStudentIncidentId || currentViolationIncidentId;
  const [incidentDate, setIncidentDate] = useState(new Date());
  const [incidentDescription, setIncidentDescription] = useState("N/A");
  const [reporterName, setReporterName] = useState("N/A");
  const [remarks, setRemarks] = useState("");
  const [isExist, setIsExist] = useState(false);
  const [pending, setPending] = useState(false);
  const [violationInput, setViolationInput] = useState(false);
  const [makeIncidentReport, setMakeIncidentReport] = useState(false);
  const [uploading, setIsUploading] = useState(false);
  const [personInvolved, setPersonInvolved] = useState("");
  const [incidentTime, setIncidentTime] = useState(new Date());
  const [witness, setWitness] = useState("");
  const [place, setPlace] = useState("");
  const [file, setFile] = useState(null);
  const navigation = useNavigate();

  const inputRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      if (currentStudent || currentStudentIncidentId) {
        try {
          const [
            studentResponse,
            academicYearResponse,
            studentViolationResponse,
          ] = await Promise.all([
            axios.get(
              baseUrl + `students/${currentStudent || currentStudentIncidentId}`
            ),
            axios.get(baseUrl + "fetch-academic-year"),
            axios.get(
              baseUrl +
                `list-all-student-violation/${
                  currentStudent || currentStudentIncidentId
                }`
            ),
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
  }, [currentStudent || currentStudentIncidentId]);

  useEffect(() => {
    if (currentViolationList || currentViolationIncidentId) {
      axios
        .get(
          baseUrl +
            `violation-list/${
              currentViolationList || currentViolationIncidentId
            }`
        )
        .then((res) => {
          if (res.status === 200) {
            setSelectedViolationDetails(res.data.violationList);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [currentViolationList || currentViolationIncidentId]);

  useEffect(() => {
    if (currentEvidenceFile) {
      axios
        .get(baseUrl + `get-particular-incident-report/${currentEvidenceFile}`)
        .then((res) => {
          setIncident(res.data.incidentReport);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [currentEvidenceFile]);
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

  const handleFileChange = (e) => {
    setFile(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsUploading(true);
    if (
      (currentStudent && currentViolationList) ||
      (currentStudentIncidentId && currentViolationIncidentId)
    ) {
      const formDataObject = new FormData();
      if (file !== null) {
        for (let i = 0; i < file.length; i++) {
          formDataObject.append("files", file[i]);
        }
      }
      formDataObject.append("student_id", selectedStudentDetails._id);
      formDataObject.append(
        "student_num",
        selectedStudentDetails.studentNumber
      );
      formDataObject.append(
        "fullName",
        selectedStudentDetails.firstName + " " + selectedStudentDetails.lastName
      );
      formDataObject.append(
        "violation_type",
        selectedViolationDetails.violation_type
      );
      formDataObject.append(
        "violation_description",
        selectedViolationDetails.violation_description
      );
      formDataObject.append(
        "violation_offense",
        selectedViolationDetails.violation_offense
      );
      formDataObject.append(
        "violation_sanction",
        selectedViolationDetails.violation_sanction
      );
      formDataObject.append("currentId", currentEvidenceFile);
      if (currentID) {
        formDataObject.append("reporter_name", incident.reporter_name);
        formDataObject.append("incident_date", incident.incident_date);
        formDataObject.append(
          "incident_description",
          incident.incident_description
        );
        formDataObject.append("assigned_staff", incident.assigned_staff);
        formDataObject.append("witness", incident.witness);
        formDataObject.append("place", incident.place);
        formDataObject.append("persons_involved", incident.persons_involved);
        formDataObject.append("time", incident.time);
        formDataObject.append("makeIncidentReport", true);
      } else {
        formDataObject.append("reporter_name", reporterName);
        formDataObject.append("incident_date", incidentDate);
        formDataObject.append("incident_description", incidentDescription);
        formDataObject.append(
          "assigned_staff",
          userData.firstName +
            " " +
            userData.middleName.charAt(0) +
            " " +
            userData.lastName +
            " " +
            userData.suffix ?? ""
        );
        formDataObject.append("witness", witness);
        formDataObject.append("place", place);
        formDataObject.append("persons_involved", personInvolved);
        formDataObject.append("time", incidentTime);
        formDataObject.append("makeIncidentReport", makeIncidentReport);
      }
      formDataObject.append("remarks", remarks);
      // for (let i = 0; i < file.length; i++) {
      //   formDataObject.append("files", file[i]);
      // }

      if (current || currentID) {
        axios
          .post(baseUrl + "upload-files-and-make-violation", formDataObject)
          .then(async (res) => {
            if (res.status === 200) {
              setRecord((prevRecords) => [
                ...prevRecords,
                res.data.studentViolation,
              ]);
              setFilteredRecords((prevFilteredRecords) => [
                ...prevFilteredRecords,
                res.data.studentViolation,
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
              if (currentID) {
                navigation("/subAdmin-reports");
                setCurrentStudentIncidentId("");
                setCurrentViolationIncidentId("");
                setIncidentModalTrigger("");
                setCurrentEvidenceFile("");
                setCurrentId("");
                clearInputFields();
              }
            } else {
              setIsExist(true);
              setIsUploading(false);
            }
          })
          .catch((err) => {
            console.log(err);
            setIsUploading(false);
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
    if (currentStudentIncidentId && currentViolationIncidentId) {
      setIncidentModalTrigger(false);
      setIsUploading(false);
      setIncident([]);
      setIncidentModalTrigger(false);
      setCurrentEvidenceFile("");
      setCurrentId("");
    }
    setFile(null);
    setIsUploading(false);
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
            Add Student Violation
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
                Provide necessary information to create student violation
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
              <div className="d-flex justify-content-between text-uppercase">
                <div className="mt-3">
                  <Form.Check
                    onClick={() => setMakeIncidentReport(!makeIncidentReport)}
                    type="switch"
                    id="custom-switch"
                    label="Make Incident Report"
                    checked={makeIncidentReport || currentEvidenceFile}
                  />
                </div>
                <div className="d-flex justify-content-end align-items-center mt-3">
                  <Form.Label className="me-3 fw-bold">Attach Files</Form.Label>
                  <Form.Group controlId="formFileMultiple">
                    <Form.Control
                      type="file"
                      multiple
                      onChange={handleFileChange}
                    />
                  </Form.Group>
                </div>
              </div>
              {makeIncidentReport || currentEvidenceFile ? (
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
                              value={
                                incident.assigned_staff ??
                                userData.firstName +
                                  " " +
                                  userData.middleName.charAt(0) +
                                  ". " +
                                  userData.lastName +
                                  userData.suffix ??
                                ""
                              }
                              readOnly
                              disabled
                            />
                          </Form.Group>
                          <Form.Group className="mb-1">
                            <Form.Label className="fw-bold">
                              Reporter Name
                            </Form.Label>
                            <Form.Control
                              type="text"
                              id="assignedReporter"
                              className="text-capitalize"
                              value={incident.reporter_name ?? reporterName}
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
                              value={
                                incident.persons_involved ?? personInvolved
                              }
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
                              value={incident.place ?? place}
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
                              value={incident.witness ?? witness}
                              onChange={(e) => setWitness(e.target.value)}
                            />
                          </Form.Group>
                          <div className="d-flex align-items-center">
                            <div className="row">
                              <div className="col-lg-6">
                                <div className="input_wrap mt-1">
                                  <label
                                    htmlFor="birthDate"
                                    className="text-start w-100 fw-bold"
                                  >
                                    Date of Incident
                                  </label>
                                  <DatePicker
                                    className="form-control form-control-lg bg-light fs-6"
                                    popperPlacement="top-start"
                                    id="birthDate"
                                    name="birthDate"
                                    selected={
                                      incident.incident_date
                                        ? parseISO(incident.incident_date)
                                        : incidentDate
                                    }
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
                                    selected={
                                      incident.time
                                        ? parseISO(incident.time)
                                        : incidentTime
                                    }
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
                            className="mb-3"
                            controlId="exampleForm.ControlTextarea1"
                          >
                            <Form.Label className="fw-bold">
                              Incident Description
                            </Form.Label>
                            <Form.Control
                              value={
                                incident.incident_description ??
                                incidentDescription
                              }
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
              ) : null}
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
