import React from "react";
import axios from "axios";
import CvsuLogo from "../../Assets/cvsu-icon.webp";
import profileImg from "../../Assets/upload.jpg";
import { Link } from "react-router-dom";
import Records from "./Records";
import "../../styles.css";
import PulseLoader from "react-spinners/PulseLoader";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDoubleRight,
  faThLarge,
  faExclamationTriangle,
  faClipboardCheck,
  faCalendarDays,
  faSignOut,
  faMoon,
  faSun,
  faPenToSquare,
  faListCheck,
  faClipboardList,
  faUserGear,
  faUserGraduate,
  faFlag,
  faBookOpen,
  faCircleCheck,
  faStamp,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";

import Offcanvas from "react-bootstrap/Offcanvas";

import { useState, useContext, useRef, useEffect } from "react";
import StudentListModal from "./StudentListModal";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Swal from "sweetalert2";
import Button from "react-bootstrap/Button";
import GraduateGoodMoral from "./ExportFiles/GraduateGoodMoral";
import ScholarshipGoodMoral from "./ExportFiles/ScholarshipGoodMoral";
import TransferGoodMoral from "./ExportFiles/TransfereeGoodMoral";
import { AdminContext } from "../../../Context/AdminContext";

export default function AdminNavbar({ setIsToggled, toggleAdminIsLoggedOut }) {
  const [show, setShow] = useState(false);
  const [showRecord, setShowRecord] = useState(false);

  const { userData, setUserData, baseUrl, modalShow, setModalShow } =
    useContext(AdminContext);

  if (localStorage.getItem("theme") === null) {
    localStorage.setItem("theme", "false");
  }

  const themeValue = localStorage.getItem("theme");
  const initialState = themeValue === "true";

  const [isDarkMode, setIsDarkMode] = useState(initialState);

  const inputRef = useRef(null);
  // UPLOAD PROFILE IMAGE
  const handleImgClick = () => {
    inputRef.current.click();
  };
  const handleImgChange = (event) => {
    const file = event.target.files[0];
    displayImage(file);
  };
  const displayImage = (file) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target.result;

      img.onload = () => {
        // Resize the image to desired dimensions
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const maxWidth = 300; // Set your desired width
        const maxHeight = 300; // Set your desired height

        // Calculate the new dimensions
        let newWidth = img.width;
        let newHeight = img.height;

        if (img.width > maxWidth) {
          newWidth = maxWidth;
          newHeight = (img.height * maxWidth) / img.width;
        }

        if (newHeight > maxHeight) {
          newHeight = maxHeight;
          newWidth = (img.width * maxHeight) / img.height;
        }

        // Set canvas dimensions to the resized image
        canvas.width = newWidth;
        canvas.height = newHeight;

        // Draw the resized image on the canvas
        ctx.drawImage(img, 0, 0, newWidth, newHeight);

        // Get the data URL of the resized image
        const resizedImage = canvas.toDataURL("image/jpeg");

        // Set the resized image in state
        setUserData((prevUserData) => ({
          ...prevUserData,
          profileImage: resizedImage,
        }));
        const updatedData = {
          profileImage: resizedImage,
        };
        const userId = userData._id;
        axios
          .patch(`${baseUrl}admin-update/${userId}`, updatedData)
          .then((res) => {
            Swal.fire({
              position: "center",
              icon: "success",
              title: "Congratulations!",
              text: "Profile Updated successfully!.",
              showConfirmButton: false,
              timer: 1000,
              padding: "3em",
            });
          })
          .catch((err) => {
            console.log(err);
          });
      };
    };

    reader.readAsDataURL(file);
  };

  const handleClose = () => {
    setShow(false);
  };
  const handleShow = () => setShow(true);
  const [isToggle, setIsToggle] = useState(initialState);
  const [isClose, setIsClose] = useState(null);

  const toggleDarkMode = () => {
    setIsDarkMode((themeMode) => {
      const newThemeMode = !themeMode;
      localStorage.setItem("theme", newThemeMode ? "true" : "false");
      return newThemeMode;
    });
    setIsToggle(!isToggle);
    setIsToggled(!isToggle);
  };

  const toggleHide = () => setIsClose(() => !isClose);

  const showRecordModal = () => {
    setShowRecord(true);
  };

  return (
    <>
      {showRecord ? (
        <Records showRecord={showRecord} setShowRecord={setShowRecord} />
      ) : null}
      {/*---- Topbar -----*/}
      <nav
        className={`navbar navbar-expand-lg navbar-light bg-light topbar ${
          isToggle ? "bg-dark navbar-dark" : ""
        }`}
        style={{ display: "none" }}
      >
        <div className="container-fluid ">
          <Link
            to="/admin"
            style={{ textDecoration: "none", color: "#000000" }}
          >
            <div className="logo-cont">
              <img
                src={CvsuLogo}
                alt="cvsu logo"
                style={{ maxWidth: "50px", height: "auto" }}
                className="me-2"
              />
              <div className="h5 fw-bold text-upper mt-2" id="system-name-nav">
                Discipline Recommender
              </div>
            </div>
          </Link>
          <button
            className="navbar-toggler "
            type="button"
            onClick={handleShow}
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <Offcanvas
            show={show}
            onHide={handleClose}
            className={`canvas ${isToggle ? "bg-dark text-light" : ""}`}
          >
            <div className="cvsu-logo bg-success text-light">
              <img
                src={CvsuLogo}
                className="ms-md-3 ms-0"
                style={{ maxWidth: "50px", height: "auto" }}
                alt="Cvsu Logo"
              />

              <p className="my-auto fw-bold ms-2 text-uppercase text-center cvsu-text">
                Discipline Recommender
              </p>
              <Offcanvas.Header closeButton></Offcanvas.Header>
            </div>
            <header className="topbar-header mt-3">
              <div className="profile-image mx-auto">
                <span className="image position-relative">
                  <img
                    src={
                      userData.profileImage ? userData.profileImage : profileImg
                    }
                    alt="Profile Image"
                    className="shadow"
                  />
                  <div
                    className="rounded px-1 bg-success text-light position-absolute"
                    id="edit-profile"
                    style={{
                      top: "-1.75rem",
                      left: "4.75rem",
                      fontSize: "0.7rem",
                      cursor: "pointer",
                    }}
                    onClick={handleImgClick}
                  >
                    <input
                      type="file"
                      ref={inputRef}
                      style={{ display: "none" }}
                      onChange={handleImgChange}
                    />
                    <FontAwesomeIcon icon={faPenToSquare} />
                  </div>
                </span>
              </div>

              <div className="text text-header mt-3">
                <span className="name h3 fw-bold">
                  {userData.firstName +
                    " " +
                    (userData.middleName
                      ? userData.middleName.charAt(0) + ". "
                      : "") +
                    userData.lastName}
                </span>
              </div>
            </header>

            <Offcanvas.Body>
              <div
                className={`menu-bar ${isToggle ? "dark" : ""}`}
                style={{ maxHeight: "100vh", overflowY: "auto" }}
              >
                <div className="menu">
                  <ul className="menu-links" style={{ padding: "0" }}>
                    <li className="nav-links">
                      <Link to="/admin-dashboard">
                        <FontAwesomeIcon icon={faThLarge} className="icons" />
                        <span className="text-link">Dashboard</span>
                      </Link>
                    </li>
                    <li className="nav-links">
                      <Link to="/subAdmin-reports">
                        <FontAwesomeIcon icon={faFlag} className="icons" />
                        <span className="text-link">Sub-Admin Reports</span>
                      </Link>
                    </li>
                    <li className="nav-links">
                      <Link to="/student-request">
                        <FontAwesomeIcon icon={faStamp} className="icons" />
                        <span className="text-link">Good Moral Requests</span>
                      </Link>
                    </li>
                    <li className="nav-links">
                      <Link to="/manage-students">
                        <FontAwesomeIcon
                          icon={faUserGraduate}
                          className="icons"
                        />
                        <span className="text-link">Manage Students</span>
                      </Link>
                    </li>
                    <li className="nav-links">
                      <Link to="/violation-entry">
                        <FontAwesomeIcon
                          icon={faExclamationTriangle}
                          className="icons"
                        />
                        <span className="text-link">Student Violation</span>
                      </Link>
                    </li>
                    <li className="nav-links">
                      <Link to="/manage-violations">
                        <FontAwesomeIcon icon={faListCheck} className="icons" />
                        <span className="text-link">Manage Violation</span>
                      </Link>
                    </li>
                    <li className="nav-links">
                      <Link to="/manage-program">
                        <FontAwesomeIcon
                          icon={faClipboardList}
                          className="icons"
                        />
                        <span className="text-link">Manage Program</span>
                      </Link>
                    </li>
                    <li className="nav-links">
                      <Link to="/academic-year">
                        <FontAwesomeIcon
                          icon={faCalendarDays}
                          className="icons"
                        />
                        <span className="text-link">Manage Academic Year</span>
                      </Link>
                    </li>
                    <li className="nav-links">
                      <Link onClick={showRecordModal}>
                        <FontAwesomeIcon
                          icon={faClipboardCheck}
                          className="icons"
                        />
                        <span className="text-link">
                          Student Records & Report
                        </span>
                      </Link>
                    </li>
                    <li className="nav-links">
                      <Link onClick={() => setModalShow(true)}>
                        <FontAwesomeIcon
                          icon={faCircleCheck}
                          className="icons"
                        />
                        <span className="text-link">Generate Good Moral</span>
                      </Link>
                    </li>
                    <li className="nav-links">
                      <Link to="/user-management">
                        <FontAwesomeIcon icon={faUserGear} className="icons" />
                        <span className="text-link">User Management</span>
                      </Link>
                    </li>
                  </ul>
                </div>
                <div className="bottom-content menu-links">
                  <li className="mode">
                    <div className="moon-sun">
                      <FontAwesomeIcon icon={faMoon} className="icons i moon" />
                      <FontAwesomeIcon icon={faSun} className="icons i sun" />
                    </div>
                    <div className="mode-text text-link">Dark Mode</div>
                    <div className={`toggle-switch ${isToggle ? "dark" : ""}`}>
                      <span onClick={toggleDarkMode} className="switch"></span>
                    </div>
                  </li>
                </div>
              </div>
            </Offcanvas.Body>
          </Offcanvas>
        </div>
      </nav>
      {/*---- Sidebar -----*/}
      <nav
        className={`sidebar ${isClose ? "close" : ""} ${
          isToggle ? "dark" : ""
        }`}
      >
        <div className="cvsu-logo text-light">
          <img
            src={CvsuLogo}
            className="ms-md-3 ms-0"
            style={{ maxWidth: "50px", height: "auto" }}
            alt="Cvsu Logo"
          />

          <p className="my-auto fw-bold ms-2 text-uppercase cvsu-text">
            Discipline Recommender System
          </p>
        </div>
        <header>
          <div className="profile-image">
            <span className="image position-relative">
              <img
                src={userData.profileImage ? userData.profileImage : profileImg}
                alt="Profile Image"
                className="shadow"
              />
              <div
                className="rounded px-1 bg-success text-light position-absolute"
                id="edit-profile"
                style={{
                  top: "0.5rem",
                  left: "4.75rem",
                  fontSize: "0.7rem",
                  cursor: "pointer",
                }}
                onClick={handleImgClick}
              >
                <input
                  type="file"
                  ref={inputRef}
                  style={{ display: "none" }}
                  onChange={handleImgChange}
                />
                <FontAwesomeIcon icon={faPenToSquare} />
              </div>
            </span>
          </div>

          <div className="text text-header mt-3">
            <span className="name h5 fw-bold">
              {userData.firstName +
                " " +
                (userData.middleName
                  ? userData.middleName.charAt(0) + ". "
                  : "") +
                userData.lastName}
            </span>
          </div>

          <div className="toggleSidebar " onClick={toggleHide}>
            <FontAwesomeIcon
              icon={faAngleDoubleRight}
              alt="Toggle Icon"
              id="double-right"
            />
          </div>
        </header>

        <div className="menu-bar">
          <div className="menu">
            <ul className="menu-links" style={{ padding: "0" }}>
              <li className="nav-links">
                <Link to="/admin-dashboard">
                  <FontAwesomeIcon icon={faThLarge} className="icons" />
                  <span className="text-link">Dashboard</span>
                </Link>
              </li>
              <li className="nav-links">
                <Link to="/subAdmin-reports">
                  <FontAwesomeIcon icon={faBookOpen} className="icons" />
                  <span className="text-link">Sub-Admin Reports</span>
                </Link>
              </li>
              <li className="nav-links">
                <Link to="/student-request">
                  <FontAwesomeIcon icon={faStamp} className="icons" />
                  <span className="text-link">Good Moral Requests</span>
                </Link>
              </li>
              <li className="nav-links">
                <Link to="/manage-students">
                  <FontAwesomeIcon icon={faUserGraduate} className="icons" />
                  <span className="text-link">Manage Students</span>
                </Link>
              </li>
              <li className="nav-links">
                <Link to="/violation-entry">
                  <FontAwesomeIcon
                    icon={faExclamationTriangle}
                    className="icons"
                  />
                  <span className="text-link">Student Violation</span>
                </Link>
              </li>
              <li className="nav-links">
                <Link to="/manage-violations">
                  <FontAwesomeIcon icon={faListCheck} className="icons" />
                  <span className="text-link">Manage Violation</span>
                </Link>
              </li>

              <li className="nav-links">
                <Link to="/manage-program">
                  <FontAwesomeIcon icon={faClipboardList} className="icons" />
                  <span className="text-link">Manage Program</span>
                </Link>
              </li>
              <li className="nav-links">
                <Link to="/academic-year">
                  <FontAwesomeIcon icon={faCalendarDays} className="icons" />
                  <span className="text-link">Manage Academic Year</span>
                </Link>
              </li>
              <li className="nav-links">
                <Link onClick={showRecordModal}>
                  <FontAwesomeIcon icon={faClipboardCheck} className="icons" />
                  <span className="text-link">Student Records & Report</span>
                </Link>
              </li>
              <li className="nav-links">
                <Link onClick={() => setModalShow(true)}>
                  <FontAwesomeIcon icon={faCircleCheck} className="icons" />
                  <span className="text-link">Generate Good Moral</span>
                </Link>
              </li>
              <li className="nav-links">
                <Link to="/user-management">
                  <FontAwesomeIcon icon={faUserGear} className="icons" />
                  <span className="text-link">User Management</span>
                </Link>
              </li>
            </ul>
          </div>
          <ul className="bottom-content menu-links" style={{ padding: "0" }}>
            <li className="mode">
              <div className="moon-sun">
                <FontAwesomeIcon icon={faMoon} className="icons i moon" />
                <FontAwesomeIcon icon={faSun} className="icons i sun" />
              </div>
              <div className="mode-text text-link">Dark Mode</div>
              <div className="toggle-switch">
                <span onClick={toggleDarkMode} className="switch"></span>
              </div>
            </li>
          </ul>
        </div>
      </nav>
      <GenerateGoodMoral show={modalShow} onHide={() => setModalShow(false)} />
    </>
  );
}

