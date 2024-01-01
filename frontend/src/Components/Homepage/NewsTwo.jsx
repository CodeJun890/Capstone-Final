import CampusImage1 from "../../Assets/campus-8.webp";
import Breadcrumb from "react-bootstrap/Breadcrumb";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDoubleRight } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import "../../styles.css";
export default function NewsTwo() {
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
          CVSU TRECE MARTIRES CITY CAMPUS ORGANIZATIONS IN TIMES OF PANDEMIC
        </div>
        <div className=" text-start h3 mt-5 text-center text-md-start">
          What happened to our student organizations during the pandemic?
        </div>
        <div className="lead mt-3 text-justify indent">
          The COVID19 pandemic that started in early 2020 slammed the door on
          all facets of daily life. It disrupted local and international travel,
          slowed economic growth, and disrupted education around the world.
          COVID 19 has become a "supernova" in just a few months causing turmoil
          everywhere and disrupted the traditional educational system of the
          country. CvSU Trece Martires City Campus is no exception.
        </div>
        <div className="lead mt-3 text-justify indent">
          Returning students to school has been an ongoing concern in most
          countries and a significant source of heated debate. Social
          distancing, thorough maintenance, and careful improvisation of all
          activities around the school have all been significant obstacles for
          schools that have reopened. We don't know what the long-term impact,
          effects, and consequences of opening schools in the current pandemic
          will be, but it's clear that the mental health of young people who
          feel trapped or isolated at home is a very real issue that has the
          potential to be a bigger problem than the virus itself. The well-being
          of leaders, teachers, learners, parents, and all stakeholders involved
          in the reopening of school life must be prioritized in this period of
          chaos, where quick solutions are needed in a fast-changing environment
          of schools. One major system in school that are is affected are is the
          school organizations by different departments. They lack of activities
          which that will be helpful to students who lacks elsewhere. Moreover,
          this made impossible because of the danger that we might face outside
          our homes. In addition, organizations are trying their best to somehow
          make activities online that will certainly engage students from the
          convienience of their homes. However, there are limited activities or
          proposals that go some limited activities or proposals go through due
          to limited resources.
        </div>
        <div className="lead mt-3 text-justify indent">
          Moreover, there are is an organization in CvSU Trece Martires City
          Campus that is trying to at least be active to in their respective
          organizations. League of Information Technology Leaders (LITL)
          conducted their election for this school year. On the other hand,
          Central Student Government (CSG) conducted their election as well. Our
          beloved campus created an organization for Socio-Cultural for students
          who wants to join to improve their skills and creativity. Non-stop
          webinars conducted by our beloved faculty members and staff for
          students’ additional knowledge that will indeed help for their
          studies.
        </div>
        <div className="lead mt-3 text-justify indent">
          The pressure is constant for school leaders working in these stressful
          and chaotic circumstances, the choices are minimal, and sleepless
          nights are common. Staff meetings, food trip after meetings, and
          hallway talks with colleagues that used to make up a school day are no
          longer there. All of those vital, intimate moments when social
          relationships are formed and leadership is practiced simply vanished.
          Parents, students, and teachers now live in a fading education
          environment, waiting for normal service to return or hoping for a new
          normal that will provide stability, continuity, and reassurance. The
          sad reality is that none of these things is going to happen anytime
          soon. Meanwhile, school leaders find themselves in the unpleasant way
          of being the system's biggest liability. They rely on upper guidance
          for COVID-19 responses, processes, procedures, and protocols.
          Depending on how the virus progresses, these can change almost
          instantly. All at once, school leaders are dealing with dynamic and
          changing staffing situations, which means they must do a lot more with
          a lot less. Staff and students are socially disconnected, which means
          more work and more pressure on those staff who can return to work.
          Every expectation, whether from on high or from on low, requires more
          of school leaders, both professionally as well as personally.
        </div>
        <div className="lead mt-3 text-justify indent">
          In such difficult times, school leaders cannot reproduce the
          leadership practices they witnessed or enjoyed during times of
          stability, continuity, and normalcy. Leading in disruptive times
          requires the ability to push a different course, to establish new
          paths through the instability. On this journey, school leaders,
          particularly at CvSU Trece Martires City Campus, are defined by their
          willingness, hope, and unshakeable belief that whatever happens,
          whatever the cost, whatever the scale of the challenge, they will
          continue to do everything in their duty to help the learning of all
          college students. We are all in this together Martyrs. Fighting!
        </div>
      </div>
    </>
  );
}
