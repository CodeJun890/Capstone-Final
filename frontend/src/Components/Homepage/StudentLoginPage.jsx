import LoginImg from "../../Assets/cvsu-icon.webp";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import Button from "react-bootstrap/Button";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import "../../styles.css";
import { useState } from "react";
import ServerError from "../ProtectedRoutes/ServerError";

function StudentLogin() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [isPassCorrect, setIsPassCorrect] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errorLogin, setErrorLogin] = useState(false);

  const navigate = useNavigate();

  axios.defaults.withCredentials = true;
  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://api.discipline-recommender-system.xyz/login-user", {
        identifier,
        password,
        rememberMe,
      })
      .then((res) => {
        if (res.data.Status === 200) {
          if (res.data.role === "student") {
            navigate("/student");
          } else if (res.data.role === "admin") {
            navigate("/admin");
          } else if (res.data.role === "sub-admin") {
            navigate("/subAdmin");
          } else {
            navigate("/");
          }
        } else {
          setIsPassCorrect(false);
          console.log(res.data.role);
        }
      })
      .catch((err) => {
        console.log(err);
        setErrorLogin(!errorLogin);
      });
  };
  return (
    <>
      {errorLogin ? (
        <ServerError />
      ) : (
        <div className="container d-flex justify-content-center align-items-center my-5 loginContainer">
          <div className="row border rounded-5 p-3 bg-white shadow box-area text-center mx-2">
            {/*------ Left Box ------*/}
            <div className="col-md-6 rounded-4 d-flex justify-content-center align-items-center flex-column left-box">
              <div className="featured-img mb-3">
                <img
                  src={LoginImg}
                  className="img-fluid"
                  style={{ maxWidth: "300px" }}
                />
                <div className="h2 text-light mt-3">
                  Cavite State University
                </div>
                <div className="h3 mt-2 text-warning">
                  Trece Martires Campus
                </div>
              </div>
            </div>
            {/*------ Right Box ------*/}

            <div className="col-md-6 right-box">
              <form onSubmit={handleSubmit}>
                <div className="row align-items-center">
                  <div className="header-text mb-4">
                    <p className="display-5 fw-bold">Login</p>
                    <p>We are happy to have you back.</p>
                  </div>
                  {!isPassCorrect ? (
                    <p className="alert alert-danger text-danger isMatchText">
                      Login failed. Please check your credentials and try again.
                    </p>
                  ) : null}

                  <div className="input-group mb-3">
                    <input
                      type="text"
                      className="form-control form-control-lg bg-light fs-6"
                      placeholder="Email or Student Number"
                      id="identifier"
                      name="identifier"
                      autoComplete="on"
                      value={identifier}
                      onChange={(e) => {
                        setIdentifier(e.target.value);
                        setIsPassCorrect(true);
                      }}
                      required
                    />
                  </div>
                  <div className="input-group mb-1">
                    <input
                      type={`${showPassword ? "text" : "password"}`}
                      className="form-control form-control-lg bg-light fs-6"
                      placeholder="Password"
                      id="Password"
                      name="password"
                      autoComplete="off"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setIsPassCorrect(true);
                      }}
                      required
                    />
                    <Button
                      onClick={() => setShowPassword(!showPassword)}
                      variant="secondary"
                    >
                      {showPassword ? (
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
                  </div>
                  <div className="input-group mb-5 d-flex justify-content-between">
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="formCheck"
                        value={rememberMe}
                        onChange={() => setRememberMe(!rememberMe)}
                      />
                      <label
                        htmlFor="formCheck"
                        className="form-check-label text-secondary"
                      >
                        <small>Remember Me</small>
                      </label>
                    </div>
                    <div className="forgot">
                      <small>
                        <Link to="/forgot-password">Forgot Password?</Link>
                      </small>
                    </div>
                  </div>
                  <div className="input-group mb-3">
                    <button
                      type="submit"
                      className="btn btn-lg btn-primary w-100 fs-6"
                    >
                      Login
                    </button>
                  </div>

                  <div className="row mt-3">
                    <small>
                      Don't have an account? <Link to="/signup">Sign Up</Link>
                    </small>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default StudentLogin;
