import "../../styles.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebookF } from "@fortawesome/free-brands-svg-icons";
import { faYoutube } from "@fortawesome/free-brands-svg-icons";
import { faPhone } from "@fortawesome/free-solid-svg-icons";
import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
export default function HomeFooter() {
  return (
    <>
      <footer id="contact" className="footer">
        <div className="container-footer">
          <div className="row-footer">
            <div className="footer-col">
              <h4>GOV LINKS</h4>
              <ul>
                <li>
                  <a href="https://www.officialgazette.gov.ph/">Gov PH</a>
                </li>
                <li>
                  <a href="https://ched.gov.ph/grants/">CHED</a>
                </li>
                <li>
                  <a href="https://www.tesda.gov.ph/">TESDA</a>
                </li>
                <li>
                  <a href="https://www.sei.dost.gov.ph/">DOST</a>
                </li>
                <li>
                  <a href="https://cavite.gov.ph/home/?tribe_venue=kawit">
                    Province of Cavite
                  </a>
                </li>
                <li>
                  <a href="https://www.trecemartirescity.gov.ph/">
                    Trece Martires City
                  </a>
                </li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>QUICK LINKS</h4>
              <ul>
                <li>
                  <a href="#">News & Updates</a>
                </li>
                <li>
                  <a href="#">Course Offered</a>
                </li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>CONTACT US</h4>
              <ul>
                <li>
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=Brgy.+Gregorio%2C+Trece+Martires+City%2C+Cavite+4109"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FontAwesomeIcon
                      icon={faMapMarkerAlt}
                      className="fas fa-map-marker-alt me-2"
                    />
                    Brgy. Gregorio, Trece Martires City, Cavite 4109
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:cvsutrecemartires@cvsu.edu.ph"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textTransform: "lowercase" }}
                  >
                    <FontAwesomeIcon
                      icon={faEnvelope}
                      className="fas fa-envelope me-2"
                    />
                    cvsutrecemartires@cvsu.edu.ph
                  </a>
                </li>
                <li>
                  <a href="tel:+639778033809">
                    <FontAwesomeIcon
                      icon={faPhone}
                      className="fas fa-phone me-2"
                    />
                    046-8664981
                  </a>
                </li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>follow us</h4>
              <div className="social-links">
                <a
                  href="https://www.facebook.com/CvSUTreceCampus"
                  aria-label="Facebook Page for CvSU Trece Martires City Campus"
                >
                  <FontAwesomeIcon icon={faFacebookF} />
                  <span className="sr-only">Facebook</span>
                </a>
                <a
                  href="https://www.youtube.com/channel/UC6p5srphejusQzaulrxmtow"
                  aria-label="YouTube Channel for CvSU Trece Martires City Campus"
                >
                  <FontAwesomeIcon icon={faYoutube} />
                  <span className="sr-only">YouTube</span>
                </a>
              </div>
            </div>
          </div>

          <p className="text-light text-center mt-5">
            Copyright &copy; 2023{" "}
            <span style={{ color: "#02b302" }}>
              Cavite State University - Trece Martires City Campus
            </span>{" "}
            All Rights Reserved
          </p>
        </div>
      </footer>
    </>
  );
}
