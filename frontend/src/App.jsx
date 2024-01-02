import { Route, Routes, useNavigate } from "react-router-dom";
import React from "react";
import Cookie from "js-cookie";
import RotateLoader from "react-spinners/RotateLoader";
import axios from "axios";

//Lazy Components // Homepage Components
const AuthExpired = React.lazy(() =>
  import("./Components/ProtectedRoutes/AuthExpired")
);
const LazyStudentSignupPage = React.lazy(() =>
  import("./Components/Homepage/StudentSignupPage")
);
const LazyStudentLogin = React.lazy(() =>
  import("./Components/Homepage/StudentLoginPage")
);

const ForgotPass = React.lazy(() => import("./Components/Homepage/ForgotPass"));

const HomeNavbar = React.lazy(() => import("./Components/Homepage/HomeNavbar"));
const HomeFooter = React.lazy(() => import("./Components/Homepage/HomeFooter"));

import { Homepage } from "./Components/Homepage/Homepage";

import { ScrollToTop } from "./Components/Homepage/ScrollToTop";
import { GoToTop } from "./Components/Homepage/GoToTop";

//Protecting Routes

const Forbidden403 = React.lazy(() =>
  import("./Components/ProtectedRoutes/403")
);

//Admin Components
const Admin = React.lazy(() => import("./Components/Admin/Admin"));
const DashboardAdmin = React.lazy(() => {
  import("./Components/Admin/DashboardAdmin");
});

//Student Components
const Student = React.lazy(() => import("./Components/Student/Student"));

