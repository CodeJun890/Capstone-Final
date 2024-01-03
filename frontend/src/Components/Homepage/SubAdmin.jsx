import React from "react";
import { useEffect, useState } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { SubAdminContext } from "../../../Context/SubAdminContext";
// Admin Components

import "../../styles.css";
import { Loading } from "../SubAdmin/Loading";
import SubAdminTopbar from "../SubAdmin/SubAdminTopBar";
import SubAdminFooter from "../SubAdmin/SubAdminFooter";

const DashboardSubAdmin = React.lazy(() =>
  import("../SubAdmin/DashboardSubAdmin")
);
const ServerError = React.lazy(() => import("../ProtectedRoutes/ServerError"));
const PageNotFound404 = React.lazy(() => import("../ProtectedRoutes/404"));
const SubAdminNavbar = React.lazy(() => import("../SubAdmin/SubAdminNavbar"));
const ManageStudents = React.lazy(() => import("../SubAdmin/ManageStudents"));
const ManageViolation = React.lazy(() => import("../SubAdmin/ManageViolation"));
const ManageProgram = React.lazy(() => import("../SubAdmin/ManageProgram"));
const StudentIncidentReport = React.lazy(() =>
  import("../SubAdmin/StudentIncidentReport")
);
const ViolationAnalytics = React.lazy(() =>
  import("../SubAdmin/ViolationAnalytics")
);
const StudentRequest = React.lazy(() => import("../SubAdmin/StudentRequest"));

export default function SubAdmin({ toggleSubAdminIsLoggedOut }) {
  const themeValue = localStorage.getItem("theme");
  const initialstate = themeValue === "true";
  const [success, setSuccess] = useState(false);
  const [isToggled, setIsToggled] = useState(initialstate);
  const [serverError, setIsServerError] = useState(false);
  const navigate = useNavigate();
  const currentLocation = useLocation().pathname;
  const [totalStudents, setTotalStudents] = useState();
  const [currentStudent, setCurrentStudent] = useState("");
  const [currentViolationList, setCurrentViolationList] = useState("");
  const [currentProgramList, setCurrentProgramList] = useState("");
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [academicYear, setAcademicYear] = useState([]);
  const [violationList, setViolationList] = useState({});
  const [record, setRecord] = useState([]);
  const [programList, setProgramList] = useState({});
  const [programRecord, setProgramRecord] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [selectedStudentDetails, setSelectedStudentDetails] = useState([]);
  const [selectedViolationDetails, setSelectedViolationDetails] = useState([]);
  const [currentAdmin, setCurrentAdmin] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [currentRequest, setCurrentRequest] = useState("");
  const [requestList, setRequestList] = useState([]);
  const [modalShow, setModalShow] = React.useState(false);

  const baseUrl = "http://api.discipline-recommender-system.xyz/";
  axios.defaults.withCredentials = true;
  useEffect(() => {
    axios
      .get(baseUrl + "subAdmin")
      .then((res) => {
        if (res.status === 200) {
          setUserData(res.data.subAdminUser);
          setSuccess(true);
        }
      })
      .catch((err) => {
        setSuccess(false);
        handleLogout();
        setIsServerError(!serverError);
      });
  }, []);

  const [userData, setUserData] = useState({});

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
  return (
    <>
      {serverError ? (
        <ServerError />
      ) : (
        <div className={`wrap ${isToggled ? "dark" : ""}`}>
          {success && (
            <>
              <React.Suspense fallback={<Loading />}>
                <SubAdminContext.Provider
                  value={{
                    currentRequest,
                    setCurrentRequest,
                    requestList,
                    setRequestList,
                    modalShow,
                    setModalShow,
                    userData,
                    setUserData,
                    totalStudents,
                    setTotalStudents,
                    filteredRecords,
                    setFilteredRecords,
                    records,
                    setRecords,
                    record,
                    setRecord,
                    currentStudent,
                    setCurrentStudent,
                    currentViolationList,
                    setCurrentViolationList,
                    academicYear,
                    setAcademicYear,
                    violationList,
                    setViolationList,
                    programList,
                    setProgramList,
                    programRecord,
                    setProgramRecord,
                    currentProgramList,
                    setCurrentProgramList,
                    selectedStudentDetails,
                    setSelectedStudentDetails,
                    selectedViolationDetails,
                    setSelectedViolationDetails,
                    currentAdmin,
                    setCurrentAdmin,
                    selectedStudentId,
                    setSelectedStudentId,
                    programs,
                    baseUrl,
                  }}
                >
                  <SubAdminNavbar
                    toggleSubAdminIsLoggedOut={toggleSubAdminIsLoggedOut}
                    setIsToggled={setIsToggled}
                  />

                  <div
                    className="d-flex flex-column justify-content-between position-relative"
                    id="student-body-container"
                  >
                    <div className="body-inner">
                      <SubAdminTopbar
                        isToggled={isToggled}
                        currentLocation={currentLocation}
                        toggleSubAdminIsLoggedOut={toggleSubAdminIsLoggedOut}
                      />
                      <div className="route-components-wrap">
                        <Routes>
                          <Route path="" element={<DashboardSubAdmin />} />
                          <Route
                            path="subAdmin-dashboard"
                            element={<DashboardSubAdmin />}
                          />
                          <Route
                            path="violation-analytics"
                            element={<ViolationAnalytics />}
                          />
                          <Route
                            path="manage-students"
                            element={<ManageStudents isToggled={isToggled} />}
                          />
                          <Route
                            path="manage-violations"
                            element={<ManageViolation isToggled={isToggled} />}
                          />
                          <Route
                            path="manage-program"
                            element={<ManageProgram isToggled={isToggled} />}
                          />
                          <Route
                            path="student-request"
                            element={<StudentRequest isToggled={isToggled} />}
                          />
                          <Route
                            path="student-incident-report"
                            element={
                              <StudentIncidentReport isToggled={isToggled} />
                            }
                          />

                          {/* 404 Page Not Found */}

                          <Route path="*" element={<PageNotFound404 />} />
                        </Routes>
                      </div>
                    </div>
                    <SubAdminFooter isToggled={isToggled} />
                  </div>
                </SubAdminContext.Provider>
              </React.Suspense>
            </>
          )}
        </div>
      )}
    </>
  );
}
