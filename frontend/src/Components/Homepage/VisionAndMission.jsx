import CampusImage1 from "../../Assets/campus-8.webp";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDoubleRight } from "@fortawesome/free-solid-svg-icons";
import { faFlag } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import "../../styles.css";

function VisionAndMission() {
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
              Vision & Mission
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </div>
      <div className="container py-5 text-center">
        <div className="h1 fw-bold news" style={{ color: "#097000" }}>
          VISION, MISSION, GOALS, AND OBJECTIVES
        </div>
        <div className="row py-5 justify-content-center">
          <div className="col-12 col-md-4 ms-3 mt-3 shadow py-3">
            <FontAwesomeIcon
              icon={faFlag}
              className="fa text-success"
              style={{ fontSize: "1.25rem" }}
            />
            <div className="display-6">University Vision</div>
            <p className="lead">
              The premier university in historic Cavite globally recognized for excellence in character development, academics, research, innovation and sustainable community engagement
            </p>
          </div>
          <div className="col-12 col-md-4 ms-3 mt-3 shadow py-3">
            <FontAwesomeIcon
              icon={faFlag}
              className="fa text-success"
              style={{ fontSize: "1.25rem" }}
            />
            <div className="display-6">University Mission</div>
            <p className="lead">
              Cavite State University shall provide excellent, equitable, and
              relevant educational opportunities in the arts, sciences, and
              technology through quality instruction and relevant research and development activities. It shall produce professional, skilled and morally upright individuals for global competitiveness
            </p>
          </div>
        </div>
      </div>
      <div className="container mb-5">
        <div className="display-6 fw-light">Quality Policy</div>
        <div className="lead mt-5">
          We Commit to the highest standards of education, value our
          stakeholders, Strive for continual improvement of our products and
          services, and Uphold the University's tenets of Truth, Excellence, and
          Service to produce globally competitive and morally upright
          individuals.
        </div>
      </div>

      <div className="objective lg-shadow">
        <div className="container text-start py-5">
          <div className="display-6 mb-2">University Objectives</div>
          <div className="lead">
            In addition to, and in support of its mission and policies embodied
            in the charter, the University shall:
          </div>
          <ol className="lead mt-2">
            <li>
              Provide a general education program that will promote national
              identity, cultural consciousness, moral integrity and spiritual
              vigor;
            </li>
            <li>
              Train the nation's manpower in the skills required by the national
              development;
            </li>
            <li>
              Develop professions that will provide leadership for the nation;
              and
            </li>
            <li>
              Advance knowledge through research work and apply new knowledge
              for improving the quality of human life and responding effectively
              to changing societal needs and conditions.
            </li>
          </ol>
        </div>
      </div>

      <div className="container pb-5">
        <div className="display-6 mb-2">Campus Goals</div>
        <div className="lead">
          The Campus shall endeavor to achieve the following goals:
        </div>
        <ol className="lead">
          <li>
            Provide high quality instruction in order to produce skilled,
            morally upright, and globally competitive graduates;
          </li>
          <li>
            Develop and pursue advanced research abilities through arts,
            sciences, and technology to support instruction; and
          </li>
          <li>
            Develop and conduct extension activities that will empower local
            people and communities
          </li>
        </ol>
      </div>
    </>
  );
}

export default VisionAndMission;
