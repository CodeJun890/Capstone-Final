import React from "react";
import axios from "axios";
import CvsuLogo from "../../Assets/cvsu-icon.webp";
import profileImg from "../../Assets/upload.jpg";
import { Link } from "react-router-dom";

import "../../styles.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDoubleRight,
  faFileAlt,
} from "@fortawesome/free-solid-svg-icons";
import { faThLarge } from "@fortawesome/free-solid-svg-icons";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { faUserAlt } from "@fortawesome/free-solid-svg-icons";
import { faKey } from "@fortawesome/free-solid-svg-icons";
import Offcanvas from "react-bootstrap/Offcanvas";

import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import { faSignOut } from "@fortawesome/free-solid-svg-icons";
import { faMoon } from "@fortawesome/free-solid-svg-icons";
import { faSun } from "@fortawesome/free-solid-svg-icons";
import { useState, useContext, useRef } from "react";
import Swal from "sweetalert2";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import InputGroup from "react-bootstrap/InputGroup";
import zxcvbc from "zxcvbn";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import {
  faEyeSlash,
  faClockRotateLeft,
} from "@fortawesome/free-solid-svg-icons";

import { StrengthIndicator } from "../Homepage/StrengthIndicator";
import { StudentContext } from "../../../Context/StudentContext";

