import { AdminContext } from "../../../Context/AdminContext";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import Form from "react-bootstrap/Form";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function ViolationAnalytics() {
  const { baseUrl } = useContext(AdminContext);
  const [courses, setCourses] = useState([]);
  const [academicYear, setAcademicYear] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedAcademicYear, setSelectedAcademicYear] = useState("");
  const [allAcademicYear, setAllAcademicYear] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(baseUrl + "fetch-all-courses", {
          params: {
            academicYear: selectedAcademicYear,
            semester: selectedSemester,
          },
        });

        if (response.status === 200) {
          setCourses(response.data.courses);
          console.log(response.data.course);
        }
      } catch (error) {
        console.log(error);
      }
    };
    console.log(selectedAcademicYear + "|" + selectedSemester);
    fetchCourses();
  }, [selectedAcademicYear, selectedSemester]);

  useEffect(() => {
    axios
      .get(baseUrl + "fetch-academic-year")
      .then((res) => {
        if (res.status === 200) {
          setAllAcademicYear(res.data.acadYear);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const data = {
    labels: courses.map((course) => course.program_code),
    datasets: [
      {
        label: "TOTAL STUDENT VIOLATION",
        data: courses.map((course) => course.student_count),
        backgroundColor: "#14A44D",
        borderColor: "black",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      x: {
        title: {
          display: true,
          text: "PROGRAM CODE",
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "STUDENT COUNT",
        },
      },
    },
    responsive: true,
    maintainAspectRatio: true,
  };

  return (
    <>
      <div className="container-fluid scrollable-container-analytic  d-flex justify-content-center flex-column align-items-center">
        <div className="display-6 fw-bold text-center rounded px-5 py-2 mt-5 mb-3">
          Student Violation Analysis
        </div>

        <div className="container">
          <div className="row justify-content-center align-items-center">
            <div className="col-lg-6 ">
              <Form.Select
                id="ay-code"
                value={academicYear}
                onChange={(e) => {
                  setAcademicYear(e.target.value);
                  const [selectedAcademicYear, selectedSemester] =
                    e.target.value.split(" | ");
                  setSelectedSemester(selectedSemester);
                  setSelectedAcademicYear(selectedAcademicYear);
                }}
              >
                <option value="" hidden>
                  Select Academic Year
                </option>
                {allAcademicYear &&
                  allAcademicYear.map((year, index) => (
                    <option
                      key={index}
                      value={`${year.academicYear} | ${year.semester}`}
                    >
                      {year.academicYear} | {year.semester}
                    </option>
                  ))}
              </Form.Select>
            </div>
          </div>
        </div>

        <div style={{ width: "65vw" }}>
          <Bar data={data} options={options} />
        </div>
      </div>
    </>
  );
}
