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
  const { baseUrl, academicYear, setAcademicYear } = useContext(AdminContext);
  const [courses, setCourses] = useState([]);
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
          console.log(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchCourses();
  }, [selectedAcademicYear, selectedSemester, academicYear]);

  useEffect(() => {
    axios
      .get(baseUrl + "fetch-academic-year")
      .then((res) => {
        if (res.status === 200) {
          const openAcademicYears = res.data.acadYear.filter(
            (year) => year.status === "OPEN"
          );
          setAllAcademicYear(res.data.acadYear);
          setAcademicYear(openAcademicYears);
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
                value={academicYear.map(
                  (year) => year.academicYear + " | " + year.semester
                )}
                onChange={(e) => {
                  const [selectedAcademicYear, selectedSemester] =
                    e.target.value.split(" | ");
                  setAcademicYear([
                    {
                      academicYear: selectedAcademicYear,
                      semester: selectedSemester,
                    },
                  ]);
                  setSelectedSemester(
                    selectedSemester ??
                      academicYear.map((year) => year.semester)
                  );
                  setSelectedAcademicYear(
                    selectedAcademicYear ??
                      academicYear.map((year) => year.academicYear)
                  );
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
