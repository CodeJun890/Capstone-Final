import React, { useState, useRef, useEffect, useContext } from "react";
import DataTable from "react-data-table-component";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import axios from "axios";
import { StudentContext } from "../../../Context/StudentContext";

export default function StudentViolation({ isToggled }) {
  const {
    baseUrl,
    userData,
    studentRecordViolation,
    setStudentRecordViolation,
    violationId,
    setViolationId,
  } = useContext(StudentContext);
  const [perPage, setPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPageOptions = [5, 10, 20, 30];
  const [showViewReport, setShowViewReport] = React.useState(false);
  const [filterValue, setFilterValue] = useState("");
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [record, setRecord] = useState([]);
  const [pending, setPending] = useState(true);

  const [isClicked, setIsClicked] = useState(false);

  useEffect(() => {
    axios
      .get(baseUrl + `list-all-student-violation/${userData._id}`)
      .then((res) => {
        setRecord(res.data.studentViolation);
        setFilteredRecords(res.data.studentViolation);
        setPending(false);
      });
  }, []);
  const columns = [
    {
      name: "Violation Type",
      selector: (row) => row.violation_type,
      sortable: true,
    },
    {
      name: "Violation Description",
      selector: (row) => row.violation_description,
      width: "350px",
      sortable: true,
    },
    {
      name: "Offense",
      selector: (row) => row.violation_offense,
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
      sortable: true,
    },
    {
      name: "Report",
      cell: (row) => (
        <button
          className="btn btn-warning btn-sm"
          onClick={() => {
            ViewReportStudent(row._id);
          }}
        >
          View Report
        </button>
      ),
    },
  ];

  const ViewReportStudent = (violationId) => {
    setViolationId(violationId);
    setShowViewReport(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "#dc3545";
      case "resolved":
        return "#198754";
      default:
        return "transparent";
    }
  };

  const handleFilter = (e) => {
    const value = e.target.value.toLowerCase();
    setFilterValue(value);

    const newData = record.filter((row) => {
      return (
        row.violation_type.toLowerCase().includes(value) ||
        row.violation_offense.toLowerCase().includes(value) ||
        row.violation_description.toLowerCase().includes(value) ||
        row.violation_sanction.toLowerCase().includes(value)
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
            My Violation
          </div>
          <div className="h6">
            Access and review your own violation records.
          </div>
        </div>
        <div className="d-flex mt-3 justify-content-end align-items-center">
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
          title="Violation Report"
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
          paginationTotalRows={filteredRecords.length}
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
        />
        <ViewReport
          show={showViewReport}
          onHide={() => setShowViewReport(false)}
        />
      </div>
    </>
  );
}

function ViewReport({ show, onHide }) {
  const {
    baseUrl,
    violationId,
    studentRecordViolation,
    setStudentRecordViolation,
  } = useContext(StudentContext);

  useEffect(() => {
    if (violationId) {
      axios
        .get(baseUrl + `list-user-student-violation/${violationId}`)
        .then((res) => {
          setStudentRecordViolation(res.data.studentViolation[0]);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [violationId]);

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      backdrop="static"
      aria-labelledby="view report modal"
      top="true"
    >
      <Modal.Header className="bg-success" closeButton>
        <Modal.Title
          id="Report viewing"
          className="text-uppercase fw-bold text-light"
        >
          View Report
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12">
              <div className="h5 text-uppercase fw-bold my-3">
                Violation Details
              </div>
              <Form.Label
                className="fw-bold"
                htmlFor="inputType"
                style={{ minWidth: "125px" }}
              >
                Type
              </Form.Label>
              <div className="input-wrap d-flex align-items-center mt-1">
                <Form.Control
                  type="text"
                  id="inputType"
                  value={studentRecordViolation.violation_type ?? ""}
                  required
                  readOnly
                />
              </div>
              <Form.Label className="fw-bold" htmlFor="inputViolationDescript">
                Violation Description
              </Form.Label>
              <div className="input-wrap d-flex align-items-center mt-1">
                <Form.Control
                  as="textarea"
                  id="inputViolationDescript"
                  value={studentRecordViolation.violation_description ?? ""}
                  rows={3}
                  readOnly
                />
              </div>
              <Form.Label
                className="fw-bold"
                htmlFor="inputOffense"
                style={{ minWidth: "125px" }}
              >
                Offense
              </Form.Label>
              <div className="input-wrap d-flex align-items-center mt-1">
                <Form.Control
                  type="text"
                  id="inputOffense"
                  value={studentRecordViolation.violation_offense ?? ""}
                  readOnly
                />
              </div>
              <Form.Label
                className="fw-bold"
                htmlFor="inputSanction"
                style={{ minWidth: "125px" }}
              >
                Sanction
              </Form.Label>
              <div className="input-wrap d-flex align-items-center mt-1">
                <Form.Control
                  type="text"
                  id="inputSanction"
                  value={studentRecordViolation.violation_sanction ?? ""}
                  readOnly
                />
              </div>
              <Form.Label
                className="fw-bold"
                htmlFor="inputRemarks"
                style={{ minWidth: "125px" }}
              >
                Remarks
              </Form.Label>
              <div className="input-wrap d-flex align-items-center mt-1">
                <Form.Control
                  type="text"
                  id="inputRemarks"
                  value={studentRecordViolation.remarks ?? ""}
                  readOnly
                />
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div>
          <Button className="btn btn-secondary" onClick={() => onHide()}>
            Close
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
