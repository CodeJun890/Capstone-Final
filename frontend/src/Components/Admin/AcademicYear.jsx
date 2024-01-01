import React, { useState, useRef, useContext, useEffect } from "react";
import DataTable from "react-data-table-component";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import MoonLoader from "react-spinners/MoonLoader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faFolderOpen,
  faFolderClosed,
  faCalendarDays,
} from "@fortawesome/free-solid-svg-icons";
import Button from "react-bootstrap/esm/Button";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import Swal from "sweetalert2";
import { AdminContext } from "../../../Context/AdminContext";
export default function AcademicYear({ isToggled }) {
  const { baseUrl } = useContext(AdminContext);
  const [perPage, setPerPage] = useState(3);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPageOptions = [3];
  const [filterValue, setFilterValue] = useState("");
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [pending, setPending] = React.useState(true);
  const [modalShow, setModalShow] = React.useState(false);
  const [record, setRecord] = useState([]);

  useEffect(() => {
    axios
      .get(baseUrl + "fetch-academic-year")
      .then((res) => {
        setRecord(res.data.acadYear);
        setFilteredRecords(res.data.acadYear);
        setPending(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const columns = [
    {
      name: "#",
      selector: (row, index) => index + 1,
      sortable: true,
    },
    {
      name: "Academic Year",
      selector: (row) => row.academicYear,
      sortable: true,
    },
    {
      name: "Year From",
      selector: (row) => row.yearFrom,
      sortable: true,
    },
    {
      name: "Year To",
      selector: (row) => row.yearTo,
      sortable: true,
    },
    {
      name: "Semester",
      selector: (row) => row.semester,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row.status,
      cell: (row) => (
        <div className="d-flex mt-3 align-items-center justify-content-center">
          <p
            className="text-uppercase px-2 py-1 rounded text-light"
            style={{ backgroundColor: getStatusColor(row.status) }}
          >
            {row.status}
          </p>
        </div>
      ),
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="d-flex column-gap-3 justify-content-around align-items-center flex-nowrap">
          <div
            className="h6 text-warning"
            style={{ cursor: "pointer" }}
            onClick={() => {
              Swal.fire({
                html: `<p class="h5">DO YOU WANT TO OPEN THIS ACADEMIC YEAR <span class="text-danger">${row.academicYear} | ${row.semester} </span> ?</p>`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, Open it!",
              }).then((result) => {
                if (result.isConfirmed) {
                  Swal.fire(
                    "ACTIVATED",
                    `<p class="h5">ACADEMIC YEAR <span class="text-danger">${row.academicYear} | ${row.semester} </span> IS OPEN</p>`,
                    "success"
                  );
                  handleOpenStatusClick(row);
                }
              });
            }}
          >
            <FontAwesomeIcon icon={faFolderOpen} />
          </div>
          <div
            className={`h6 text-danger ${
              row.status !== "OPEN" ? "disabled-div" : ""
            }`}
            style={{ cursor: "pointer" }}
            onClick={() => {
              Swal.fire({
                html: `<p class="h5">DO YOU WANT TO CLOSE THIS ACADEMIC YEAR <span class="text-danger">${row.academicYear} | ${row.semester} </span> ?</p>`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, Close it!",
              }).then((result) => {
                if (result.isConfirmed) {
                  Swal.fire(
                    "DEACTIVATED",
                    `<p class="h5">ACADEMIC YEAR <span class="text-danger">${row.academicYear} | ${row.semester} </span> IS CLOSE</p>`,
                    "success"
                  );
                  handleCloseStatusClick(row);
                }
              });
            }}
          >
            <FontAwesomeIcon icon={faFolderClosed} />
          </div>
        </div>
      ),
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "OPEN":
        return "#198754";
      case "CLOSE":
        return "#dc3545";
      default:
        return "transparent";
    }
  };

  const handleOpenStatusClick = (row) => {
    const updatedRecord = [...record];

    const rowIndex = updatedRecord.findIndex((r) => r._id === row._id);

    if (rowIndex !== -1) {
      // If the clicked academic year is already open, return without making any changes
      if (updatedRecord[rowIndex].status === "OPEN") {
        return;
      }

      // Set all other academic years' status to "CLOSE"
      updatedRecord.forEach((academicYear) => {
        academicYear.status = "CLOSE";
      });

      // Set the clicked academic year to "OPEN"
      updatedRecord[rowIndex].status = "OPEN";

      setRecord(updatedRecord);

      axios
        .put(baseUrl + `update-academic-year/${row._id}`, { status: "OPEN" })
        .then((response) => {
          return;
        })
        .catch((error) => {
          console.error("Error updating academic year status:", error);
        });
    }
  };

  const handleCloseStatusClick = (row) => {
    const updatedRecord = [...record];

    const rowIndex = updatedRecord.findIndex((r) => r._id === row._id);

    if (rowIndex !== -1) {
      // If the clicked academic year is already closed, return without making any changes
      if (updatedRecord[rowIndex].status === "CLOSE") {
        return;
      }

      // Set the clicked academic year to "CLOSE"
      updatedRecord[rowIndex].status = "CLOSE";

      setRecord(updatedRecord);

      axios
        .put(baseUrl + `update-academic-year/${row._id}`, { status: "CLOSE" })
        .then((response) => {
          console.log("Academic year status updated in the database.");
        })
        .catch((error) => {
          console.error("Error updating academic year status:", error);
        });
    }
  };

  const handleFilter = (e) => {
    const value = e.target.value.toLowerCase();
    setFilterValue(value);

    const newData = record.filter((row) => {
      return (
        row.academicYear.toLowerCase().includes(value) ||
        row.yearFrom.toLowerCase().includes(value) ||
        row.yearTo.toLowerCase().includes(value) ||
        row.semester.toLowerCase().includes(value) ||
        row.status.toLowerCase().includes(value)
      );
    });

    setFilteredRecords(newData);
  };

  const tableHeaderStyles = {
    headCells: {
      style: {
        fontWeight: "bold",
        fontSize: "14px",
        backgroundColor: "#0d6efd",
        color: "#ffffff",
      },
    },
  };

  return (
    <>
      <div
        className={`container-fluid mt-5 px-3 px-md-5 pb-5 scrollable-container studentViolation ${
          isToggled ? "dark" : ""
        }`}
      >
        <div
          className={`violation-title mb-md-3 mb-4 text-md-start text-center ${
            isToggled ? "text-light" : ""
          }`}
        >
          <div
            className="display-6 fw-bold text-uppercase"
            style={{ letterSpacing: "2px" }}
          >
            Academic Year
          </div>
          <div className="h6 mb-5">
            Manage and navigate academic years effortlessly
          </div>
        </div>
        <div
          className="d-flex mt-3 justify-content-between align-items-center"
          id="action-btn-student-entry"
        >
          <div className="container-group" id="add-btn">
            <button
              className="btn btn-success btn-sm"
              onClick={() => setModalShow(true)}
            >
              <FontAwesomeIcon icon={faPlus} className="me-1" />
              Add New
            </button>
          </div>
          <div className="mb-1">
            <Form.Control
              type="text"
              onChange={handleFilter}
              value={filterValue}
              placeholder="search"
              id="search-filter"
            />
          </div>
        </div>

        <DataTable
          className="shadow violation-datatable"
          title="Academic Year"
          customStyles={tableHeaderStyles}
          columns={columns}
          data={filteredRecords}
          fixedHeader
          persistTableHead
          pagination
          selectableRowsHighlight
          highlightOnHover
          paginationPerPage={perPage}
          paginationRowsPerPageOptions={rowsPerPageOptions}
          paginationTotalRows={record.length}
          onChangeRowsPerPage={(currentRowsPerPage, currentPage) => {
            setPerPage(currentRowsPerPage);
            setCurrentPage(currentPage);
          }}
          paginationDefaultPage={currentPage}
          onChangePage={(currentPage) => {
            setCurrentPage(currentPage);
          }}
          sortServer={false}
          progressPending={pending}
          progressComponent={
            <div className="my-5">
              <MoonLoader
                className="mx-auto"
                color={"#000000"}
                loading={pending}
                size={40}
                aria-label="Loading Spinner"
                data-testid="loader"
              />
              <div className="leader text-center">Please wait...</div>
            </div>
          }
        />
      </div>
      <CreateAcademicYear
        show={modalShow}
        onHide={() => setModalShow(false)}
        setRecord={setRecord}
        setFilteredRecords={setFilteredRecords}
      />
    </>
  );
}

function CreateAcademicYear({ setRecord, setFilteredRecords, ...props }) {
  const { baseUrl } = useContext(AdminContext);
  const [yearFrom, setYearFrom] = useState("");
  const [yearTo, setYearTo] = useState("");
  const [academicYear, setAcademicYear] = useState("");
  const [semester, setSemester] = useState("");
  const [isExist, setIsExist] = useState(false);

  const handleYearFromChange = (e) => {
    setIsExist(false);
    if (e.target.value == "") {
      setYearFrom("");
      setYearTo("");
      setAcademicYear("");
    } else {
      const selectedYearFrom = parseInt(e.target.value, 10);
      setYearFrom(selectedYearFrom);

      // Automatically set yearTo to the next year
      const nextYear = selectedYearFrom + 1;
      setYearTo(nextYear);

      // Update academicYear
      setAcademicYear(`${selectedYearFrom} - ${nextYear}`);
    }
  };

  const handleAcadYearSubmit = (e) => {
    e.preventDefault();

    Swal.fire({
      title: "Review Information",
      html: `<p class="lead fw-bold"> Before you proceed, please review the following data you've entered:</p><br>
      <div class="container-fluid d-flex flex-column justify-content-start align-items-center">
        <div class="row d-flex justify-content-center align-items-start w-100">
          <div class="col-md-6 px-3 text-center">
            <p class="lead">Academic Year:</p>
            <p class="fw-bolder">${academicYear}</p>
            <p class="lead">Year To:</p>
            <p class="fw-bolder">${yearTo}</p>
          
          </div>
          <div class="col-md-6 px-3 text-center">
            <p class="lead">Year From:</p>
            <p class="fw-bolder">${yearFrom}</p>
            <p class="lead">Semester:</p>
            <p class="fw-bolder">${semester} </p>
          </div<
        </div>
      </div>`,
      icon: "warning",
      showCancelButton: true,
      position: "top",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Proceed!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .post(baseUrl + "create-academic-year", {
            academicYear,
            yearFrom,
            yearTo,
            semester,
          })
          .then((res) => {
            if (res.data.isExist === true) {
              return setIsExist(true);
            } else {
              Swal.fire({
                position: "center",
                icon: "success",
                title: "Success!",
                text: "New Academic Year has been added!",
                showConfirmButton: false,
                timer: 2000,
                padding: "3em",
              });

              setRecord((prevRecords) => [...prevRecords, res.data.acadYear]);
              setFilteredRecords((prevFilteredRecords) => [
                ...prevFilteredRecords,
                res.data.acadYear,
              ]);

              props.onHide();
              setYearFrom("");
              setYearTo("");
              setAcademicYear("");
              setSemester("");
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
  };

  const sanitizePhoneNumber = (e) => {
    e.target.value = e.target.value.replace(/[^0-9]/g, "");
  };

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      backdrop="static"
      onHide={() => {
        props.onHide();
        setYearFrom("");
        setYearTo("");
        setAcademicYear("");
        setSemester("");
        setIsExist(false);
      }}
      top="true"
    >
      <Form onSubmit={handleAcadYearSubmit} autoComplete="off">
        <Modal.Header closeButton className="bg-success text-light">
          <Modal.Title
            className="text-uppercase fw-bold"
            id="contained-modal-title-vcenter"
          >
            <FontAwesomeIcon icon={faCalendarDays} className="icons me-2" />{" "}
            Create Academic Year
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {isExist ? (
            <p className="alert alert-danger text-center">
              Academic Year and Semester Already Exist!
            </p>
          ) : null}
          <div className="container">
            <div className="row">
              <div className="col-12">
                <FloatingLabel
                  controlId="floatingInput"
                  label="ACADEMIC YEAR"
                  className="mb-3"
                >
                  <Form.Control
                    type="tel"
                    placeholder="name@example.com"
                    value={academicYear}
                    disabled
                  />
                </FloatingLabel>
                <FloatingLabel
                  controlId="floatingYearFrom"
                  label="YEAR FROM"
                  className="mb-3"
                >
                  <Form.Control
                    type="text"
                    placeholder="Year From"
                    value={yearFrom ?? ""}
                    onChange={handleYearFromChange}
                    pattern="[0-9]{4}"
                    maxlength="4"
                    max="2100"
                    onInput={sanitizePhoneNumber}
                    required
                  />
                </FloatingLabel>
                <FloatingLabel
                  controlId="floatingYearTo"
                  label="YEAR TO"
                  className="mb-3"
                  required
                >
                  <Form.Control
                    type="tel"
                    placeholder="Year To"
                    value={yearTo ?? ""}
                    disabled
                  />
                </FloatingLabel>
                <FloatingLabel
                  controlId="floatingSemester"
                  label="SEMESTER"
                  className="mb-3"
                >
                  <Form.Select
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    aria-label="Floating label select example"
                    required
                  >
                    <option value="" hidden defaultChecked>
                      Choose Semester
                    </option>
                    <option value="1ST SEM">1ST SEM</option>
                    <option value="2ND SEM">2ND SEM</option>
                    <option value="MIDYEAR">MIDYEAR</option>
                  </Form.Select>
                </FloatingLabel>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" type="submit">
            Save
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              props.onHide();
              setYearFrom("");
              setYearTo("");
              setAcademicYear("");
              setSemester("");
              setIsExist(false);
            }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
