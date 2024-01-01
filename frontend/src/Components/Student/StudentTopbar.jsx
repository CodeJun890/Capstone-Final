import Student from "../../Assets/student.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useContext, useState, useRef } from "react";
import { StudentContext } from "../../../Context/StudentContext";
import Dropdown from "react-bootstrap/esm/Dropdown";
import { faKey, faSignOut, faEye } from "@fortawesome/free-solid-svg-icons";
import zxcvbc from "zxcvbn";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import InputGroup from "react-bootstrap/InputGroup";
import axios from "axios";
import { StrengthIndicator } from "../Homepage/StrengthIndicator";
import "../../styles.css";
import Swal from "sweetalert2";
export default function StudentTopbar({
  isToggled,
  currentLocation,
  toggleStudentIsLoggedOut,
}) {
  const { userData } = useContext(StudentContext);
  const [modalShow, setModalShow] = useState(false);
  let topBarText = "";

  switch (currentLocation) {
    case "/student-dashboard":
      topBarText = "Dashboard";
      break;
    case "/student-profile":
      topBarText = "Dashboard | Profile";
      break;
    case "/student-violation":
      topBarText = "Dashboard | Violation";
      break;
    case "/goodmoral-request":
      topBarText = "Dashboard | Good Moral Request";
      break;
    case "/request-history":
      topBarText = "Dashboard | Request History";
      break;
    case "/help-support":
      topBarText = "Dashboard | Help & Support";
      break;
    default:
      topBarText = "Dashboard";
  }

  const isLoggedOut = () => {
    Swal.fire({
      title: "Are you sure you want to logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Log Out",
    }).then((result) => {
      if (result.isConfirmed) {
        toggleStudentIsLoggedOut();
      }
    });
  };
  return (
    <>
      <div
        className={`top-header bg-light shadow d-flex align-items-center py-3 ${
          isToggled ? "bg-dark" : ""
        }`}
      >
        <div className="top-header-cont d-flex justify-content-between align-items-center w-100">
          <h5 className="fw-bold ms-4 mt-1" id="dashboard-breadcrumb">
            {topBarText}
          </h5>
          <div className="right-inner-header d-flex justify-content-around align-items-center">
            <Dropdown
              drop="down-end"
              data-bs-theme={`${isToggled ? "dark" : "light"}`}
            >
              <div className="student-icon rounded px-2 py-1 mx-2">
                <Dropdown.Toggle
                  className={`p-0 bg-transparent ${
                    isToggled ? "text-light" : "text-dark"
                  } border-0 d-flex justify-content-center  align-items-center`}
                  id="dropdown-basic"
                >
                  <img
                    src={Student}
                    className="img-fluid"
                    alt="student user icon"
                    style={{ maxWidth: "30px" }}
                  />
                </Dropdown.Toggle>
              </div>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => setModalShow(true)}>
                  <FontAwesomeIcon icon={faKey} className="icons me-1" /> Change
                  Password
                </Dropdown.Item>
                <Dropdown.Item onClick={isLoggedOut}>
                  <FontAwesomeIcon icon={faSignOut} className="icons me-1" />{" "}
                  Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <div className="greet-text">
              Hi,{" "}
              <span className="fw-bold me-3 text-capizatalize">
                {userData.firstName}
              </span>
            </div>
          </div>
        </div>
      </div>
      <ChangePassword show={modalShow} onHide={() => setModalShow(false)} />
    </>
  );
}

function ChangePassword(props) {
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
        .patch(`${baseUrl}admin-update/${userData._id}`, {
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
      <form ref={formRef1}>
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
