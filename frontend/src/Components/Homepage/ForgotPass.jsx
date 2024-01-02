import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import CvsuLogo from "../../Assets/cvsu-icon.webp";

import axios from "axios";

export default function ForgotPass() {
  const [emailAddress, setEmailAddressPass] = useState("");
  const [message, setMessage] = useState("");
  const [emailSent, setEmailSent] = useState("");
  const formRef = useRef(null);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (emailAddress) {
      axios
        .post("http://api.discipline-recommender-system.xyz/forgot-password", {
          emailAddress,
        })
        .then((response) => {
          console.log(response.data);
          setEmailSent(response.data.message);
        })
        .catch((err) => {
          setMessage(err);
          console.error(err);
        });
    } else {
      formRef.current.reportValidity();
    }
  };

  return (
    <>
      <div className="container my-5 forgotPassContainer">
        <div className="row justify-content-center align-items-center mx-3">
          <div
            className="col-md-7 my-5 border shadow p-5"
            style={{ borderRadius: "20px" }}
          >
            <div className="d-flex justify-content-center">
              <img src={CvsuLogo} alt="cvsu logo" width="80px" height="auto" />
            </div>

            <div className="h4 text-center mt-4">Forgot Password</div>
            <p className="text-center mb-4">
              Please enter your email address below to reset your password.
            </p>
            {message && (
              <div className="alert alert-danger text-center">
                Sorry, the email you entered does not match any registered
                accounts
              </div>
            )}
            {emailSent && (
              <div className="alert alert-success text-center">{emailSent}</div>
            )}
            <Form ref={formRef}>
              <Form.Group className="mb-3" controlId="formEmailAddressPassword">
                <Form.Label className="fw-bold">Email Address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter your email"
                  value={emailAddress}
                  onChange={(e) => {
                    setMessage("");
                    setEmailSent("");
                    setEmailAddressPass(e.target.value);
                  }}
                  required
                />
              </Form.Group>
              <div className="container-btn d-flex justify-content-between align-items-center">
                <Link className="text-start" to="/login">
                  Go to Login
                </Link>
                <Button
                  onClick={handleSubmit}
                  variant="success"
                  type="submit"
                  className="mt-2 py-2 px-3 "
                >
                  Submit
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
}
