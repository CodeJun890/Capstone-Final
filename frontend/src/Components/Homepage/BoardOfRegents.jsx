import CampusImage1 from "../../Assets/campus-8.webp";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import Table from "react-bootstrap/Table";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDoubleRight } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import "../../styles.css";
function BoardOfRegents() {
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
            <Breadcrumb.Item className="text-light ms-2" active>
              Board of Regents
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </div>
      <div className="container py-5 text-center">
        <div className="h1 fw-bold news mb-5" style={{ color: "#097000" }}>
          BOARD OF REGENTS
        </div>

        <Table className="my-5" striped bordered hover>
          <thead>
            <tr>
              <th className="fw-bold h5">NAME</th>
              <th className="fw-bold h5">POSITION OR DESIGNATION</th>
            </tr>
          </thead>
          <tbody className="text-start">
            <tr>
              <td>HON. LILIAN A. DE LAS LLAGAS</td>
              <td>Chairperson, CvSU Board of Regents</td>
            </tr>
            <tr>
              <td>HON. HERNANDO D. ROBLES</td>
              <td>Vice Chairperson President, Cavite State University</td>
            </tr>
            <tr>
              <td>HON. JOEL VILLANUEVA</td>
              <td>
                Member, CvSU Board of Regents,<br></br> Chairman, Senate
                Committee on Higher, <br></br>Technical, and Vocational
                Education<br></br>
                <br></br>Represented by:<br></br>
                <span className="fw-bold">HON. GILBERT CESAR C. REMULLA</span>
              </td>
            </tr>
            <tr>
              <td>HON. MARK O. GO</td>
              <td>
                Member, CvSU Board of Regents,<br></br> Chairman, Senate
                Committee on Higher, <br></br>and Technical Education<br></br>
                <br></br>Represented by:<br></br>
                <span className="fw-bold">HON. GILBERT CESAR C. REMULLA</span>
              </td>
            </tr>
            <tr>
              <td>HON. LUIS G. BANUA</td>
              <td>
                Member, CvSU Board of Regents, <br></br>Director, NEDA Region
                IV-A
              </td>
            </tr>
            <tr>
              <td>HON. ALEXANDER R. MADRIGAL</td>
              <td>
                Member, CvSU Board of Regents,<br></br> Director, DOST Region
                IV-A
              </td>
            </tr>
            <tr>
              <td>HON. ARNEL V. DE MESA</td>
              <td>
                Member, CvSU Board of Regents,<br></br> Director, DA Region IV-A
              </td>
            </tr>
            <tr>
              <td>HON. NOELLE T. LEGASPI</td>
              <td>
                Member, CvSU Board of Regents,<br></br> President (Ad Interim),
                Alumni Associations
              </td>
            </tr>
            <tr>
              <td>HON. GIL D. RAMOS</td>
              <td>
                Member, CvSU Board of Regents,<br></br>President, Faculty
                Association
              </td>
            </tr>
            <tr>
              <td>HON. EDILBERTO R. SILAN</td>
              <td>
                Member, CvSU Board of Regents,<br></br> Private Sector
                Representative
              </td>
            </tr>
            <tr>
              <td>MS. CATHERINE J. QUIÑONES</td>
              <td>Board Secretary V</td>
            </tr>
          </tbody>
        </Table>
      </div>
    </>
  );
}

export default BoardOfRegents;
