import CampusImage1 from "../../Assets/campus-8.webp";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import Table from "react-bootstrap/Table";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDoubleRight } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import "../../styles.css";

function UniversityOfficials() {
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
              University Officials
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </div>
      <div className="container">
        <div className="display-5 my-5 text-success fw-bold news text-center">
          UNIVERSITY OFFICIALS
        </div>
        <div className="officials-text text-center">
          <div className="display-6 mb-4">Dr. Hernando D. Robles</div>
          <div className="h5 fw-bold">PRESIDENT, CAVITE STATE UNIVERSITY</div>
          <p>(046) 415-0010 / office.president@cvsu.edu.ph</p>
          <p className="fw-bold">
            Designation of University Officials ( January 17, 2021 to January
            16, 2023)
          </p>
        </div>
        <div className="table-responsive-md">
          <Table className="my-5" striped bordered hover>
            <thead>
              <tr className="text-center">
                <th className="fw-bold h5">NAME</th>
                <th className="fw-bold h5">POSITION</th>
                <th className="fw-bold h5">CONTACT INFORMATION</th>
              </tr>
            </thead>
            <tbody className="py-3">
              <tr>
                <td>DR. MA. AGNES P. NUESTRO</td>
                <td>VICE PRESIDENT FOR ACADEMIC AFFAIRS</td>
                <td>
                  (046) 862-0806 <br></br>ovpaa@cvsu.edu.ph
                </td>
              </tr>
              <tr>
                <td>DR. CAMILO A. POLINGA</td>
                <td>VICE PRESIDENT FOR ADMINISTRATIVE AND SUPPORT SERVICES</td>
                <td>
                  (046) 862-0853 <br></br>ovpass@cvsu.edu.ph
                </td>
              </tr>
              <tr>
                <td>DR. MELBOURNE R. TALACTAC</td>
                <td>VICE PRESIDENT FOR RESEARCH AND EXTENSION</td>
                <td>
                  (046) 862-0850 <br></br>ovpre@cvsu.edu.ph
                </td>
              </tr>
              <tr>
                <td>DR. LEYMA L. CERO</td>
                <td>VICE PRESIDENT FOR PLANNING AND DEVELOPMENT</td>
                <td>
                  (046) 862-0806 <br></br>pdo@cvsu.edu.ph
                </td>
              </tr>
              <tr>
                <td>DR. BETTINA JOYCE P. ILAGAN</td>
                <td>DEAN, College of Arts and Sciences</td>
                <td>cas@cvsu.edu.ph</td>
              </tr>
              <tr>
                <td>DR. FAMELA IZA C. MATIC</td>
                <td>DEAN, College of Criminal Justice</td>
                <td>
                  0915-526-0819<br></br>0915-668-4432<br></br>ccj@cvsu.edu.ph
                </td>
              </tr>
              <tr>
                <td>DR. AMMIE P. FERRER</td>
                <td>DEAN, College of Education</td>
                <td>ced@cvsu.edu.ph</td>
              </tr>
              <tr>
                <td>DR. TITA C. LOPEZ</td>
                <td>
                  DEAN, College of Economics, Management and Development Studies
                </td>
                <td>cemds@cvsu.edu.ph</td>
              </tr>
              <tr>
                <td>DR. DAVID L. CERO</td>
                <td>DEAN, College of Engineering and Information Technology</td>
                <td>
                  (046) 415-0021 <br></br>ceit@cvsu.edu.ph
                </td>
              </tr>
              <tr>
                <td>DR. EVELYN M. DEL MUNDO</td>
                <td>DEAN, College of Nursing</td>
                <td>con@cvsu.edu.ph</td>
              </tr>
              <tr>
                <td>PROF. JAZMIN P. CUBILLO</td>
                <td>
                  DEAN, College of Sports, Physical Education and Recreation
                </td>
                <td>cspear@cvsu.edu.ph</td>
              </tr>
              <tr>
                <td>DR. MA. CYNTHIA N. RUNDINA-DELA CRUZ</td>
                <td>
                  DEAN, College of Veterinary Medicine and Biomedical Sciences
                </td>
                <td>
                  (046) 862-0939 <br></br>862-0940 <br></br>cvmbs@cvsu.edu.ph
                </td>
              </tr>
              <tr>
                <td>DR. REZIN C. BAHIA</td>
                <td>DEAN, Graduate School and Open Learning College</td>
                <td>
                  0909-300-7560 <br></br>gs.olc@cvsu.edu.ph
                </td>
              </tr>
              <tr>
                <td>MS. MENVYLUZ S. MACALALAD</td>
                <td>Campus Administrator, CvSU Bacoor City Campus</td>
                <td>
                  (046) 476-5029 <br></br>cvsubacoor@cvsu.edu.ph
                </td>
              </tr>
              <tr>
                <td>PROF. MA. CRISTINA J. BAESA</td>
                <td>Campus Administrator, CvSU Cavite City Campus</td>
                <td>
                  (046) 431-3580 <br></br>431-3570 <br></br>
                  cvsucavitecity@cvsu.edu.ph
                </td>
              </tr>
              <tr>
                <td>DR. MARLON A. MOJICA</td>
                <td>Campus Administrator, CvSU Imus Campus</td>
                <td>
                  (046) 471-6607 <br></br>cvsuimus@cvsu.edu.ph
                </td>
              </tr>
              <tr>
                <td>DR. JOCELYN L. REYES</td>
                <td>Campus Administrator, CvSU Silang Campus</td>
                <td>
                  (046) 513-5706<br></br> cvsusilang@cvsu.edu.ph
                </td>
              </tr>
              <tr>
                <td>PROF. CRISTINA M. SIGNO</td>
                <td>Campus Administrator, CvSU Carmona Campus</td>
                <td>
                  (046) 430-3509<br></br> cvsucarmona@cvsu.edu.ph
                </td>
              </tr>
              <tr>
                <td>DR. JOSE P. LISAMA</td>
                <td>Campus Administrator, CvSU Rosario Campus</td>
                <td>
                  (046) 437-6659 <br></br>437-1109 <br></br>
                  cvsurosario@cvsu.edu.ph
                </td>
              </tr>
              <tr>
                <td>PROF. JOHN XAVIER B. NEPOMUCENO</td>
                <td>Campus Administrator, CvSU Naic Campus</td>
                <td>
                  (046) 856-0942 <br></br>cvsunaic@cvsu.edu.ph
                </td>
              </tr>
              <tr>
                <td>PROF. NOEL A. SEDIGO</td>
                <td>Campus Administrator, CvSU Trece Martires City Campus</td>
                <td>cvsutrecemartires@cvsu.edu.ph</td>
              </tr>
              <tr>
                <td>DR. LAURO B. PASCUA</td>
                <td>Campus Administrator, CvSU General Trias Campus</td>
                <td></td>
              </tr>
              <tr>
                <td>PROF. GIL D. RAMOS</td>
                <td>Campus Administrator, CvSU Tanza Campus </td>
                <td></td>
              </tr>
              <tr>
                <td>DR. GEMMA S. LEGASPI</td>
                <td>Campus Administrator, CvSU Trece Martires City Campus</td>
                <td>cvsumaragondon@cvsu.edu.ph</td>
              </tr>
              <tr>
                <td>PROF. ANA LIZA R. MOJICA</td>
                <td>Director, Sports</td>
                <td>sportsdirector@cvsu.edu.ph</td>
              </tr>
              <tr>
                <td>MS. EDWINA O. RODEROS</td>
                <td>University Registrar</td>
                <td>
                  (046) 862-0853 <br></br>registrarmain@cvsu.edu.ph
                </td>
              </tr>
              <tr>
                <td>MS. SHARON M. ISIP</td>
                <td>Head, University Library</td>
                <td>
                  0917-683-3905 <br></br>cvsuosasmain@cvsu.edu.ph
                </td>
              </tr>
              <tr>
                <td>MS. PRINCESS N. RODERNO</td>
                <td>Campus Administrator, CvSU Trece Martires City Campus</td>
                <td>cvsulibrary@cvsu.edu.ph</td>
              </tr>
              <tr>
                <td>DR. PATRICK GLENN C. ILANO</td>
                <td>Hotel Manager</td>
                <td>(046) 415-1804</td>
              </tr>
              <tr>
                <td>DR. MIRIAM D. BALTAZAR</td>
                <td>Director, Research Center</td>
                <td>
                  (046) 862-1654 <br></br>researchcenter@cvsu.edu.ph
                </td>
              </tr>
              <tr>
                <td>DR. ALMIRA G. MAGCAWAS</td>
                <td>Director, Extension Services</td>
                <td>
                  (046) 862-0859 <br></br>extension@cvsu.edu.ph
                </td>
              </tr>
              <tr>
                <td>ENGR. GERRY M. CASTILLO</td>
                <td>
                  Director, National Coffee Research, Development and Extension
                  Center
                </td>
                <td>
                  (046)415-0329 <br></br>ncrdec@cvsu.edu.ph
                </td>
              </tr>
              <tr>
                <td>DR. AGNES C. FRANCISCO</td>
                <td>Director, Knowledge Management Center Campus</td>
                <td>
                  (046) 862-0859 <br></br>kmc.cvsu@cvsu.edu.ph
                </td>
              </tr>
              <tr>
                <td>PROF. LINA C. ABOGADIE</td>
                <td>Director, Business Affairs</td>
                <td>
                  (046) 862-0851 <br></br>businessaffairs@cvsu.edu.ph
                </td>
              </tr>
              <tr>
                <td>MS. EDNA L. MOJICA</td>
                <td>Director, Administration</td>
                <td>
                  (046) 862-0853<br></br> oda@cvsu.edu.ph
                </td>
              </tr>
              <tr>
                <td>DR. MARY JANE D. TEPORA</td>
                <td>Director, Human Resource and Development Office</td>
                <td>
                  (046) 862-0850 <br></br>cvsuhrd@cvsu.edu.ph
                </td>
              </tr>
              <tr>
                <td>MS. LOLITA G. HERRERA</td>
                <td>Director, Finance Management Office</td>
                <td>lolitagenerherrera@cvsu.edu.ph</td>
              </tr>
              <tr>
                <td>DR. ROMEO M. SANCHEZ</td>
                <td>Director, Health Services</td>
                <td>docromeosanchez@gmail.com</td>
              </tr>
              <tr>
                <td>MR. ROMULO L. GOMEZ</td>
                <td>Director, Civil Security Services</td>
                <td>romygomez.cvsu@gmail.com</td>
              </tr>
              <tr>
                <td>PROF. DANIELITO R. ESCAÑO</td>
                <td>Director, Physical Plant Services</td>
                <td>pps@cvsu.edu.ph</td>
              </tr>
              <tr>
                <td>ENGR. ORLANDO B. DELOS REYES</td>
                <td>Director, Planning Office</td>
                <td>obdreyes@cvsu.edu.ph</td>
              </tr>
              <tr>
                <td>DR. ADOLFO C. MANUEL JR.</td>
                <td>Director, Institutional Development Office</td>
                <td>acmanuel@cvsu.edu.ph</td>
              </tr>
              <tr>
                <td>MS. CATHERINE J. QUIÑONES</td>
                <td>Director, Presidential Management Coordinating Office</td>
                <td>
                  (046) 415-0010 <br></br>office.president@cvsu.edu.ph
                </td>
              </tr>
              <tr>
                <td>DR. SUSAN G. TAN</td>
                <td>Officer-in-Charge, Gender and Development</td>
                <td>
                  (046) 443-2546 <br></br>gadcvsu@gmail.com
                </td>
              </tr>
              <tr>
                <td>PROF. MARIA SOLEDAD M. LISING</td>
                <td>
                  Director, International and Local Collaboration and Linkages
                  Office
                </td>
                <td></td>
              </tr>
              <tr>
                <td>PROF. ADORA JOY T. PLETE</td>
                <td>Director, Public Affairs and Communications Office</td>
                <td>
                  paco@cvsu.edu.ph <br></br>0916-341-0750
                </td>
              </tr>
              <tr>
                <td>PROF. RODERICK M. RUPIDO</td>
                <td>Officer-In-Charge, Alumni Affairs</td>
                <td></td>
              </tr>
              <tr>
                <td>DR. HOSEA DL. MATEL</td>
                <td>Director, Macapuno R&D Center</td>
                <td></td>
              </tr>
              <tr>
                <td>MR. ARTURO C. ERAÑA</td>
                <td>Director, SPRINT</td>
                <td></td>
              </tr>
              <tr>
                <td>PROF. GIL D. RAMOS </td>
                <td>Faculty Regent</td>
                <td></td>
              </tr>
              <tr>
                <td>MR. MACARIO JR. T. DEL MUNDO</td>
                <td>Student Regent</td>
                <td></td>
              </tr>
            </tbody>
          </Table>
        </div>
      </div>
    </>
  );
}

export default UniversityOfficials;
