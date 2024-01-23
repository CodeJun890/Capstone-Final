import Card from "react-bootstrap/Card";
import Academic from "../../Assets/academic.png";
import Violation from "../../Assets/exe.png";
import Student from "../../Assets/student.png";
import { ClockLoader } from "react-spinners";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartLine } from "@fortawesome/free-solid-svg-icons";
import { SubAdminContext } from "../../../Context/SubAdminContext";

import { Link } from "react-router-dom";
export default function DashboardSubAdmin() {
  const { baseUrl, totalStudents, setTotalStudents } =
    useContext(SubAdminContext);
  const [loading, setLoading] = useState(true);
  const [loadingAcadYear, setLoadingAcadYear] = useState(true);
  const [totalViolations, setTotalViolations] = useState("");
  const [loadingViolations, setLoadingTotalViolations] = useState(true);
  const [totalStudentViolation, setStudentViolation] = useState("");
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentAcademicYear, setCurrentAcademicYear] = useState("");
  useEffect(() => {
    axios
      .get(baseUrl + "fetch-students")
      .then((res) => {
        setTotalStudents(res.data.numberOfStudents);

        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });

    axios
      .get(baseUrl + "fetch-total-violation")
      .then((res) => {
        setTotalViolations(res.data.numberOfViolations);
        setStudentViolation(res.data.numberOfStudentViolations);
        setLoadingTotalViolations(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    const nextYear = currentYear + 1;
    const academicYearString = `${currentYear} - ${nextYear}`;
    setCurrentAcademicYear(academicYearString);
    setLoadingAcadYear(false);
  }, [currentYear]);
  return (
    <>
      <div className="wrap-dashboard scrollable-container">
        <div className="container h-100 py-5">
          <div className="d-flex justify-content-center">
            <Link to="/violation-analytics" className="btn btn-primary">
              Violation Analytics
              <FontAwesomeIcon className="ms-1" icon={faChartLine} />
            </Link>
          </div>
          <div className="row mx-2 justify-content-center align-items-center">
            <div className="col-md-6 my-3 d-flex align-items-stretch">
              <Link to="/manage-students">
                <Card style={{ backgroundColor: "#2565ae" }}>
                  <Card.Body className="d-flex flex-column justify-content-center align-items-center">
                    <div className="box-icon mb-2">
                      <img
                        src={Student}
                        alt="Academic year icon"
                        className="img-fluid"
                      />
                    </div>
                    <Card.Title className="lead text-light text-uppercase text-center">
                      Total Registered Student
                    </Card.Title>
                    <Card.Text className="text-center h1 fw-bold text-light">
                      {loading ? (
                        <ClockLoader color="#ffffff" loading={loading} />
                      ) : (
                        totalStudents
                      )}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Link>
            </div>
            <div className="col-md-6 my-3 d-flex align-items-stretch">
              <Link to="/violation-entry">
                <Card style={{ backgroundColor: "#a90f19" }}>
                  <Card.Body className="d-flex flex-column justify-content-center align-items-center">
                    <FontAwesomeIcon
                      className="display-5 text-light mb-2"
                      icon={faExclamationTriangle}
                    />

                    <Card.Title className="text-light text-uppercase text-center">
                      Student Violation List
                    </Card.Title>
                    <Card.Text className="text-center h1 fw-bold text-light">
                      {loadingViolations ? (
                        <ClockLoader
                          color="#ffffff"
                          loading={loadingViolations}
                        />
                      ) : (
                        totalStudentViolation
                      )}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Link>
            </div>
            <div className="col-md-6 my-3 d-flex align-items-stretch">
              <Link to="/manage-violations">
                <Card style={{ background: "#6f2da8" }}>
                  <Card.Body className="d-flex flex-column justify-content-center align-items-center">
                    <div className="box-icon mb-2">
                      <img
                        src={Violation}
                        alt="Academic year icon"
                        className="img-fluid"
                      />
                    </div>
                    <Card.Title className="lead text-light text-uppercase text-center">
                      List of Violations
                    </Card.Title>
                    <Card.Text className="text-center h1 fw-bold text-light">
                      {loadingViolations ? (
                        <ClockLoader
                          color="#ffffff"
                          loading={loadingViolations}
                        />
                      ) : (
                        totalViolations
                      )}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Link>
            </div>
            <div className="col-md-6 my-3 d-flex align-items-stretch">
              <Link to="/academic-year">
                <Card className="bg-success">
                  <Card.Body className="d-flex flex-column justify-content-center align-items-center">
                    <div className="box-icon mb-2">
                      <img
                        src={Academic}
                        alt="Academic year icon"
                        className="img-fluid"
                      />
                    </div>
                    <Card.Title className="text-light text-uppercase text-center">
                      Academic Year
                    </Card.Title>
                    <Card.Text className="text-center h2 my-1 fw-bold text-light">
                      {loadingAcadYear ? (
                        <ClockLoader
                          color="#ffffff"
                          loading={loadingAcadYear}
                        />
                      ) : (
                        currentAcademicYear
                      )}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
