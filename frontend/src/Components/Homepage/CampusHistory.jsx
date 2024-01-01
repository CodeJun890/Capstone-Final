import CampusImage1 from "../../Assets/campus-8.webp";
import Breadcrumb from "react-bootstrap/Breadcrumb";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDoubleRight } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import "../../styles.css";
export default function CampusHistory() {
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
              Campus History
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </div>
      <div className="container py-5 text-center">
        <div className="h1 fw-bold news" style={{ color: "#097000" }}>
          HISTORY OF THE CAMPUS
        </div>

        <div className="lead mt-5 text-justify indent">
          The Cavite State University (CvSU)-Trece Martires City Campus was
          established through a Memorandum of Agreement signed between the
          University, represented by Dr. Ruperto S. Sangalang (President) and
          Trece Martires City Local Government Unit represented by Mayor
          Melencio L. De Sagun, Jr. (City Mayor) on May 18, 2005. The CvSU Board
          of Regents confirm the operation of the campus through BOR Resolution
          No. 41, s. 2005.
        </div>
        <div className="lead mt-4 text-justify indent">
          The CvSU – Trece Martires City Campus started to offer curricular
          programs in AY 2005-2006. The Campus is in Brgy. Osorio, Trece
          Martires City with Dr. Alexander F. Ferre as the Campus Dean. For the
          first school year of the Campus operation, there were 19 students
          enrolled from first semester AY 2005-2006 under the following
          curricular offerings: Associate in Computer Secretarial (7), Diploma
          in Computer Technician (8) and Diploma in Hotel and Restaurant
          Management (4) students. In AY 2006-2007, the campus offered
          additional three (3) degree programs: Bachelor of Science in Business
          Management, Bachelor of Science in Information Technology, and
          Bachelor of Science in Hotel and Restaurant Management. There were 52
          students enrolled for first semester AY 2006-2007. Dr. Ferre aimed to
          transfer the Campus at the city proper to increase its enrollment.
        </div>
        <div className="lead mt-4 text-justify indent">
          Dr. Ferre’s goal was succeeded by Mr. Isaac V. Mahinay in April 2006,
          when he was designated as the new Dean of the Campus. Through the
          continuous communication with the City Mayor, the Campus was given two
          rooms at the Loren Building beside the City Hall and computer
          laboratory located at the City Terminal. The said laboratory was
          utilized as the Computer Learning Center of the Campus to cater the
          need for tertiary education of the youth and under privileged sector
          through an extension program. In August 2007, Dr. Celso S. Crucido was
          designated as the new Campus Dean. Dr. Crucido also aimed to increase
          the campus enrollment through the cooperation to all faculty members
          and staff. On September 30, 2008, the first woman dean of CvSU - Trece
          Martires City Campus was designated. Dr. Ma. Corazon Y. Mercado, was
          formerly the head of Monitoring and Evaluation and Special Projects
          Coordinator of CvSU-Rosario. Her vision was for CvSU- Trece Martires
          City Campus to be a diverse institution whose faculty, staff, and
          students shall have a meaningful and far-reaching impact in
          information technology, profession, and society. Dr. Mercado also
          envisioned CvSU- Trece Martires City Campus to be a center of
          excellence in values education through the promotion of civic
          consciousness and holistic development of individuals to become
          productive members of the society.
        </div>
        <div className="lead mt-4 text-justify indent">
          In 2008, through the joint efforts of former deans Dr. Ferre, Dr.
          Crucido and Dr. Mercado, the CvSU – Trece Martires City Campus
          transferred to a very strategic location in Brgy. Luciano, Trece
          Martires City. In 2009, CvSU Trece Martires City Campus transferred to
          a new campus site, from Brgy. Luciano to Brgy. San Agustin located
          inside the compound of Trece Martires City Hall. The Campus utilized
          the Loren Building with 4 lecture rooms, 1 reading room, and 1 science
          laboratory. The adjacent rooms of the City Health Center were utilized
          as the Administration Building, HRM Laboratory and HRM Lecture Room.
          The year 2011 was characterized by many challenges yet another
          fruitful year for CvSU-Trece Martires City Campus. A one-hectare lot
          was donated by the city government to Cavite State University through
          the initiative of Mayor Melencio A. De Sagun Jr. But the first quarter
          of the year marked the loss of its campus dean, Dr. Ma. Corazon Y.
          Mercado, who for a time fought but did not survived cancer. Thus,
          resulted to the appointment of Dr. Reynaldo E. Samonte as the
          Officer–in-Charge of the campus until July 2011 when Prof. Cristina M.
          Signo took over as the new Campus Dean. Through the leadership of
          Prof. Signo, a 2-storey temporary building with 10 classrooms was
          donated to the University by Governor Juanito Victor C. Remulla, Jr.
          in 2013.
        </div>
        <div className="lead mt-4 text-justify indent">
          In July 2014, Dr. Gilchor P. Cubillo, was assigned as the new dean of
          the campus. During his administration, the campus rented a space at
          the Magno Building located at the heart of the Trece Martires City in
          Brgy. San Agustin to accommodate the increasing student population. In
          July 2015, Prof. Cristina M. Signo, was reassigned as the Dean of
          CvSU-Trece Martires City Campus adjacent to her position at the Gen.
          Trias City and Tanza Campuses. During her administration, the campus
          submitted the 3 curricular program offerings of the campus for CHED
          RQuAT validation in which the Bachelor of Science in Business
          Management received its Government Recognition. The Campus was then
          headed by Dr. Lynn G. Penales, the former dean of the College of Arts
          and Sciences in November 2016. Dr. Penales is also the campus dean of
          CvSU General Trias and Tanza Campuses. In her administration, the
          campus fully transferred to the rented spaces at the Magno Building
          because the City Vice Mayor will occupy the space in the city hall
          compound. In July 2017, the campus passed the AACCUP Preliminary
          Survey Visit for BS Business Management and BS Hotel and Restaurant
          Management. In November 2017, the Vice President for Academic Affairs
          Dr. Camilo A. Polinga took over as the campus officer in charge
          because of the unexpected maternity leave of Dr. Penales. In January
          2018, Prof. Noel A. Sedigo, from the College of Forestry Environment
          and Natural Resources, was assigned the new Campus Dean of CvSU- Trece
          Martires City, Tanza, and General Trias City Campuses (T3 Campus).
          During the leadership of Prof. Sedigo, the three campuses were
          rationalized into one campus in terms of unified administration and
          rationalization of curricular program offerings. The CvSU-Trece
          Martires City Campus offered additional 3 degree programs namely
          Bachelor of Science in Psychology, Bachelor of Science in Office
          Administration and Bachelor of Secondary Education major in English in
          AY 2018-2019.
        </div>
        <div className="lead mt-4 text-justify indent">
          In the same year, from the rented space at the Magno Building, the
          campus transferred to the donated 1-hectare lot with 2-storey building
          in Brgy. Gregorio. In November 2019, the campus passed the AACCUP
          Level I accreditation for BS Business Management and BS Hospitality
          Management (formerly Hotel and Restaurant Management) and Preliminary
          Survey Visit for BS Information Technology. In 2020, the construction
          of the new 2-storey building funded by the University and construction
          of concrete access road by the Trece Martires City local government
          through the leadership of Hon. Gemma B. Lubigan (City Mayor) was
          started. In the same year, the campus passed the AACCUP Level I
          accreditation for BS Information Technology. In 2021, the campus
          became an independent campus from T3 Campus still under the leadership
          of Prof. Sedigo who envisioned the campus to be a S.M.A.R.T. Campus:
          Sustainably-Managed Accessible and Resource-based Technology Campus.
        </div>
      </div>
    </>
  );
}
