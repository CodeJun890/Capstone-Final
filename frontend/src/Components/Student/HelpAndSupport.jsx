import Accordion from "react-bootstrap/Accordion";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsersGear } from "@fortawesome/free-solid-svg-icons";
export default function HelpAndSupport({ isToggled }) {
  const [displayFAQ, setDisplayFAQ] = useState(true);
  const [displayDocumentation, setDisplayDocumentation] = useState(false);
  const [displayFeatures, setDisplayFeatures] = useState(false);
  return (
    <>
      <div
        className={`container scrollable-container ${isToggled ? "dark" : ""}`}
      >
        <div
          className={`support-header d-flex flex-column justify-content-center mt-5 ${
            isToggled ? "dark" : ""
          }`}
        >
          <FontAwesomeIcon
            icon={faUsersGear}
            className="display-1 support-icon"
          />
          <ul
            className="d-flex justify-content-center mt-3 me-5"
            id="support-links"
          >
            <li>
              <div
                className="lead"
                onClick={() => {
                  setDisplayDocumentation(false);
                  setDisplayFeatures(false);
                  setDisplayFAQ(true);
                }}
              >
                Frequently Ask Question
              </div>
            </li>
          </ul>
        </div>
        <div className="support-body">
          <div className={`FAQ  ${displayFAQ ? "d-block" : "d-none"}`}>
            <div className="display-6 text-uppercase mt-4 mb-4 text-md-start text-center">
              Frequently Ask Question
            </div>
            <Accordion>
              <Accordion.Item eventKey="0">
                <Accordion.Header>
                  How can I log in to the Student Violation Management System as
                  a student user?
                </Accordion.Header>
                <Accordion.Body>
                  You can log in by visiting the system's login page and
                  entering your email and password provided by the institution.
                  If you haven't received your login credentials, please contact
                  your school's administration.
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="1">
                <Accordion.Header>
                  What information about my violations can I access as a student
                  user?
                </Accordion.Header>
                <Accordion.Body>
                  As a student user, you can view details of the violations you
                  have incurred, including the date, nature of the violation,
                  and any associated penalties or consequences.
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="2">
                <Accordion.Header>
                  Can I dispute or appeal a violation in the system as a student
                  user?
                </Accordion.Header>
                <Accordion.Body>
                  Yes, you can typically submit a dispute or appeal for a
                  violation through the system if your institution allows it.
                  Look for an option to dispute violations within your account.
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="3">
                <Accordion.Header>
                  How do I update my personal information in the Student
                  Violation Management System?
                </Accordion.Header>
                <Accordion.Body>
                  You can typically update your personal information, such as
                  contact details or address, by navigating to "Profile" page
                  inside the menu bar within the system.
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="4">
                <Accordion.Header>
                  Can I track the status of my submitted dispute or appeal
                  regarding a violation?
                </Accordion.Header>
                <Accordion.Body>
                  Yes, the system should provide you with the ability to track
                  the status of any disputes or appeals you've submitted. You
                  can check the progress and outcome of these requests within
                  the "My Violation" within the menu bar.
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="5">
                <Accordion.Header>
                  What should I do if I encounter technical issues or have
                  trouble accessing the Student Violation Management System?
                </Accordion.Header>
                <Accordion.Body>
                  If you encounter technical problems or face difficulties
                  accessing the system, it's advisable to contact your school's
                  IT support or the system administrator for assistance. They
                  can help you resolve any issues you may encounter.
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </div>
        </div>
      </div>
    </>
  );
}