function GenerateGoodMoral(props) {
  const {
    baseUrl,
    currentStudent,
    setSelectedStudentDetails,
    selectedStudentDetails,
  } = useContext(AdminContext);
  const [isPickedGraduate, setIsPickedGraduate] = useState(false);
  const [isPickedScholarship, setIsPickedScholarship] = useState(false);
  const [isPickedTransfer, setIsPickedTransfer] = useState(false);
  const [isDownloadGraduate, setIsDownloadGraduate] = useState(false);
  const [isDownloadScholarship, setIsDownloadScholarship] = useState(false);
  const [isDownloadTransfer, setIsDownloadTransfer] = useState(false);
  const [date, setDate] = useState("");
  const [type, setType] = useState("");
  const [firstname, setFirstname] = useState("");
  const [middlename, setMiddlename] = useState("");
  const [lastname, setLastname] = useState("");
  const [semester, setSemester] = useState("");
  const [schoolYear, setSchoolYear] = useState("");
  const [generating, setGenerating] = useState(false);
  const [gender, setGender] = useState("");
  const [showStudentListModal, setShowStudentListModal] = useState(false);

  useEffect(() => {
    if (currentStudent) {
      axios
        .get(baseUrl + `students/${currentStudent}`)
        .then((res) => {
          if (res.status === 200) {
            setSelectedStudentDetails(res.data.student);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [currentStudent]);

  const handleType = (e) => {
    const data = e.target.value;
    switch (data) {
      case "graduate":
        setIsPickedGraduate(true);
        setIsPickedScholarship(false);
        setIsPickedTransfer(false);
        clearFields();
        break;
      case "scholarship":
        setIsPickedGraduate(false);
        setIsPickedScholarship(true);
        setIsPickedTransfer(false);
        clearFields();
        break;
      case "transfer":
        setIsPickedGraduate(false);
        setIsPickedScholarship(false);
        setIsPickedTransfer(true);
        clearFields();
        break;
      default:
        setIsPickedGraduate(false);
        setIsPickedScholarship(false);
        setIsPickedTransfer(false);
    }
    setType(data);
  };

  const handleGenerateGoodMoral = (e) => {
    e.preventDefault();
    setGenerating(true);
    if (isPickedGraduate) {
      setIsDownloadGraduate(true);
    } else if (isPickedScholarship) {
      setIsDownloadScholarship(true);
    } else if (isPickedTransfer) {
      setIsDownloadTransfer(true);
    }
  };

  const clearFields = () => {
    setDate("");
    setType("");
    setFirstname("");
    setMiddlename("");
    setLastname("");
    setSemester("");
    setSchoolYear("");
    setIsDownloadGraduate(false);
    setIsDownloadScholarship(false);
    setIsDownloadTransfer(false);
    setGenerating(false);
  };

  const selectStudentDetails = () => {
    setShowStudentListModal(true);
  };

  return (
    <>
      {showStudentListModal ? (
        <StudentListModal
          showStudentListModal={showStudentListModal}
          setShowStudentListModal={setShowStudentListModal}
        />
      ) : null}
      <Modal
        {...props}
        size="xl"
        aria-labelledby="contained-modal-title-vcenter"
        top="true"
        backdrop="static"
        onHide={() => {
          props.onHide();
          clearFields();
        }}
      >
        <Modal.Header className="bg-success" closeButton>
          <Modal.Title
            id="contained-modal-title-vcenter"
            className="fw-bold text-light"
          >
            GENERATE GOOD MORAL
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleGenerateGoodMoral}>
          <Modal.Body>
            <div className="container-fluid">
              <div className="h4 alert alert-success text-uppercase fw-bold text-center">
                Fill all the information
              </div>
              <div className="row justify-content-center align-items-center">
                <div className="col-lg-4 ">
                  <Form.Group>
                    <Form.Label className="fw-bold" htmlFor="typeGoodmoral">
                      Type of Good Moral
                    </Form.Label>
                    <Form.Select
                      id="typeGoodmoral"
                      aria-label="Default select example"
                      value={type}
                      onChange={handleType}
                      required
                    >
                      <option value="" hidden>
                        Specify Type
                      </option>
                      <option value="graduate">Graduate</option>
                      <option value="scholarship">Scholarship</option>
                      <option value="transfer">Transfer</option>
                    </Form.Select>
                  </Form.Group>
                </div>
                <div className="col-lg-4 text-end text-md-start">
                  <div
                    className="btn btn-primary mt-4"
                    onClick={selectStudentDetails}
                  >
                    <FontAwesomeIcon
                      icon={faMagnifyingGlass}
                      className="me-2"
                    />
                    Search Student
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-6 mt-2">
                  {isPickedScholarship && (
                    <>
                      <Form.Group>
                        <Form.Label className="fw-bold" htmlFor="gender">
                          Gender
                        </Form.Label>
                        <Form.Select
                          id="gender"
                          aria-label="Default select example"
                          value={selectedStudentDetails.gender ?? ""}
                          onChange={(e) => setGender(e.target.value)}
                          required
                        >
                          <option value="" hidden>
                            {selectedStudentDetails.gender ?? ""}
                          </option>
                          <option value="MALE">MALE</option>
                          <option value="FEMALE">FEMALE</option>
                        </Form.Select>
                      </Form.Group>
                      <Form.Group className="mt-1" controlId="firstname">
                        <Form.Label className="fw-bold">Firstname</Form.Label>
                        <Form.Control
                          value={selectedStudentDetails.firstName ?? ""}
                          onChange={(e) => setFirstname(e.target.value)}
                          required
                        />
                      </Form.Group>
                      <Form.Group className="mt-1" controlId="middlename">
                        <Form.Label className="fw-bold">Middlename</Form.Label>
                        <Form.Control
                          value={selectedStudentDetails.middleName ?? ""}
                          onChange={(e) => setMiddlename(e.target.value)}
                        />
                      </Form.Group>
                    </>
                  )}
                  {isPickedGraduate && (
                    <>
                      <Form.Group>
                        <Form.Label className="fw-bold" htmlFor="gender">
                          Gender
                        </Form.Label>
                        <Form.Select
                          id="gender"
                          aria-label="Default select example"
                          value={selectedStudentDetails.gender ?? ""}
                          onChange={(e) => setGender(e.target.value)}
                          required
                        >
                          <option value="" hidden>
                            Select Gender
                          </option>
                          <option value="MALE">MALE</option>
                          <option value="FEMALE">FEMALE</option>
                        </Form.Select>
                      </Form.Group>
                      <Form.Group className="mt-1" controlId="firstname">
                        <Form.Label className="fw-bold">Firstname</Form.Label>
                        <Form.Control
                          value={selectedStudentDetails.firstName ?? ""}
                          onChange={(e) => setFirstname(e.target.value)}
                          required
                        />
                      </Form.Group>
                      <Form.Group className="mt-1" controlId="middlename">
                        <Form.Label className="fw-bold">Middlename</Form.Label>
                        <Form.Control
                          value={selectedStudentDetails.middleName ?? ""}
                          onChange={(e) => setMiddlename(e.target.value)}
                        />
                      </Form.Group>
                    </>
                  )}
                  {isPickedTransfer && (
                    <>
                      <Form.Group>
                        <Form.Label className="fw-bold" htmlFor="typeGoodmoral">
                          Gender
                        </Form.Label>
                        <Form.Select
                          id="typeGoodmoral"
                          aria-label="Default select example"
                          value={selectedStudentDetails.gender ?? ""}
                          onChange={(e) => setGender(e.target.value)}
                          required
                        >
                          <option value="" hidden>
                            Select Gender
                          </option>
                          <option value="MALE">MALE</option>
                          <option value="FEMALE">FEMALE</option>
                        </Form.Select>
                      </Form.Group>
                      <Form.Group className="mt-1" controlId="firstname">
                        <Form.Label className="fw-bold">Firstname</Form.Label>
                        <Form.Control
                          value={selectedStudentDetails.firstName ?? ""}
                          onChange={(e) => setFirstname(e.target.value)}
                          required
                        />
                      </Form.Group>
                      <Form.Group className="mt-1" controlId="middlename">
                        <Form.Label className="fw-bold">Middlename</Form.Label>
                        <Form.Control
                          value={selectedStudentDetails.middleName ?? ""}
                          onChange={(e) => setMiddlename(e.target.value)}
                        />
                      </Form.Group>
                    </>
                  )}
                </div>
                <div className="col-lg-6 mt-2">
                  {isPickedGraduate && (
                    <>
                      <Form.Group className="mt-1" controlId="lastname">
                        <Form.Label className="fw-bold">Lastname</Form.Label>
                        <Form.Control
                          value={selectedStudentDetails.lastName ?? ""}
                          onChange={(e) => setLastname(e.target.value)}
                          required
                        />
                      </Form.Group>
                      <Form.Group className="mt-1" controlId="dateGraduation">
                        <Form.Label className="fw-bold">
                          Date of Graduation{" "}
                          <span className="fw-normal fst-italic">
                            (Format: 23 April 2022)
                          </span>
                        </Form.Label>
                        <Form.Control
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          required
                        />
                      </Form.Group>
                    </>
                  )}
                  {isPickedScholarship && (
                    <>
                      <Form.Group className="mt-1" controlId="lastname">
                        <Form.Label className="fw-bold">Lastname</Form.Label>
                        <Form.Control
                          value={selectedStudentDetails.lastName ?? ""}
                          onChange={(e) => setLastname(e.target.value)}
                          required
                        />
                      </Form.Group>
                      <Form.Group className="mt-1" controlId="semester">
                        <Form.Label className="fw-bold">Semester</Form.Label>
                        <Form.Select
                          aria-label="Default select example"
                          value={semester}
                          onChange={(e) => setSemester(e.target.value)}
                          required
                        >
                          <option value="" hidden>
                            Select Semester
                          </option>
                          <option
                            value="First Semester"
                            className="text-uppercase"
                          >
                            First Sem
                          </option>
                          <option
                            value="Second Semester"
                            className="text-uppercase"
                          >
                            Second Sem
                          </option>
                          <option
                            value="Midyear Semester"
                            className="text-uppercase"
                          >
                            Midyear Sem
                          </option>
                        </Form.Select>
                      </Form.Group>
                      <Form.Group className="mt-1" controlId="schoolyear">
                        <Form.Label className="fw-bold">
                          School Year{" "}
                          <span className="fw-normal fst-italic">
                            (Format: 2022-2023)
                          </span>
                        </Form.Label>
                        <Form.Control
                          value={schoolYear}
                          onChange={(e) => setSchoolYear(e.target.value)}
                          required
                        />
                      </Form.Group>
                    </>
                  )}
                  {isPickedTransfer && (
                    <>
                      <Form.Group className="mt-1" controlId="lastname">
                        <Form.Label className="fw-bold">Lastname</Form.Label>
                        <Form.Control
                          value={selectedStudentDetails.lastName ?? ""}
                          onChange={(e) => setLastname(e.target.value)}
                          required
                        />
                      </Form.Group>
                      <Form.Group className="mt-1" controlId="semester">
                        <Form.Label className="fw-bold">Semester</Form.Label>
                        <Form.Select
                          aria-label="Default select example"
                          value={semester}
                          onChange={(e) => setSemester(e.target.value)}
                          required
                        >
                          <option value="" hidden>
                            Select Semester
                          </option>
                          <option
                            value="First Semester"
                            className="text-uppercase"
                          >
                            First Sem
                          </option>
                          <option
                            value="Second Semester"
                            className="text-uppercase"
                          >
                            Second Sem
                          </option>
                          <option
                            value="Midyear Semester"
                            className="text-uppercase"
                          >
                            Midyear Sem
                          </option>
                        </Form.Select>
                      </Form.Group>
                      <Form.Group className="mt-1" controlId="schoolyear">
                        <Form.Label className="fw-bold">
                          School Year{" "}
                          <span className="fw-normal fst-italic">
                            (Format: 2022-2023)
                          </span>
                        </Form.Label>
                        <Form.Control
                          value={schoolYear}
                          onChange={(e) => setSchoolYear(e.target.value)}
                          required
                        />
                      </Form.Group>
                    </>
                  )}
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <div className="container-fluid d-flex align-items-center justify-content-between">
              <div>
                {isDownloadGraduate ? (
                  <div className="h6 fw-bold text-uppercase">
                    Already Generated:{" "}
                    <PDFDownloadLink
                      document={
                        <GraduateGoodMoral
                          firstName={firstname}
                          middleName={middlename}
                          lastName={lastname}
                          date={date}
                          gender={gender}
                          semester={semester}
                          schoolYear={schoolYear}
                        />
                      }
                      fileName="Certificate-of-Good-Moral-graduate"
                    >
                      {({ loading, error }) => {
                        useEffect(() => {
                          if (!loading) {
                            setGenerating(false);
                          }
                        }, [loading]);

                        return loading ? (
                          "Loading document..."
                        ) : (
                          <div className="btn btn-danger ms-2 text-capitalize btn-sm">
                            Goodmoral.pdf
                          </div>
                        );
                      }}
                    </PDFDownloadLink>
                  </div>
                ) : isDownloadScholarship ? (
                  <div className="h6 fw-bold text-uppercase">
                    Already Generated:{" "}
                    <PDFDownloadLink
                      document={
                        <ScholarshipGoodMoral
                          firstName={firstname}
                          middleName={middlename}
                          lastName={lastname}
                          date={date}
                          gender={gender}
                          semester={semester}
                          schoolYear={schoolYear}
                        />
                      }
                      fileName="Certificate-of-Good-Moral-scholarship"
                    >
                      {({ loading, error }) => {
                        useEffect(() => {
                          if (!loading) {
                            setGenerating(false);
                          }
                        }, [loading]);

                        return loading ? (
                          "Loading document..."
                        ) : (
                          <div className="btn btn-danger ms-2 text-capitalize btn-sm">
                            Goodmoral.pdf
                          </div>
                        );
                      }}
                    </PDFDownloadLink>
                  </div>
                ) : isDownloadTransfer ? (
                  <div className="h6 fw-bold text-uppercase">
                    Already Generated:{" "}
                    <PDFDownloadLink
                      document={
                        <TransferGoodMoral
                          firstName={firstname}
                          middleName={middlename}
                          lastName={lastname}
                          date={date}
                          gender={gender}
                          semester={semester}
                          schoolYear={schoolYear}
                        />
                      }
                      fileName="Certificate-of-Good-Moral-transfer"
                    >
                      {({ loading, error }) => {
                        useEffect(() => {
                          if (!loading) {
                            setGenerating(false);
                          }
                        }, [loading]);

                        return loading ? (
                          "Loading document..."
                        ) : (
                          <div className="btn btn-danger ms-2 text-capitalize btn-sm">
                            Goodmoral.pdf
                          </div>
                        );
                      }}
                    </PDFDownloadLink>
                  </div>
                ) : (
                  <div className="h6 fw-bold text-uppercase">
                    Not Yet Generated:{" "}
                  </div>
                )}
              </div>
              <div className="d-flex gap-1">
                <Button
                  className="btn btn-secondary"
                  onClick={() => {
                    props.onHide();
                    clearFields();
                  }}
                >
                  Close
                </Button>
                <Button type="submit" className="btn btn-success">
                  Generate{" "}
                  {
                    <PulseLoader
                      className="ms-2"
                      color={"#ffffff"}
                      loading={generating}
                      size={5}
                      aria-label="Loading Spinner"
                      data-testid="loader"
                    />
                  }
                </Button>
              </div>
            </div>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}
