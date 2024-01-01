import CampusImage1 from "../../Assets/campus-8.webp";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import Table from "react-bootstrap/Table";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDoubleRight } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import "../../styles.css";
export default function CoursesOffered() {
  return (
    <>
      <div className="banner-item">
        <div
          className="image-overlay-vision-mission"
          style={{ backgroundImage: `url(${CampusImage1})` }}
        ></div>
        <div className="breadcrumb-container">
          <div className="h2 fw-bold text-light">
            Cavite State University Trece Campus
          </div>
          <Breadcrumb>
            <Link to="/" className=" me-2">
              Home
            </Link>
            <FontAwesomeIcon
              icon={faAngleDoubleRight}
              className="fas fa-angle-double-right"
              style={{ fontSize: "1.25rem" }}
            />
            <Breadcrumb.Item className=" text-light ms-2" active>
              Programs Offered
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </div>
      <div className="container py-5 text-center">
        <div className="h1 fw-bold news" style={{ color: "#097000" }}>
          PROGRAMS OFFERED
        </div>
        <Table className="my-5" striped bordered hover>
          <thead>
            <tr className="text-center">
              <th className="fw-bold h5">CURRICULAR PROGRAM</th>
              <th className="fw-bold h5">PROGRAM APPROVAL</th>
            </tr>
          </thead>
          <tbody className="text-start">
            <tr>
              <td>Bachelor of Science in Business Management</td>
              <td>BOR No. 41, s 2005</td>
            </tr>
            <tr>
              <td>
                Bachelor of Science in Hospitality Management (previously Hotel
                & Restaurant Management)
              </td>
              <td>BOR No. 41, s 2005</td>
            </tr>
            <tr>
              <td>Bachelor of Science in Information Technology</td>
              <td>BOR No. 41, s 2005</td>
            </tr>
            <tr>
              <td>Bachelor of Science in Psychology</td>
              <td>
                CvSU Main Learning Center Approved proposal for independent
                offering by the University Academic Council (21 July 2021)
                Scheduled for presentation on the next BOR meeting
              </td>
            </tr>
          </tbody>
        </Table>
      </div>
    </>
  );
}
