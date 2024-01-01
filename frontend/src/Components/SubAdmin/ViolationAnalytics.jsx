import { SubAdminContext } from "../../../Context/SubAdminContext";
import { useContext, useEffect, useState } from "react";
import axios from "axios";

import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend
} from "chart.js";

ChartJS.register(
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend
)


export default function ViolationAnalytics() {
    const { baseUrl } = useContext(SubAdminContext);
    const [courses, setCourses] = useState([]);
  
    useEffect(() => {
      axios(baseUrl + "fetch-all-courses")
        .then((res) => {
          if (res.status === 200) {
            setCourses(res.data.courses);
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
        <div className="display-6 fw-bold text-center rounded px-5 py-2 mt-5 mb-3">Student Violation Analysis</div>
            <div style={{ width: "65vw" }}>
                <Bar data={data} options={options} />
            </div>
      </div>
       
      </>
    );
  }