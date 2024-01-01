import Academic from "../../Assets/academic.png";
import Course from "../../Assets/graduate.png";
import News from "../../Assets/news.png";
import Card from "react-bootstrap/Card";
import axios from "axios";
import "../../styles.css";
import { useContext, useEffect, useState } from "react";
import { StudentContext } from "../../../Context/StudentContext";
import { ClockLoader } from "react-spinners";

export default function DashboardStudent() {
  const {
    baseUrl,
    userData,
    setCurrentProgram,
    currentProgram,
    countViolation,
    setCountViolation,
  } = useContext(StudentContext);

  const [loadingCourse, setLoadingCourse] = useState(true);
  const [loadingAcadYear, setLoadingAcadYear] = useState(true);
  const [loadingCount, setLoadingCount] = useState(true);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentAcademicYear, setCurrentAcademicYear] = useState("");

  useEffect(() => {
    axios
      .get(baseUrl + `program/${userData.course}`)
      .then((res) => {
        setCurrentProgram(res.data);
        setLoadingCourse(false);
      })
      .catch((err) => {
        console.log(err);
      });
    axios
      .get(baseUrl + `list-all-student-violation/${userData._id}`)
      .then((res) => {
        if (res.status == 200) {
          setCountViolation(res.data.violationCount);
          setLoadingCount(false);
        }
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
          <div className="row mx-2 justify-content-center align-items-center">
            <div className="col-md-4 col-sm-12 d-flex align-items-stretch">
              <Card className="text-center mt-2 bg-success text-light">
                <Card.Body>
                  <div className="box-icon mb-2">
                    <img
                      src={Academic}
                      alt="Academic year icon"
                      className="img-fluid"
                    />
                  </div>
                  <Card.Title className="fw-bold">Academic Year</Card.Title>
                  <Card.Text className="text-center h2 my-1 fw-bold text-light">
                    {loadingAcadYear ? (
                      <div className="d-flex justify-content-center">
                        <ClockLoader
                          color="#ffffff"
                          loading={loadingAcadYear}
                        />
                      </div>
                    ) : (
                      currentAcademicYear
                    )}
                  </Card.Text>
                </Card.Body>
              </Card>
            </div>
            <div className="col-md-4 col-sm-12 d-flex align-items-stretch">
              <Card
                className="text-center mt-2 text-light"
                style={{ backgroundColor: "#800080" }}
              >
                <Card.Body className="d-flex flex-column justify-content-center align-items-center">
                  <div className="box-icon mb-2">
                    <img
                      src={Course}
                      alt="Academic year icon"
                      className="img-fluid"
                    />
                  </div>
                  <Card.Title className="fw-bold">Course / Program</Card.Title>
                  <Card.Text className="text-capitalize h5">
                    {loadingCourse ? (
                      <ClockLoader color="#ffffff" loading={loadingCourse} />
                    ) : (
                      currentProgram.program_description
                    )}
                  </Card.Text>
                </Card.Body>
              </Card>
            </div>
            <div className="col-md-4 col-sm-12 d-flex align-items-stretch">
              <Card
                className="text-center mt-2 text-light"
                style={{ backgroundColor: "#a90f19" }}
              >
                <Card.Body>
                  <div className="box-icon mb-2">
                    <img
                      src={News}
                      alt="Academic year icon"
                      className="img-fluid"
                    />
                  </div>
                  <Card.Title className="fw-bold">Total Violations</Card.Title>
                  <Card.Text className="h1 fw-bold">
                    {loadingCount ? (
                      <div className="d-flex justify-content-center">
                        <ClockLoader color="#ffffff" loading={loadingCount} />
                      </div>
                    ) : (
                      countViolation
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
