import AOS from "aos";
import Accordion from "react-bootstrap/Accordion";

import StudentHandbook from "../../Assets/student-handbook.png";
import PairProgrammer from "../../Assets/pair-computer.svg";
import Automated from "../../Assets/automated.png";
import FastAccess from "../../Assets/fast-access.png";
import DataAccess from "../../Assets/data-access.png";
import CvSULogo from "../../Assets/cvsu-icon.webp";

import { Link } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faCircleQuestion } from "@fortawesome/free-solid-svg-icons";

import "../../styles.css";
import { useEffect } from "react";

export function HomeBody() {
  useEffect(() => {
    AOS.init({ duration: 2000 });
  }, []);

  return (
    <>
      <section id="intro" className="py-5" data-aos="fade-down">
        <div className="container-lg">
          <div className="row justify-content-center align-items-center">
            <div className="col-md-6 text-center text-md-start">
              <h1>
                <div className="display-4 fw-bold">
                  Discipline Recommender System
                </div>
                <div className="h4 text-muted">
                  Cavite State University - Trece Martires Campus
                </div>
              </h1>
              <p className="lead">
                Streamlined system for monitoring, reporting, and enhancing
                campus discipline
              </p>
              <Link to="/signup" className="btn btn-success">
                Get started
              </Link>
            </div>
            <div className="col-md-6 text-center d-none d-md-block">
              <img
                src={StudentHandbook}
                className="img-fluid"
                alt="student handbook cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section
        id="about"
        className="py-5 mb-5"
        style={{ background: "#B6BBC4" }}
      >
        <div className="container-lg">
          <div className="row justify-content-center align-items-center">
            <div className="col-md-5 d-none d-md-block" data-aos="fade-right">
              <img
                src={PairProgrammer}
                className="img-fluid"
                alt="solution image"
              />
            </div>
            <div
              className="col-md-5 ms-0 ms-md-5 text-center text-md-start py-3"
              data-aos="fade-left"
            >
              <div className="h1 text-uppercase fw-bold">Campus Safety</div>
              <h4 className="mt-2">
                Keeping our campus safe and respectful is tough when we can't
                easily track and handle student misbehavior, from small issues
                to more serious ones.
              </h4>
              <div className="lead mt-3">
                Imagine incidents like students entering restricted areas
                without permission or cases of bullying. Traditional ways of
                dealing with these often mean slow responses and not fully
                understanding what's really going on.
              </div>
              <div className="lead mt-3">
                The Discipline Recommender System makes it simpler. It records
                and spots violations, helping schools handle issues early on,
                making the campus safer.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="benefits">
        <div className="container-lg py-5 mb-5">
          <div className="title h1 text-center fw-bold">
            Benefits of Discipline Recommender System
          </div>
          <div className="row justify-content-center align-items-center">
            <div
              className="col-md-4 mt-5 text-center text-uppercase"
              data-aos="flip-left"
            >
              <img src={Automated} alt="Automated Reporting" className="mb-2" />
              <h4>Automated Reporting</h4>
              <div className="lead text-capitalize">
                Instant reports, simplifying administrative tasks effortlessly
              </div>
            </div>
            <div
              className="col-md-4 mt-5 text-uppercase text-center"
              data-aos="flip-right"
            >
              <img src={FastAccess} alt="Efficient Recording" />
              <h4>Efficient Recording</h4>
              <div className="lead text-capitalize">
                Quickly records violations for enhanced efficiency
              </div>
            </div>
            <div
              className="col-md-4 mt-5 text-uppercase text-center "
              data-aos="flip-left"
            >
              <img src={DataAccess} alt="Data Access" />
              <h4>Data Accessibility</h4>
              <div className="lead text-capitalize">
                Effortless data access, ensuring operational efficiency
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="features"
        className="py-5 mb-5"
        style={{ background: "#B6BBC4" }}
      >
        <div className="container-lg" data-aos="fade-left">
          <h1 className="text-center mb-3">System Features</h1>
          <div className="row justify-content-center align-items-center">
            <div className="col-md-4 text-md-start text-center">
              <div className="feature-1 mt-3">
                <h4>
                  <FontAwesomeIcon icon={faCheck} className="text-success" />{" "}
                  User-Friendly
                </h4>
              </div>
              <div className="feature-2 mt-3">
                <h4>
                  <FontAwesomeIcon icon={faCheck} className="text-success" />{" "}
                  Data Management
                </h4>
              </div>
              <div className="feature-3 mt-3">
                <h4>
                  <FontAwesomeIcon icon={faCheck} className="text-success" />{" "}
                  Generated Reports
                </h4>
              </div>
              <div className="feature-4 mt-3">
                <h4>
                  <FontAwesomeIcon icon={faCheck} className="text-success" />{" "}
                  Centralize Database
                </h4>
              </div>
            </div>
            <div className="col-md-4 text-md-start text-center">
              <div className="feature-1 mt-3">
                <h4>
                  <FontAwesomeIcon icon={faCheck} className="text-success" />{" "}
                  Secure Data Storage
                </h4>
              </div>
              <div className="feature-2 mt-3">
                <h4>
                  <FontAwesomeIcon icon={faCheck} className="text-success" />{" "}
                  Mobile Accessibility
                </h4>
              </div>
              <div className="feature-3 mt-3">
                <h4>
                  <FontAwesomeIcon icon={faCheck} className="text-success" />{" "}
                  Real-Time Monitoring
                </h4>
              </div>
              <div className="feature-4 mt-3">
                <h4>
                  <FontAwesomeIcon icon={faCheck} className="text-success" />{" "}
                  Pattern Analysis
                </h4>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section id="FAQs" className="py-5 mb-5">
        <div className="container-lg">
          <div className="title text-center h1 mb-5">
            Frequently Ask Questions
          </div>
          <Accordion>
            <Accordion.Item eventKey="1">
              <Accordion.Header>
                <FontAwesomeIcon icon={faCircleQuestion} className="me-2" />
                Is the system accessible on mobile devices?
              </Accordion.Header>
              <Accordion.Body>
                Yes, the Discipline Recommender System is designed to be
                accessible on mobile devices. The web-based platform ensures
                that administrators and educators can conveniently monitor and
                manage student violations using smartphones or tablets,
                providing flexibility and real-time access to the system from
                anywhere with an internet connection.
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="2">
              <Accordion.Header>
                <FontAwesomeIcon icon={faCircleQuestion} className="me-2" />
                Can the system generate report for student violations?
              </Accordion.Header>
              <Accordion.Body>
                Absolutely, the system can generate student violation reports,
                providing quick and comprehensive insights for effective
                disciplinary management.
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="3">
              <Accordion.Header>
                <FontAwesomeIcon icon={faCircleQuestion} className="me-2" />
                Can a student create an account?
              </Accordion.Header>
              <Accordion.Body>
                Yes, the Discipline Recommender System allows students to create
                accounts, providing them with a secure and designated space to
                access relevant information about their disciplinary records.
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="4">
              <Accordion.Header>
                <FontAwesomeIcon icon={faCircleQuestion} className="me-2" />
                How can i create an account?
              </Accordion.Header>
              <Accordion.Body>
                To create an account, click "Get Started" on the website's hero
                section or "Login" on the side of the navbar. This will lead you
                to the login form, where you'll find a 'Sign up' hyperlink.
                Click it to access the signup form, where you'll need to fill in
                Account, Personal, and Contact information. Submit the form for
                confirmation, and you're all set to use the Discipline
                Recommender System.
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="5">
              <Accordion.Header>
                <FontAwesomeIcon icon={faCircleQuestion} className="me-2" />
                What measures are in place to ensure data privacy?
              </Accordion.Header>
              <Accordion.Body>
                The Discipline Recommender System ensures data privacy through
                strict access controls, encryption, and compliance with
                regulations. Only authorized personnel can access sensitive
                information, and encryption safeguards data during transmission
                and storage. Regular audits maintain compliance and address
                potential vulnerabilities, reinforcing our commitment to data
                security.
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </div>
      </section>
      <section
        id="return-home"
        className="py-5 text-center"
        style={{ background: "#B6BBC4" }}
      >
        <img src={CvSULogo} alt="cvsu logo" width="100px" />
        <div className="h1 fw-bold text-uppercase">Let's get you ready!</div>
        <Link to="/signup" className="btn btn-success btn-lg">
          Get Started
        </Link>
      </section>
    </>
  );
}
