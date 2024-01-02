import React from "react";
import { useEffect, useState } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { AdminContext } from "../../../Context/AdminContext";

// Admin Components

import "../../styles.css";
import { Loading } from "./Loading";
import AdminTopbar from "./AdminTopbar";
import AdminFooter from "./AdminFooter";

const ServerError = React.lazy(() => import("../ProtectedRoutes/ServerError"));
const AdminNavbar = React.lazy(() => import("./AdminNavbar"));
const DashboardAdmin = React.lazy(() => import("./DashboardAdmin"));
const ManageStudents = React.lazy(() => import("./ManageStudents"));
const ViolationEntry = React.lazy(() => import("./ViolationEntry"));
const ManageProgram = React.lazy(() => import("./ManageProgram"));
const ManageViolation = React.lazy(() => import("./ManageViolation"));
const AcademicYear = React.lazy(() => import("./AcademicYear"));
const PageNotFound404 = React.lazy(() => import("../ProtectedRoutes/404"));
const UserManagement = React.lazy(() => import("./UserManagement"));
const SubAdminReports = React.lazy(() => import("./SubAdminReports"));
const ViolationAnalytics = React.lazy(() => import("./ViolationAnalytics"));
const StudentRequest = React.lazy(() => import("./StudentRequest"));

export default function Admin({ toggleAdminIsLoggedOut }) {
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
  const [currentStudentIncidentId, setCurrentStudentIncidentId] = useState("");
  const [currentViolationIncidentId, setCurrentViolationIncidentId] =
    useState("");
  const [incidentModalTrigger, setIncidentModalTrigger] = useState(false);
  const [currentEvidenceFile, setCurrentEvidenceFile] = useState("");
  const [incident, setIncident] = useState([]);
  const [currentId, setCurrentId] = useState("");
  const [resolveStudentRecord, setResolveStudentRecord] = useState([]);
  const [recordResolve, setRecordResolve] = useState([]);
  const [incidentRecord, setIncidentRecord] = useState([]);
  const [resolveViolationId, setResolveViolationId] = useState("");
  const [selectedStudentIncidentReport, setSelectedStudentIncidentReport] =
    useState("");
  const [currentRequest, setCurrentRequest] = useState("");
  const [requestList, setRequestList] = useState([]);
  const [modalShow, setModalShow] = React.useState(false);

  const baseUrl = "http://api.discipline-recommender-system.xyz/";
  axios.defaults.withCredentials = true;
  useEffect(() => {
    axios
      .get(baseUrl + "admin")
      .then((res) => {
        if (res.status === 200) {
          setUserData(res.data.adminUser);
          setSuccess(true);
        }
      })
      .catch((err) => {
        setSuccess(false);
        handleLogout();
        setIsServerError(!serverError);
      });

    axios
      .get(baseUrl + "program-list")
      .then((res) => {
        setPrograms(res.data.program);
      })
      .catch((err) => {
        console.log(err);
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
                <AdminContext.Provider
                  value={{
                    selectedStudentIncidentReport,
                    setSelectedStudentIncidentReport,
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
                    setCurrentStudentIncidentId,
                    setCurrentViolationIncidentId,
                    currentStudentIncidentId,
                    currentViolationIncidentId,
                    setIncidentModalTrigger,
                    incidentModalTrigger,
                    setCurrentEvidenceFile,
                    currentEvidenceFile,
                    incident,
                    setIncident,
                    currentId,
                    setCurrentId,
                    setResolveStudentRecord,
                    resolveStudentRecord,
                    recordResolve,
                    setRecordResolve,
                    incidentRecord,
                    setIncidentRecord,
                    resolveViolationId,
                    setResolveViolationId,
                    requestList,
                    setRequestList,
                    currentRequest,
                    setCurrentRequest,
                    modalShow,
                    setModalShow,
                  }}
                >
                  <AdminNavbar
                    toggleAdminIsLoggedOut={toggleAdminIsLoggedOut}
                    setIsToggled={setIsToggled}
                  />

                  <div
                    className="d-flex flex-column justify-content-between position-relative"
                    id="student-body-container"
                  >
                    <div className="body-inner">
                      <AdminTopbar
                        isToggled={isToggled}
                        currentLocation={currentLocation}
                        toggleAdminIsLoggedOut={toggleAdminIsLoggedOut}
                      />
                      <div className="route-components-wrap">
                        <Routes>
                          <Route path="" element={<DashboardAdmin />} />
                          <Route
                            path="admin-dashboard"
                            element={<DashboardAdmin />}
                          />
                          <Route
                            path="violation-analytics"
                            element={<ViolationAnalytics />}
                          />
                          <Route
                            path="subAdmin-reports"
                            element={<SubAdminReports isToggled={isToggled} />}
                          />
                          <Route
                            path="manage-students"
                            element={<ManageStudents isToggled={isToggled} />}
                          />
                          <Route
                            path="violation-entry"
                            element={<ViolationEntry isToggled={isToggled} />}
                          />
                          <Route
                            path="manage-program"
                            element={<ManageProgram isToggled={isToggled} />}
                          />
                          <Route
                            path="manage-violations"
                            element={<ManageViolation isToggled={isToggled} />}
                          />
                          <Route
                            path="academic-year"
                            element={<AcademicYear isToggled={isToggled} />}
                          />
                          <Route
                            path="student-request"
                            element={<StudentRequest isToggled={isToggled} />}
                          />
                          <Route
                            path="user-management"
                            element={<UserManagement isToggled={isToggled} />}
                          />

                          {/* 404 Page Not Found */}

                          <Route path="*" element={<PageNotFound404 />} />
                        </Routes>
                      </div>
                    </div>
                    <AdminFooter isToggled={isToggled} />
                  </div>
                </AdminContext.Provider>
              </React.Suspense>
            </>
          )}
        </div>
      )}
    </>
  );
}
