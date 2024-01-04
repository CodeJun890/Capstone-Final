import React, { useContext } from "react";

import { useEffect, useState } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { StudentContext } from "../../../Context/StudentContext";
// Student Components

import "../../styles.css";
import { Loading } from "./Loading";

const StudentNavbar = React.lazy(() => import("./StudentNavbar"));
const StudentFooter = React.lazy(() => import("./StudentFooter"));
const StudentTopbar = React.lazy(() => import("./StudentTopbar"));
const DashboardStudent = React.lazy(() => import("./DashboardStudent"));
const PageNotFound404 = React.lazy(() => import("../ProtectedRoutes/404"));
const StudentProfile = React.lazy(() => import("./StudentProfile"));
const StudentViolation = React.lazy(() => import("./StudentViolation"));
const HelpAndSupport = React.lazy(() => import("./HelpAndSupport"));
const ServerError = React.lazy(() => import("../ProtectedRoutes/ServerError"));
const GoodMoralRequest = React.lazy(() => import("./GoodMoralRequest"));
const RequestHistory = React.lazy(() => import("./RequestHistory"));

export default function Student({ toggleStudentIsLoggedOut }) {
  const themeValue = localStorage.getItem("theme");
  const initialState = themeValue === "true";
  const [success, setSuccess] = useState(false);
  const [isToggled, setIsToggled] = useState(initialState);
  const [serverError, setIsServerError] = useState(false);
  const navigate = useNavigate();
  const currentLocation = useLocation().pathname;
  const [currentProgram, setCurrentProgram] = useState([]);
  const [programList, setProgramList] = useState([]);
  const [academicYear, setAcademicYear] = useState([]);
  const [countViolation, setCountViolation] = useState("");
  const [studentRecordViolation, setStudentRecordViolation] = useState([]);
  const [currentRequest, setCurrentRequest] = useState("");
  const [violationId, setViolationId] = useState("");
  const [requestList, setRequestList] = useState([]);
  const [requestRecord, setRequestRecord] = useState([]);
  const [currentRequestHistory, setCurrentRequestHistory] = useState("");
  const [viewCurrentRequest, setViewCurrentRequest] = useState([]);
  const baseUrl = "http://api.discipline-recommender-system.xyz/";
  axios.defaults.withCredentials = true;
  const handleLogout = () => {
    axios
      .post(baseUrl + "logout")
      .then((res) => {
        if (res.status === 200) {
          const getCookie = Cookies.get();
          for (const key in getCookie) {
            Cookies.remove(key);
          }
          navigate("/session-expired");
        } else {
          console.error("Logout failed:", res.data.error);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const [userData, setUserData] = useState({});

  useEffect(() => {
    axios
      .get(baseUrl + "student")
      .then((res) => {
        if (res.status === 200) {
          setUserData(res.data.studentUser);
          setSuccess(true);
        }
      })
      .catch((err) => {
        setSuccess(false);
        setIsServerError(!serverError);
        handleLogout();
        console.log(err);
      });
    axios
      .get(baseUrl + "program-list")
      .then((res) => {
        setProgramList(res.data.program);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  console.log(userData);

  return (
    <>
      {serverError ? (
        <ServerError />
      ) : (
        <div className={`wrap ${isToggled ? "dark" : ""}`}>
          {success && (
            <>
              <React.Suspense fallback={<Loading />}>
                <StudentContext.Provider
                  value={{
                    setCurrentRequestHistory,
                    currentRequestHistory,
                    userData,
                    setUserData,
                    currentProgram,
                    setCurrentProgram,
                    programList,
                    setProgramList,
                    baseUrl,
                    academicYear,
                    setAcademicYear,
                    countViolation,
                    setCountViolation,
                    studentRecordViolation,
                    setStudentRecordViolation,
                    violationId,
                    setViolationId,
                    currentRequest,
                    setCurrentRequest,
                    requestList,
                    setRequestList,
                    requestRecord,
                    setRequestRecord,
                    viewCurrentRequest,
                    setViewCurrentRequest,
                  }}
                >
                  <StudentNavbar
                    toggleStudentIsLoggedOut={toggleStudentIsLoggedOut}
                    setIsToggled={setIsToggled}
                  />
                  <div
                    className="d-flex flex-column justify-content-between position-relative"
                    id="student-body-container"
                  >
                    <div className="body-inner">
                      <StudentTopbar
                        isToggled={isToggled}
                        currentLocation={currentLocation}
                        toggleStudentIsLoggedOut={toggleStudentIsLoggedOut}
                      />
                      <div className="route-components-wrap">
                        <Routes>
                          <Route path="" element={<DashboardStudent />} />
                          <Route
                            path="student-dashboard"
                            element={<DashboardStudent />}
                          />
                          <Route
                            path="request-history"
                            element={<RequestHistory />}
                          />
                          <Route
                            path="student-profile"
                            element={<StudentProfile isToggled={isToggled} />}
                          />
                          <Route
                            path="goodmoral-request"
                            element={<GoodMoralRequest isToggled={isToggled} />}
                          />
                          <Route
                            path="student-violation"
                            element={<StudentViolation isToggled={isToggled} />}
                          />
                          <Route
                            path="help-support"
                            element={<HelpAndSupport isToggled={isToggled} />}
                          />
                          {/* 404 Page Not Found */}

                          <Route path="*" element={<PageNotFound404 />} />
                        </Routes>
                      </div>
                      <div id="footer-student">
                        <StudentFooter isToggled={isToggled} />
                      </div>
                    </div>
                  </div>
                </StudentContext.Provider>
              </React.Suspense>
            </>
          )}
        </div>
      )}
    </>
  );
}
