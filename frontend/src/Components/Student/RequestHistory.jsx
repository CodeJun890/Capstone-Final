import React, { useState, useRef, useContext, useEffect } from "react";
import DataTable from "react-data-table-component";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import MoonLoader from "react-spinners/MoonLoader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileAlt } from "@fortawesome/free-solid-svg-icons";
import Button from "react-bootstrap/esm/Button";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import Swal from "sweetalert2";
import format from "date-fns/format";
import { StudentContext } from "../../../Context/StudentContext";

export default function RequestHistory({ isToggled }) {
  const { baseUrl, userData, setCurrentRequestHistory } =
    useContext(StudentContext);
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
      .get(baseUrl + `fetch-request-history/${userData._id}`)
      .then((res) => {
        if (res.status === 200) {
          setRecord(res.data.history);
          setFilteredRecords(res.data.history);
          setPending(false);
        }
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
      name: "Date of Request",
      selector: (row) => format(new Date(row.request_date), "MMMM d, yyyy"),
      sortable: true,
    },
    {
      name: "Request Purpose",
      selector: (row) => row.request_purpose,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row.request_status,
      cell: (row) => (
        <div className="d-flex mt-3 align-items-center justify-content-center">
          <p
            className="text-uppercase px-2 py-1 rounded text-light"
            style={{ backgroundColor: getStatusColor(row.request_status) }}
          >
            {row.request_status}
          </p>
        </div>
      ),
    },
    {
      name: "Action",
      cell: (row) => (
        <div>
          <div
            className="btn btn-warning btn-sm"
            onClick={() => handleViewHistory(row._id)}
          >
            View
          </div>
        </div>
      ),
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "rejected":
        return "rgb(220, 53, 69)";
      case "approved":
        return "#198754";
    }
  };

  const handleViewHistory = (requestId) => {
    setCurrentRequestHistory(requestId);
    setModalShow(true);
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
            Request History
          </div>
          <div className="h6 mb-5">View request history</div>
        </div>
        <div
          className="d-flex mt-3 justify-content-end align-items-center"
          id="action-btn-student-entry"
        >
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
          title="History"
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
      <ViewRequestHistory show={modalShow} onHide={() => setModalShow(false)} />
    </>
  );
}

function ViewRequestHistory({ ...props }) {
  const {
    baseUrl,
    currentRequestHistory,
    viewCurrentRequest,
    setViewCurrentRequest,
  } = useContext(StudentContext);
  useEffect(() => {
    if (currentRequestHistory) {
      axios
        .get(`${baseUrl}view-request-history/${currentRequestHistory}`)
        .then((res) => {
          if (res.status === 200) {
            setViewCurrentRequest(res.data.history);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [currentRequestHistory]);
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      backdrop="static"
      onHide={() => {
        props.onHide();
      }}
      top="true"
    >
      <Modal.Header closeButton className="bg-success text-light">
        <Modal.Title
          className="text-uppercase fw-bold"
          id="contained-modal-title-vcenter"
        >
          <FontAwesomeIcon icon={faFileAlt} className="icons me-1" /> View
          Request History
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="container">
          <div className="row">
            <div className="col-12">
              <FloatingLabel
                controlId="floatingName"
                label="Student Name"
                className="mb-3"
              >
                <Form.Control
                  type="text"
                  placeholder="Student Name"
                  value={viewCurrentRequest.student_name ?? ""}
                  readOnly
                />
              </FloatingLabel>
              <FloatingLabel
                controlId="floatingProgram"
                label="Student Program"
                className="mb-3"
              >
                <Form.Control
                  type="text"
                  placeholder="Student Program"
                  value={viewCurrentRequest.student_program ?? ""}
                  readOnly
                />
              </FloatingLabel>
              <FloatingLabel
                controlId="floatingSex"
                label="Sex"
                className="mb-3"
              >
                <Form.Control
                  type="text"
                  placeholder="Sex"
                  value={viewCurrentRequest.student_sex ?? ""}
                  readOnly
                />
              </FloatingLabel>
              <Form.Group className="mb-3" controlId="purposeOfRequest">
                <Form.Label className="fw-bold">Purpose of Request</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  value={viewCurrentRequest.request_purpose}
                  readOnly
                />
              </Form.Group>
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => {
            props.onHide();
          }}
        >
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
