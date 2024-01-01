import { useState } from "react";
import CampusImage1 from "../../Assets/campus-8.webp";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import Card from 'react-bootstrap/Card';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDoubleRight } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import "../../styles.css";
import BarChart from "./BarChart";
import { UserData } from "./Data";
export default function TotalStudents() {
    const [userData, setUserData] = useState({
        responsive: "true",
        labels: UserData.map((data) => data.program),
        datasets: [
          {
            label: "Total Students",
            data: UserData.map((data) => data.total),
            backgroundColor: [
              "brown",
              "rgba(75,192,192,1)",
              "green",
              "#f3ba2f",
              "#50AF95",
              "#2a71d0",
            ],
            borderColor: "black",
            borderWidth: 2,
          },
        ],
        options: {
          responsive: true,
          maintainAspectRatio: true,
          aspectRatio: 2
        }
      });
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
              Total Students
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </div>
      <div className="container-fluid d-flex flex-column align-items-center justify-content-center py-5">
        <div className="row text-center justify-content-center align-items-center">
            <div className="display-6 fw-bold text-success">Cavite State University</div>
            <div className="h4">Trece Martires City Campus</div>
            <div className="h5 pb-3">Summary of Enrollment</div>
            <div className="col-lg-6 d-flex flex-column justify-content-center align-items-center">
                <div className="h1 pb-5">Students Graph</div>
                <div style={{ position: "relative", height: "auto", width: "50vw" }} id="chart">
                    <BarChart chartData={userData} options={userData.options} />
                </div>  
            </div>
        </div>
      </div>
    </>
  );
}
