import CampusImage1 from "../../Assets/campus-8.webp";
import CampusSeal from "../../Assets/cvsu-seal.webp";
import Breadcrumb from "react-bootstrap/Breadcrumb";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDoubleRight } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import "../../styles.css";
export default function UniversitySeal() {
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
              University Seal & Hymn
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </div>
      <div className="container py-5 text-center">
        <div className="h1 fw-bold news mb-5" style={{ color: "#097000" }}>
          UNIVERSITY SEAL
        </div>
        <img src={CampusSeal} className="mt-3" alt="Campus-Seal" />
        <div className="university-seal-text">
          <div className="lead mt-3 text-start mb-3">
            The shape of the seal shall be square with one-third of its angles
            cut to form its base. It shall assume the shape of a space of a
            space capsule. The dominant colors of the University Seal are green
            and gold. The words "Cavite State University", Cavite , Philippines,
            1906" are written in gold against a dark green background around the
            periphery of the seal.
          </div>

          <ol className="lead text-start">
            <li>
              The University Seal, the CvSU Seal is composed of interactive
              elements that represent the vision, thrusts, and programs of the
              University.
            </li>
            <li>
              The book and the torch at the center of the seal symbolizes
              knowledge and wisdom. It also represents education, the humanities
              and other social science programs of the University.
            </li>
            <li>
              The coffee twig with ripe berries at the right hand side of the
              book with torch symbolizes the major agricultural thrusts of the
              Province of Cavite. It also represents the agriculture and related
              programs of the University.
            </li>
            <li>
              The atomic structure at the left hand side of the book represents
              the science programs, and more importantly, the scientific
              research undertakings of the University.
            </li>
            <li>
              The gear at the bottom of the book with torch symbolizes
              engineering and technology programs of the University.
            </li>
            <li>
              The University Seal the figure 1906 written in gold against a dark
              green background placed below was the year CvSU had its humble
              beginnings as an intermediate school established in Indang,
              Cavite. The background for all elements is light green. The
              trilogy of functions of the University, which is instruction,
              research and extension, are symbolized by the over-all triangular
              shape of the seal.
            </li>
            <li>
              The flame of the torch is designed as "CvSU" which is adopted
              acronym of the Cavite State University. The Flame symbolizes the
              enduring and everlasting flame that will guide the University in
              its search for truth.
            </li>
          </ol>
        </div>
      </div>

      <div className="container container-hymn">
        <iframe
          width="560"
          height="315"
          src="https://www.youtube.com/embed/A2fOWAo9jME"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        ></iframe>
      </div>
      <div className="hymn-text w-100 text-center pb-5">
        <div
          className="display-6 mb-5 fw-bold news"
          style={{ color: "#097000" }}
        >
          UNIVERSITY HYMN
        </div>
        <div className="hymn-lyrics mx-auto">
          <div className="lead">
            Hail Alma Mater Dear CvSU all the way through Seat of hope that we
            dream of Under the sky so blue
          </div>
          <div className="lead">
            Verdant fields God’s gift to you Open our lives a new Oh, our
            hearts, our hands, our minds, too In your bossom thrive and grow.
          </div>
          <div className="lead">
            Seeds of hope are now in bloom Vigilant sons to you have sworn To
            CvSU our faith goes on Cradle of hope and bright vision.
          </div>
          <div className="lead">
            These sturdy arms that care Are the nation builders Blessed with
            strength and power To our Almighty we offer.
          </div>
          <div className="lead">
            We Pray for CvSU God’s Blessing be with you You’re the master, we’re
            the builders CvSU leads forever.
          </div>
        </div>
      </div>
    </>
  );
}