import Cookies from "js-cookie";
import SubAdmin from "./Components/SubAdmin/SubAdmin";
import ScrollToHashElement from "./Components/Homepage/ScrollToHashElement";
export default function App() {
  const Navigate = useNavigate();
  const isAdminLoggedIn = Cookies.get("isAdminLoggedIn");
  const isSubAdminLoggedIn = Cookies.get("isSubAdminLoggedIn");
  const isStudentLoggedIn = Cookies.get("isStudentLoggedIn");

  const toggleAdminIsLoggedOut = () => {
    axios
      .post("http://localhost:4000/logout")
      .then((res) => {
        if (res.status === 200) {
          const getCookie = Cookie.get();
          for (const key in getCookie) {
            Cookie.remove(key);
          }
          Navigate("/login");
        } else {
          console.error("Logout failed:", response.data.error);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const toggleSubAdminIsLoggedOut = () => {
    axios
      .post("http://localhost:4000/logout")
      .then((res) => {
        if (res.status === 200) {
          const getCookie = Cookie.get();
          for (const key in getCookie) {
            Cookie.remove(key);
          }
          Navigate("/login");
        } else {
          console.error("Logout failed:", response.data.error);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const toggleStudentIsLoggedOut = () => {
    axios
      .post("http://localhost:4000/logout")
      .then((res) => {
        if (res.status === 200) {
          const getCookie = Cookie.get();
          for (const key in getCookie) {
            Cookie.remove(key);
          }
          Navigate("/login");
        } else {
          console.error("Logout failed:", response.data.error);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <ScrollToHashElement />
      <div
        className="global-wrap d-flex flex-column justify-content-between"
        style={{ height: "100vh" }}
      >
        {isAdminLoggedIn == "true" ||
        isStudentLoggedIn == "true" ||
        isSubAdminLoggedIn ? null : (
          <HomeNavbar />
        )}

        <GoToTop />
        <Routes>
          {/* Homepage Routes */}

          <Route
            path="/*"
            element={
              isAdminLoggedIn == "true" ? (
                <Admin toggleAdminIsLoggedOut={toggleAdminIsLoggedOut} />
              ) : isSubAdminLoggedIn == "true" ? (
                <SubAdmin
                  toggleSubAdminIsLoggedOut={toggleSubAdminIsLoggedOut}
                />
              ) : isStudentLoggedIn == "true" ? (
                <Student toggleStudentIsLoggedOut={toggleStudentIsLoggedOut} />
              ) : (
                <React.Suspense
                  fallback={
                    <div className="container d-flex justify-content-center align-items-center">
                      <div className="mx-auto my-3">
                        <RotateLoader
                          color={"#00da36"}
                          loading
                          size={20}
                          aria-label="Loading Spinner"
                          data-testid="loader"
                        />
                        <div className="h4">Loading...</div>
                      </div>
                    </div>
                  }
                >
                  <Homepage />
                </React.Suspense>
              )
            }
          ></Route>
          {/* <Route
            path="/about/mission-vision"
            element={
              isAdminLoggedIn == "true" ? (
                <Admin toggleAdminIsLoggedOut={toggleAdminIsLoggedOut} />
              ) : isSubAdminLoggedIn == "true" ? (
                <SubAdmin
                  toggleSubAdminIsLoggedOut={toggleSubAdminIsLoggedOut}
                />
              ) : isStudentLoggedIn == "true" ? (
                <Student toggleStudentIsLoggedOut={toggleStudentIsLoggedOut} />
              ) : (
                <React.Suspense
                  fallback={
                    <div className="container d-flex justify-content-center align-items-center">
                      <div className="mx-auto my-3">
                        <RotateLoader
                          color={"#00da36"}
                          loading
                          size={20}
                          aria-label="Loading Spinner"
                          data-testid="loader"
                        />
                        <div className="h4">Loading...</div>
                      </div>
                    </div>
                  }
                >
                  <LazyVisionAndMission />
                </React.Suspense>
              )
            }
          ></Route> */}
          {/* <Route
            path="/about/university-seal"
            element={
              isAdminLoggedIn == "true" ? (
                <Admin toggleAdminIsLoggedOut={toggleAdminIsLoggedOut} />
              ) : isSubAdminLoggedIn == "true" ? (
                <SubAdmin
                  toggleSubAdminIsLoggedOut={toggleSubAdminIsLoggedOut}
                />
              ) : isStudentLoggedIn == "true" ? (
                <Student toggleStudentIsLoggedOut={toggleStudentIsLoggedOut} />
              ) : (
                <React.Suspense
                  fallback={
                    <div className="container d-flex justify-content-center align-items-center">
                      <div className="mx-auto my-3">
                        <RotateLoader
                          className="mx-auto my-3"
                          color={"#00da36"}
                          loading
                          size={20}
                          aria-label="Loading Spinner"
                          data-testid="loader"
                        />
                        <div className="h4">Loading...</div>
                      </div>
                      loading
                    </div>
                  }
                >
                  <UniversitySeal />
                </React.Suspense>
              )
            }
          ></Route> */}
          {/* <Route
            path="/about/university-officials"
            element={
              isAdminLoggedIn == "true" ? (
                <Admin toggleAdminIsLoggedOut={toggleAdminIsLoggedOut} />
              ) : isSubAdminLoggedIn == "true" ? (
                <SubAdmin
                  toggleSubAdminIsLoggedOut={toggleSubAdminIsLoggedOut}
                />
              ) : isStudentLoggedIn == "true" ? (
                <Student toggleStudentIsLoggedOut={toggleStudentIsLoggedOut} />
              ) : (
                <React.Suspense
                  fallback={
                    <div className="container d-flex justify-content-center align-items-center">
                      <div className="mx-auto my-3">
                        <RotateLoader
                          className="mx-auto my-3"
                          color={"#00da36"}
                          loading
                          size={20}
                          aria-label="Loading Spinner"
                          data-testid="loader"
                        />
                        <div className="h4">Loading...</div>
                      </div>
                    </div>
                  }
                >
                  <LazyUniversityOfficials />
                </React.Suspense>
              )
            }
          ></Route> */}
          {/* <Route
            path="/about/board-of-regents"
            element={
              isAdminLoggedIn == "true" ? (
                <Admin toggleAdminIsLoggedOut={toggleAdminIsLoggedOut} />
              ) : isSubAdminLoggedIn == "true" ? (
                <SubAdmin
                  toggleSubAdminIsLoggedOut={toggleSubAdminIsLoggedOut}
                />
              ) : isStudentLoggedIn == "true" ? (
                <Student toggleStudentIsLoggedOut={toggleStudentIsLoggedOut} />
              ) : (
                <React.Suspense
                  fallback={
                    <div className="container d-flex justify-content-center align-items-center">
                      <div className="mx-auto my-3">
                        <RotateLoader
                          className="mx-auto my-3"
                          color={"#00da36"}
                          loading
                          size={20}
                          aria-label="Loading Spinner"
                          data-testid="loader"
                        />
                        <div className="h4">Loading...</div>
                      </div>
                    </div>
                  }
                >
                  <LazyBoardOfRegents />
                </React.Suspense>
              )
            }
          ></Route> */}
          {/* <Route
            path="/courses"
            element={
              isAdminLoggedIn == "true" ? (
                <Admin toggleAdminIsLoggedOut={toggleAdminIsLoggedOut} />
              ) : isSubAdminLoggedIn == "true" ? (
                <SubAdmin
                  toggleSubAdminIsLoggedOut={toggleSubAdminIsLoggedOut}
                />
              ) : isStudentLoggedIn == "true" ? (
                <Student toggleStudentIsLoggedOut={toggleStudentIsLoggedOut} />
              ) : (
                <React.Suspense
                  fallback={
                    <div className="container d-flex justify-content-center align-items-center">
                      <div className="mx-auto my-3">
                        <RotateLoader
                          className="mx-auto my-3"
                          color={"#00da36"}
                          loading
                          size={20}
                          aria-label="Loading Spinner"
                          data-testid="loader"
                        />
                        <div className="h4">Loading...</div>
                      </div>
                    </div>
                  }
                >
                  <CoursesOffered />
                </React.Suspense>
              )
            }
          ></Route> */}
          {/* <Route
            path="/total-students"
            element={
              isAdminLoggedIn == "true" ? (
                <Admin toggleAdminIsLoggedOut={toggleAdminIsLoggedOut} />
              ) : isSubAdminLoggedIn == "true" ? (
                <SubAdmin
                  toggleSubAdminIsLoggedOut={toggleSubAdminIsLoggedOut}
                />
              ) : isStudentLoggedIn == "true" ? (
                <Student toggleStudentIsLoggedOut={toggleStudentIsLoggedOut} />
              ) : (
                <React.Suspense
                  fallback={
                    <div className="container d-flex justify-content-center align-items-center">
                      <div className="mx-auto my-3">
                        <RotateLoader
                          className="mx-auto my-3"
                          color={"#00da36"}
                          loading
                          size={20}
                          aria-label="Loading Spinner"
                          data-testid="loader"
                        />
                        <div className="h4">Loading...</div>
                      </div>
                    </div>
                  }
                >
                  <TotalStudents />
                </React.Suspense>
              )
            }
          ></Route> */}
          {/* <Route
            path="/news-and-updates/1"
            element={
              isAdminLoggedIn == "true" ? (
                <Admin toggleAdminIsLoggedOut={toggleAdminIsLoggedOut} />
              ) : isSubAdminLoggedIn == "true" ? (
                <SubAdmin
                  toggleSubAdminIsLoggedOut={toggleSubAdminIsLoggedOut}
                />
              ) : isStudentLoggedIn == "true" ? (
                <Student toggleStudentIsLoggedOut={toggleStudentIsLoggedOut} />
              ) : (
                <React.Suspense
                  fallback={
                    <div className="container d-flex justify-content-center align-items-center">
                      <div className="mx-auto my-3">
                        <RotateLoader
                          className="mx-auto my-3"
                          color={"#00da36"}
                          loading
                          size={20}
                          aria-label="Loading Spinner"
                          data-testid="loader"
                        />
                        <div className="h4">Loading...</div>
                      </div>
                    </div>
                  }
                >
                  <NewsOne />
                </React.Suspense>
              )
            }
          ></Route> */}
          {/* <Route
            path="/news-and-updates/2"
            element={
              isAdminLoggedIn == "true" ? (
                <Admin toggleAdminIsLoggedOut={toggleAdminIsLoggedOut} />
              ) : isSubAdminLoggedIn == "true" ? (
                <SubAdmin
                  toggleSubAdminIsLoggedOut={toggleSubAdminIsLoggedOut}
                />
              ) : isStudentLoggedIn == "true" ? (
                <Student toggleStudentIsLoggedOut={toggleStudentIsLoggedOut} />
              ) : (
                <React.Suspense
                  fallback={
                    <div className="container d-flex justify-content-center align-items-center">
                      <div className="mx-auto my-3">
                        <RotateLoader
                          className="mx-auto my-3"
                          color={"#00da36"}
                          loading
                          size={20}
                          aria-label="Loading Spinner"
                          data-testid="loader"
                        />
                        <div className="h4">Loading...</div>
                      </div>
                    </div>
                  }
                >
                  <NewsTwo />
                </React.Suspense>
              )
            }
          ></Route>
          <Route
            path="/news-and-updates/3"
            element={
              isAdminLoggedIn == "true" ? (
                <Admin toggleAdminIsLoggedOut={toggleAdminIsLoggedOut} />
              ) : isSubAdminLoggedIn == "true" ? (
                <SubAdmin
                  toggleSubAdminIsLoggedOut={toggleSubAdminIsLoggedOut}
                />
              ) : isStudentLoggedIn == "true" ? (
                <Student toggleStudentIsLoggedOut={toggleStudentIsLoggedOut} />
              ) : (
                <React.Suspense
                  fallback={
                    <div className="container d-flex justify-content-center align-items-center">
                      <div className="mx-auto my-3">
                        <RotateLoader
                          className="mx-auto my-3"
                          color={"#00da36"}
                          loading
                          size={20}
                          aria-label="Loading Spinner"
                          data-testid="loader"
                        />
                        <div className="h4">Loading...</div>
                      </div>
                    </div>
                  }
                >
                  <NewsThree />
                </React.Suspense>
              )
            }
          ></Route>
          <Route
            path="/campus-history"
            element={
              isAdminLoggedIn == "true" ? (
                <Admin toggleAdminIsLoggedOut={toggleAdminIsLoggedOut} />
              ) : isSubAdminLoggedIn == "true" ? (
                <SubAdmin
                  toggleSubAdminIsLoggedOut={toggleSubAdminIsLoggedOut}
                />
              ) : isStudentLoggedIn == "true" ? (
                <Student toggleStudentIsLoggedOut={toggleStudentIsLoggedOut} />
              ) : (
                <React.Suspense
                  fallback={
                    <div className="container d-flex justify-content-center align-items-center">
                      <div className="mx-auto my-3">
                        <RotateLoader
                          className="mx-auto my-3"
                          color={"#00da36"}
                          loading
                          size={20}
                          aria-label="Loading Spinner"
                          data-testid="loader"
                        />
                        <div className="h4">Loading...</div>
                      </div>
                    </div>
                  }
                >
                  <CampusHistory />
                </React.Suspense>
              )
            }
          ></Route> */}
          <Route
            path="/login"
            element={
              isAdminLoggedIn == "true" ? (
                <Admin toggleAdminIsLoggedOut={toggleAdminIsLoggedOut} />
              ) : isSubAdminLoggedIn == "true" ? (
                <SubAdmin
                  toggleSubAdminIsLoggedOut={toggleSubAdminIsLoggedOut}
                />
              ) : isStudentLoggedIn == "true" ? (
                <Student toggleStudentIsLoggedOut={toggleStudentIsLoggedOut} />
              ) : (
                <React.Suspense
                  fallback={
                    <div className="container d-flex justify-content-center align-items-center">
                      <div className="mx-auto my-3">
                        <RotateLoader
                          className="mx-auto my-3"
                          color={"#00da36"}
                          loading
                          size={20}
                          aria-label="Loading Spinner"
                          data-testid="loader"
                        />
                        <div className="h4">Loading...</div>
                      </div>
                    </div>
                  }
                >
                  <LazyStudentLogin />
                </React.Suspense>
              )
            }
          ></Route>
          <Route
            path="/signup"
            element={
              isAdminLoggedIn == "true" ? (
                <Admin toggleAdminIsLoggedOut={toggleAdminIsLoggedOut} />
              ) : isSubAdminLoggedIn == "true" ? (
                <SubAdmin
                  toggleSubAdminIsLoggedOut={toggleSubAdminIsLoggedOut}
                />
              ) : isStudentLoggedIn == "true" ? (
                <Student toggleStudentIsLoggedOut={toggleStudentIsLoggedOut} />
              ) : (
                <React.Suspense
                  fallback={
                    <div className="container d-flex justify-content-center align-items-center">
                      <div className="mx-auto my-3">
                        <RotateLoader
                          className="mx-auto my-3"
                          color={"#00da36"}
                          loading
                          size={20}
                          aria-label="Loading Spinner"
                          data-testid="loader"
                        />
                        <div className="h4">Loading...</div>
                      </div>
                    </div>
                  }
                >
                  <LazyStudentSignupPage />
                </React.Suspense>
              )
            }
          />
          <Route
            path="/forgot-password"
            element={
              isAdminLoggedIn == "true" ? (
                <Admin toggleAdminIsLoggedOut={toggleAdminIsLoggedOut} />
              ) : isSubAdminLoggedIn == "true" ? (
                <SubAdmin
                  toggleSubAdminIsLoggedOut={toggleSubAdminIsLoggedOut}
                />
              ) : isStudentLoggedIn == "true" ? (
                <Student toggleStudentIsLoggedOut={toggleStudentIsLoggedOut} />
              ) : (
                <React.Suspense
                  fallback={
                    <div className="container d-flex justify-content-center align-items-center">
                      <div className="mx-auto my-3">
                        <RotateLoader
                          className="mx-auto my-3"
                          color={"#00da36"}
                          loading
                          size={20}
                          aria-label="Loading Spinner"
                          data-testid="loader"
                        />
                        <div className="h4">Loading...</div>
                      </div>
                    </div>
                  }
                >
                  <ForgotPass />
                </React.Suspense>
              )
            }
          />
          <Route
            path="/login"
            element={
              isAdminLoggedIn == "true" ? (
                <Admin toggleAdminIsLoggedOut={toggleAdminIsLoggedOut} />
              ) : isSubAdminLoggedIn == "true" ? (
                <SubAdmin
                  toggleSubAdminIsLoggedOut={toggleSubAdminIsLoggedOut}
                />
              ) : isStudentLoggedIn == "true" ? (
                <Student toggleStudentIsLoggedOut={toggleStudentIsLoggedOut} />
              ) : (
                <React.Suspense
                  fallback={
                    <div className="container d-flex justify-content-center align-items-center">
                      <div className="mx-auto my-3">
                        <RotateLoader
                          className="mx-auto my-3"
                          color={"#00da36"}
                          loading
                          size={20}
                          aria-label="Loading Spinner"
                          data-testid="loader"
                        />
                        <div className="h4">Loading...</div>
                      </div>
                    </div>
                  }
                >
                  <LazyStudentLogin />
                </React.Suspense>
              )
            }
          ></Route>

          {/* Sub Admin Routes */}
          <Route
            path="/subAdmin/*"
            element={
              isAdminLoggedIn == "true" ? (
                <Admin toggleAdminIsLoggedOut={toggleAdminIsLoggedOut} />
              ) : isSubAdminLoggedIn == "true" ? (
                <SubAdmin
                  toggleSubAdminIsLoggedOut={toggleSubAdminIsLoggedOut}
                />
              ) : isStudentLoggedIn == "true" ? (
                <Student toggleStudentIsLoggedOut={toggleStudentIsLoggedOut} />
              ) : (
                <Forbidden403 />
              )
            }
          />
          <Route
            path="/dashboard-admin"
            element={
              isStudentLoggedIn == "true" ? (
                <DashboardAdmin />
              ) : (
                <Forbidden403 />
              )
            }
          ></Route>
          {/* Admin Routes */}
          <Route
            path="/admin/*"
            element={
              isAdminLoggedIn == "true" ? (
                <Admin toggleAdminIsLoggedOut={toggleAdminIsLoggedOut} />
              ) : isSubAdminLoggedIn == "true" ? (
                <SubAdmin
                  toggleSubAdminIsLoggedOut={toggleSubAdminIsLoggedOut}
                />
              ) : isStudentLoggedIn == "true" ? (
                <Student toggleStudentIsLoggedOut={toggleStudentIsLoggedOut} />
              ) : (
                <Forbidden403 />
              )
            }
          />
          <Route
            path="/dashboard-admin"
            element={
              isAdminLoggedIn == "true" ? <DashboardAdmin /> : <Forbidden403 />
            }
          ></Route>

          {/* Student Routes */}

          <Route
            path="/student/*"
            element={
              isStudentLoggedIn == "true" ? (
                <Student toggleStudentIsLoggedOut={toggleStudentIsLoggedOut} />
              ) : (
                <Forbidden403 />
              )
            }
          />
          <Route path="/session-expired" element={<AuthExpired />} />
        </Routes>
        {isAdminLoggedIn == "true" ||
        isStudentLoggedIn == "true" ||
        isSubAdminLoggedIn == "true" ? null : (
          <ScrollToTop />
        )}
        {isAdminLoggedIn == "true" ||
        isStudentLoggedIn == "true" ||
        isSubAdminLoggedIn == "true" ? null : (
          <HomeFooter />
        )}
      </div>
    </>
  );
}