function MyVerticallyCenteredModal(props) {
  const { userData, baseUrl } = useContext(StudentContext);

  // Check if password is strong
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isNotMatch, setIsNotMatch] = useState(false);
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [isPasswordStrong, setIsPasswordStrong] = useState(true);
  const [passwordExist, setPasswordExist] = useState(false);
  const formRef1 = useRef(null);
  const testResult = zxcvbc(password);
  const passLabel = () => {
    switch (testResult.score) {
      case 0:
        return "Very Weak";
      case 1:
        return "Weak";
      case 2:
        return "Fair";
      case 3:
        return "Strong";
      case 4:
        return "Very Strong";
      default:
        return "";
    }
  };

  const validatePass = () => {
    if (!password || !confirmPassword) {
      return false;
    }
    if (password !== confirmPassword) {
      console.log(passLabel());
      setIsNotMatch(true);
      return false;
    } else {
      setIsNotMatch(false);
    }
    if (
      passLabel() === "Very Weak" ||
      passLabel() === "Weak" ||
      passLabel() === "Fair"
    ) {
      setIsPasswordStrong(false);
      return false;
    }
    return true;
  };

  const handleSubmitPass = (e) => {
    e.preventDefault();

    if (validatePass()) {
      axios
        .patch(`${baseUrl}student-update/${userData._id}`, {
          newPassword: password,
        })
        .then((res) => {
          if (res.status === 200) {
            Swal.fire({
              position: "center",
              icon: "success",
              title: "Congratulations!",
              text: "Password updated successfully!.",
              showConfirmButton: false,
              timer: 1000,
              padding: "3em",
            }).then((result) => {
              if (result.dismiss === Swal.DismissReason.timer) {
                props.onHide();
                setIsNotMatch(false);
                setIsPasswordStrong(true);
                setPassword("");
                setConfirmPassword("");
              }
            });
          }
        })
        .catch((err) => {
          console.log("Error in updating user data: ", err);
          setPasswordExist(true);
        });
    } else {
      formRef1.current.reportValidity();
    }
  };
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      backdrop="static"
      centered
      onHide={() => {
        props.onHide();
        setIsNotMatch(false);
        setIsPasswordStrong(true);
        setPassword("");
        setConfirmPassword("");
      }}
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Change Password
        </Modal.Title>
      </Modal.Header>
      <form ref={formRef1} autoComplete="off">
        <Modal.Body>
          {isNotMatch && (
            <p className="alert alert-danger mx-md-5 mx-2 text-center">
              Passwords don't match. Double-check and confirm your password
              entry.
            </p>
          )}
          {!isPasswordStrong && (
            <p className="alert alert-danger text-center mx-md-5 mx-2">
              Please choose a stronger password for better account security.
            </p>
          )}
          {passwordExist && (
            <p className="alert alert-warning text-center mx-md-5 mx-2">
              Your new password cannot be the same as your current password.
            </p>
          )}
          <div className="container">
            <div className="row d-flex justify-content-center align-items-center">
              <div className="col-12">
                <div className="input_wrap">
                  <label htmlFor="password" className="fw-bold">
                    New Password
                  </label>
                  <InputGroup>
                    <input
                      type={showPassword1 ? "text" : "password"}
                      className={`form-control form-control-lg bg-light fs-6 ${
                        !isPasswordStrong ? "border-danger " : ""
                      }`}
                      placeholder="Enter your new password"
                      id="password"
                      name="password"
                      value={password}
                      onChange={(e) => {
                        setPasswordExist(false);
                        setPassword(e.target.value);
                        setIsPasswordStrong(true);
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
                {password && <StrengthIndicator password={password} />}
                <div className="input_wrap mt-1">
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

              <div className="col-12">
                <div className="lead fw-bold mt-1">
                  Password Format Guidelines
                </div>
                <ol>
                  <li>
                    <strong>Length:</strong> Use at least 12 characters.
                  </li>
                  <li>
                    <strong>Variety:</strong> Include upper and lower case,
                    numbers, and special characters.
                  </li>
                  <li>
                    <strong>Avoid Predictability:</strong> Don't use common
                    words or patterns.
                  </li>
                  <li>
                    <strong>Uniqueness:</strong> Use a different password for
                    each account.
                  </li>
                  <li>
                    <strong>Consider Passphrases:</strong> Consider random word
                    combinations.
                  </li>
                  <li>
                    <strong>Change Regularly:</strong> Update passwords
                    periodically.
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </Modal.Body>
      </form>
      <Modal.Footer>
        <Button variant="success" onClick={handleSubmitPass}>
          Submit
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            props.onHide(),
              setIsNotMatch(false),
              setIsPasswordStrong(true),
              setPassword(""),
              setConfirmPassword("");
          }}
        >
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
export default function StudentNavbar({
  setIsToggled,
  toggleStudentIsLoggedOut,
}) {
  const [show, setShow] = useState(false);
  const [modalShow, setModalShow] = React.useState(false);
  const handleClose = () => {
    setShow(false);
  };
  const { userData } = useContext(StudentContext);
  if (localStorage.getItem("theme") === null) {
    localStorage.setItem("theme", "false");
  }

  const themeValue = localStorage.getItem("theme");
  const initialState = themeValue === "true";

  const [isDarkMode, setIsDarkMode] = useState(initialState);
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

  return (
    <>
      {/*---- Topbar -----*/}
      <nav
        className={`navbar navbar-expand-lg navbar-light bg-light topbar ${
          isToggle ? "bg-dark navbar-dark" : ""
        }`}
        style={{ display: "none" }}
      >
        <div className="container-fluid ">
          <Link
            to="/student"
            style={{ textDecoration: "none", color: "#000000" }}
          >
            <div className="logo-cont">
              <img
                src={CvsuLogo}
                alt="cvsu logo"
                style={{ maxWidth: "50px", height: "auto" }}
                className="me-2"
              />
              <div className="h5 fw-bold text-upper mt-2">
                Discipline Recommender
              </div>
            </div>
          </Link>
          <button
            className="navbar-toggler"
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

              <p
                className="my-auto fw-bold ms-2 text-uppercase cvsu-text"
                id="system-name"
              >
                Discipline Recommender
              </p>
              <Offcanvas.Header closeButton></Offcanvas.Header>
            </div>
            <header className="topbar-header mt-4">
              <div className="profile-image mx-auto">
                <span className="image">
                  <img
                    src={
                      userData.profileImage ? userData.profileImage : profileImg
                    }
                    alt="Profile Image"
                  />
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

                <span className="studentNumber">{userData.studentNumber}</span>
              </div>
            </header>
            <Offcanvas.Body>
              <div className={`menu-bar ${isToggle ? "dark" : ""}`}>
                <div className="menu">
                  <ul className="menu-links" style={{ padding: "0" }}>
                    <li className="nav-links">
                      <Link to="/student-dashboard">
                        <FontAwesomeIcon icon={faThLarge} className="icons" />
                        <span className="text-link">Dashboard</span>
                      </Link>
                    </li>
                    <li className="nav-links">
                      <Link to="/student-profile">
                        <FontAwesomeIcon icon={faUserAlt} className="icons" />
                        <span className="text-link">Profile</span>
                      </Link>
                    </li>
                    <li className="nav-links">
                      <Link to="/student-violation">
                        <FontAwesomeIcon
                          icon={faExclamationTriangle}
                          className="icons"
                        />
                        <span className="text-link">My Violations</span>
                      </Link>
                    </li>
                    <li className="nav-links">
                      <Link to="/goodmoral-request">
                        <FontAwesomeIcon icon={faFileAlt} className="icons" />
                        <span className="text-link">Request Good Moral</span>
                      </Link>
                    </li>
                    <li className="nav-links">
                      <Link to="/request-history">
                        <FontAwesomeIcon
                          icon={faClockRotateLeft}
                          className="icons"
                        />
                        <span className="text-link">Request History</span>
                      </Link>
                    </li>
                    <li className="nav-links">
                      <a
                        onClick={() => setModalShow(true)}
                        style={{ cursor: "pointer" }}
                      >
                        <FontAwesomeIcon icon={faKey} className="icons" />
                        <span className="text-link">Change Password</span>
                      </a>
                    </li>
                    <li className="nav-links">
                      <Link to="/help-support">
                        <FontAwesomeIcon
                          icon={faQuestionCircle}
                          className="icons"
                        />
                        <span className="text-link">Help/Support</span>
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
            <span className="image">
              <img
                src={userData.profileImage ? userData.profileImage : profileImg}
                alt="Profile Image"
              />
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

            <span className="studentNumber">{userData.studentNumber}</span>
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
                <Link to="/student-dashboard">
                  <FontAwesomeIcon icon={faThLarge} className="icons" />
                  <span className="text-link">Dashboard</span>
                </Link>
              </li>

              <li className="nav-links">
                <Link to="/student-profile">
                  <FontAwesomeIcon icon={faUserAlt} className="icons" />
                  <span className="text-link">Profile</span>
                </Link>
              </li>
              <li className="nav-links">
                <Link to="/student-violation">
                  <FontAwesomeIcon
                    icon={faExclamationTriangle}
                    className="icons"
                  />
                  <span className="text-link">My Violations</span>
                </Link>
              </li>
              <li className="nav-links">
                <Link to="/goodmoral-request">
                  <FontAwesomeIcon icon={faFileAlt} className="icons" />
                  <span className="text-link">Request Good Moral</span>
                </Link>
              </li>
              <li className="nav-links">
                <Link to="/request-history">
                  <FontAwesomeIcon icon={faClockRotateLeft} className="icons" />
                  <span className="text-link">Request History</span>
                </Link>
              </li>

              <li className="nav-links">
                <Link to="/help-support">
                  <FontAwesomeIcon icon={faQuestionCircle} className="icons" />
                  <span className="text-link">Help/Support</span>
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
      <MyVerticallyCenteredModal
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
    </>
  );
}
