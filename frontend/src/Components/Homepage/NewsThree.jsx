import CampusImage1 from "../../Assets/campus-8.webp";
import Breadcrumb from "react-bootstrap/Breadcrumb";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDoubleRight } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import "../../styles.css";
export default function NewsThree() {
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
              News & Updates
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </div>
      <div className="container py-5 text-center">
        <div className="h1 fw-bold news" style={{ color: "#097000" }}>
          CVSU-TRECE MARTIRES CITY CAMPUS DREAMS TO BECOME A S.M.A.R.T CAMPUS
        </div>

        <div className="lead mt-5 text-justify indent">
          Dr. Khenilyn Lewis, Chairperson of the Department of Information
          Technology, and Mr. Keno Villavicencio an I.T Professor announced that
          CvSU Trece Martires City Campus aims to be a SMART Campus in the next
          two years.
        </div>
        <div className="lead mt-4 text-justify indent">
          During the meeting conducted last January 21, 2021, in planning to put
          up a project that could benefit both the CvSU-TMC and the students of
          it, with the assistance of computer programmers; Ms. Julie Ann Bucog
          and Mr. John Aldrin Palarpalar. Dr. Khenny and Mr. Keno had planned
          this huge project that will make the CvSU-Trece Martires City Campus
          turn into a smart campus to accommodate many students since we’re in
          the pandemic days and the education are synchronous and asynchronous
          class. The first component of this planning project is System
          Automation, which includes establishing the CvSU-TMCC's website and
          handling all campus transactions such as the campus information
          system; student portal; faculty hub; and other transactions, in
          particular, of applications, admissions, enrollments, registrations,
          and payments. The second is an online class, which will be continued
          but only visible on lecture days; conversely, the laboratory will be
          done on campus; and the last components; state-of-the-art facilities,
          where some of the classrooms in the new building will become smart
          classrooms that will be used for Computer Software Laboratory;
          Hardware Laboratory, and an Entrepreneurial Center and Makers Space
          (product development center). Additionally, a solar panel-based
          laboratory, paperless transaction, because tons of paper were being
          used whenever a transaction was made for both students and faculty
          members, and these files of paper were becoming a big waste. Also, it
          has a Web-based negotiation where all paper-based arrangements can be
          done in the CvSU Trece web system. Furthermore, as a response to this
          Covid-19 pandemic to lessen the interaction that happens inside the
          campus whenever the student claiming their documents. This large
          project together with the help of the two programmers and our
          supportive dean Prof. Noel A. Sedigo can be done soon, and the Cavite
          State University-Trece Martires City Campus will be SMART.
        </div>
        <div className="lead mt-4 text-justify indent">
          This idea that turns into a project will help to accommodate many
          students with the help of Smart CvSU-Trece Martires City Campus in
          achieving their goals all along.
        </div>
      </div>
    </>
  );
}
