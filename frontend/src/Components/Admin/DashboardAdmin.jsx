import Card from "react-bootstrap/Card";
import Academic from "../../Assets/academic.png";
import Violation from "../../Assets/exe.png";
import Student from "../../Assets/student.png";
import { ClockLoader } from "react-spinners";
import { AdminContext } from "../../../Context/AdminContext";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartLine } from "@fortawesome/free-solid-svg-icons";
export default function DashboardAdmin() {
  const {
    baseUrl,
    totalStudents,
    setTotalStudents,
    academicYear,
    setAcademicYear,
  } = useContext(AdminContext);
  const [loading, setLoading] = useState(true);
  const [loadingAcadYear, setLoadingAcadYear] = useState(true);
  const [totalViolations, setTotalViolations] = useState("");
  const [loadingViolations, setLoadingTotalViolations] = useState(true);
  const [studentViolation, setStudentViolation] = useState("");

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
      .get(baseUrl + "fetch-academic-year")
      .then((res) => {
        const openAcademicYears = res.data.acadYear.filter(
          (year) => year.status === "OPEN"
        );
        setAcademicYear(openAcademicYears);
        setLoadingAcadYear(false);
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
            </div>
            <div className="col-md-6 my-3 d-flex align-items-stretch">
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
                      studentViolation
                    )}
                  </Card.Text>
                </Card.Body>
              </Card>
            </div>
            <div className="col-md-6 my-3 d-flex align-items-stretch">
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
            </div>
            <div className="col-md-6 my-3 d-flex align-items-stretch">
              <Card className="bg-success">
                <Card.Body className="d-flex flex-column justify-content-center align-items-center">
                  <div className="box-icon mb-2">
                    <img
                      src={Academic}
                      alt="Academic year icon"
                      className="img-fluid"
                    />
                  </div>
                  <Card.Title className="text-light text-uppercase">
                    Academic Year
                  </Card.Title>
                  <Card.Text className="text-center h2 my-1 fw-bold text-light">
                    {loadingAcadYear ? (
                      <ClockLoader color="#ffffff" loading={loadingAcadYear} />
                    ) : (
                      academicYear.map(
                        (year) => year.academicYear + " | " + year.semester
                      )
                    )}
                  </Card.Text>
                </Card.Body>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
