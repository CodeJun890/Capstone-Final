import { useState } from "react";
import { Link } from "react-router-dom";

import Dropdown from "react-bootstrap/Dropdown";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import CvsuLogo from "../../Assets/cvsu-logo.png";

import "../../styles.css";

export default function HomeNavbar() {
  const [navLinkExpanded, setNavLinkExpanded] = useState(false);

  const handleMouseEnter = () => setNavLinkExpanded(true);
  const handleMouseLeave = () => setNavLinkExpanded(false);

  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary shadow-lg">
        <Container>
          <Navbar.Brand as={Link} to="/">
            <img
              src={CvsuLogo}
              alt="Logo"
              className="img-fluid"
              style={{
                maxWidth: "180px",
                height: "auto",
              }}
              width="180"
              height="80"
            />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" id="navbar-home" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto text-center">
              <Link to="/" className="nav-link">
                Home
              </Link>

              <Link to="/#about" className="nav-link me-2">
                About
              </Link>
              <Link to="/#FAQs" className="nav-link me-2">
                FAQ
              </Link>
              <Link to="/#contact" className="nav-link me-2">
                Contact
              </Link>
              <Link to="/login" className="btn btn-success">
                Login
              </Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}
