import CampusImage1 from "../../Assets/campus-8.webp";
import Breadcrumb from "react-bootstrap/Breadcrumb";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDoubleRight } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import "../../styles.css";

import CampusSilang from "../../Assets/campus-silang.webp";
import CampusTanza from "../../Assets/campus-tanza.webp";
import CampusNaic from "../../Assets/campus-naic.webp";
import CampusMaragondon from "../../Assets/campus-maragondon.webp";
import CampusImus from "../../Assets/campus-imus.webp";
import CampusGentri from "../../Assets/campus-gentri.webp";
import CampusCCAT from "../../Assets/campus-ccat.webp";
import CampusCaviteCity from "../../Assets/campus-cavite-city.webp";
import CampusCarmona from "../../Assets/campus-carmona.webp";
import CampusBacoor from "../../Assets/campus-bacoor.webp";
import CampusTrece from "../../Assets/news-2.webp";

export default function Campuses() {
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
              Branch Campuses
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </div>
      <div className="container py-5 text-center">
        <div className="h1 fw-bold news" style={{ color: "#097000" }}>
          SATELLITE CAMPUSES
        </div>
        <div className="row my-5 py-5 justify-content-center">
          <div className="col-12 col-lg-4 col-md-6 mt-3">
            <div
              className="card-container"
              style={{ backgroundImage: `url(${CampusSilang})` }}
            ></div>
          </div>
          <div className="col-12 col-lg-4 col-md-6 mt-3">
            <div
              className="card-container"
              style={{ backgroundImage: `url(${CampusTrece})` }}
            ></div>
          </div>
          <div className="col-12 col-lg-4 col-md-6 mt-3">
            <div
              className="card-container"
              style={{ backgroundImage: `url(${CampusCaviteCity})` }}
            ></div>
          </div>
          <div className="col-12 col-lg-4 col-md-6 mt-3">
            <div
              className="card-container"
              style={{ backgroundImage: `url(${CampusTanza})` }}
            ></div>
          </div>
          <div className="col-12 col-lg-4 col-md-6 mt-3">
            <div
              className="card-container"
              style={{ backgroundImage: `url(${CampusImus})` }}
            ></div>
          </div>
          <div className="col-12 col-lg-4 col-md-6 mt-3">
            <div
              className="card-container"
              style={{ backgroundImage: `url(${CampusBacoor})` }}
            ></div>
          </div>
          <div className="col-12 col-lg-4 col-md-6 mt-3">
            <div
              className="card-container"
              style={{ backgroundImage: `url(${CampusNaic})` }}
            ></div>
          </div>
          <div className="col-12 col-lg-4 col-md-6 mt-3">
            <div
              className="card-container"
              style={{ backgroundImage: `url(${CampusGentri})` }}
            ></div>
          </div>
          <div className="col-12 col-lg-4 col-md-6 mt-3">
            <div
              className="card-container"
              style={{ backgroundImage: `url(${CampusCCAT})` }}
            ></div>
          </div>
          <div className="col-12 col-lg-4 col-md-6 mt-3">
            <div
              className="card-container"
              style={{ backgroundImage: `url(${CampusCarmona})` }}
            ></div>
          </div>
          <div className="col-12 col-lg-4 col-md-6 mt-3">
            <div
              className="card-container"
              style={{ backgroundImage: `url(${CampusMaragondon})` }}
            ></div>
          </div>
        </div>
      </div>
    </>
  );
}
