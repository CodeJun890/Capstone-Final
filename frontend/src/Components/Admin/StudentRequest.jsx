import React, { useState, useContext, useEffect } from "react";
import DataTable from "react-data-table-component";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import MoonLoader from "react-spinners/MoonLoader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileAlt, faClipboardList } from "@fortawesome/free-solid-svg-icons";
import Button from "react-bootstrap/esm/Button";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import Swal from "sweetalert2";
import { AdminContext } from "../../../Context/AdminContext";
import { useNavigate } from "react-router-dom";
export default function StudentRequest({ isToggled }) {
  const { baseUrl, setCurrentRequest } = useContext(AdminContext);
  const [perPage, setPerPage] = useState(3);
  const [currentPage, setCurrentPage] = useState(1);
  const [pending, setPending] = React.useState(true);
  const rowsPerPageOptions = [3];
  const [filterValue, setFilterValue] = useState("");
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [modalShow, setModalShow] = React.useState(false);
  const [editModalShow, setEditModalShow] = React.useState(false);
  const [record, setRecord] = useState([]);

  useEffect(() => {
    axios
      .get(baseUrl + "fetch-all-goodmoral-requests")
      .then((res) => {
        setRecord(res.data.allRequest);
        setFilteredRecords(res.data.allRequest);
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
      name: "Student Name",
      selector: (row) => row.student_name,
      sortable: true,
    },

    {
      name: "Student Program",
      selector: (row) => row.student_program,
      wrap: true,
      sortable: true,
    },
    {
      name: "Reason for Request",
      selector: (row) => row.request_purpose,
      sortable: true,
    },
    {
      name: "Status",
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
      name: "Actions",
      cell: (row) => (
        <div>
          <div
            className="btn btn-warning me-1 btn-sm"
            onClick={() => handleViewRequest(row._id)}
          >
            Evaluate
          </div>
          <div
            className="btn btn-danger btn-sm me-1"
            onClick={() =>
              Swal.fire({
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, delete it!",
              }).then((result) => {
                if (result.isConfirmed) {
                  Swal.fire("Deleted!", "Request has been deleted.", "success");
                  handleRejectRequest(row._id);
                }
              })
            }
          >
            Reject
          </div>
          <div
            className="btn btn-success btn-sm"
            onClick={() => {
              Swal.fire({
                title: "Approve Request?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes",
              }).then((result) => {
                if (result.isConfirmed) {
                  Swal.fire(
                    "Approved!",
                    "Request has been approved.",
                    "success"
                  );
                  handleApproveRequest(row._id);
                }
              });
            }}
          >
            Approve
          </div>
        </div>
      ),
    },
  ];

  const handleApproveRequest = (requestId) => {
    axios
      .get(`${baseUrl}approve-request-student/${requestId}`)
      .then((res) => {
        if (res.status === 200) {
          setRecord((prevRecord) =>
            prevRecord.filter((request) => request._id !== requestId)
          );
          setFilteredRecords((prevFilteredRecords) =>
            prevFilteredRecords.filter((request) => request._id !== requestId)
          );
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleRejectRequest = (requestId) => {
    axios
      .delete(`${baseUrl}delete-goodmoral-request/${requestId}`)
      .then((res) => {
        setRecord((prevRecord) =>
          prevRecord.filter((request) => request._id !== requestId)
        );
        setFilteredRecords((prevFilteredRecords) =>
          prevFilteredRecords.filter((request) => request._id !== requestId)
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleViewRequest = (requestId) => {
    setCurrentRequest(requestId);
    setEditModalShow(true);
  };
  const handleFilter = (e) => {
    const value = e.target.value.toLowerCase();
    setFilterValue(value);

    const newData = record.filter((row) => {
      return (
        row.student_name.toLowerCase().includes(value) ||
        row.student_program.toLowerCase().includes(value) ||
        row.request_status.toLowerCase().includes(value) ||
        row.request_purpose.toLowerCase().includes(value)
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

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "#dc3545";
      case "approved":
        return "#5cb85c";
      default:
        return "transparent";
    }
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
            Good Moral Requests
          </div>
          <div className="h6 mb-5">Manage Good Moral Requests</div>
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
            />
          </div>
        </div>

        <DataTable
          className="shadow violation-datatable"
          title="List of Pending Requests"
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

      <ViewGoodMoralRequest
        show={editModalShow}
        onHide={() => setEditModalShow(false)}
        setFilteredRecords={setFilteredRecords}
        handleApproveRequest={handleApproveRequest}
      />
    </>
  );
}

function ViewGoodMoralRequest({
  isToggled,
  setFilteredRecords,
  handleApproveRequest,
  ...props
}) {
  const { baseUrl, currentRequest, requestList, setRequestList, setModalShow } =
    useContext(AdminContext);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [perPage, setPerPage] = useState(3);
  const [currentPage, setCurrentPage] = useState(1);
  const [pending, setPending] = React.useState(true);
  const rowsPerPageOptions = [3];
  const [record, setRecord] = useState([]);
  const [studentViolation, setStudentViolation] = useState([]);
  const [filterValue, setFilterValue] = useState("");

  useEffect(() => {
    if (currentRequest) {
      axios
        .get(baseUrl + `fetch-individual-request/${currentRequest}`)
        .then((res) => {
          setRequestList(res.data.request);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [currentRequest]);

  const checkViolation = (id) => {
    axios
      .get(baseUrl + `check-student-violation/${id}`)
      .then((res) => {
        if (res.status === 201) {
          Swal.fire({
            icon: "success",
            title: "Congratulations!",
            text: "No violations were found for the specified student",
            showCancelButton: true,
            confirmButtonText: "Generate Good Moral",
          }).then((result) => {
            if (result.isConfirmed) {
              setModalShow(true);
            }
          });
        } else if (res.status === 200) {
          Swal.fire({
            icon: "error",
            title: "Violation Alert!",
            text: "This student has a violation record in our system",
            showCancelButton: true,
            confirmButtonText: "View Violation",
            cancelButtonText: `Cancel`,
          }).then((result) => {
            if (result.isConfirmed) {
              setPending(false);
              handleShow();
              setStudentViolation(res.data.violationExist);
              setRecord(res.data.violationExist);
            }
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const columns = [
    {
      name: "#",
      selector: (row, index) => index + 1,
      sortable: true,
    },
    {
      name: "Violation Type",
      selector: (row) => row.violation_type,
      sortable: true,
    },
    {
      name: "Violation Description",
      selector: (row) => row.violation_description,
      sortable: true,
    },
    {
      name: "Violation Offense",
      selector: (row) => row.violation_offense,
      wrap: true,
      sortable: true,
    },
    {
      name: "Violation Sanction",
      selector: (row) => row.violation_sanction,
      sortable: true,
    },
  ];

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

  const handleFilter = (e) => {
    const value = e.target.value.toLowerCase();
    setFilterValue(value);

    const newData = record.filter((row) => {
      return (
        row.violation_type.toLowerCase().includes(value) ||
        row.violation_description.toLowerCase().includes(value) ||
        row.violation_offense.toLowerCase().includes(value) ||
        row.violation_sanction.toLowerCase().includes(value)
      );
    });

    setStudentViolation(newData);
  };

  return (
    <>
      {/*------ View Modal -------- */}
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        centered
        size="xl"
      >
        <Modal.Header
          className="bg-success text-light text-uppercase"
          closeButton
        >
          <Modal.Title>View Violation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div
            className="d-flex justify-content-end align-items-center"
            id="action-btn-student-entry"
          >
            <div className="mb-1">
              <Form.Control
                type="text"
                onChange={handleFilter}
                value={filterValue}
                placeholder="search"
              />
            </div>
          </div>
          <DataTable
            className="shadow violation-datatable"
            title="Violation Record"
            customStyles={tableHeaderStyles}
            columns={columns}
            data={studentViolation}
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
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/*------ Evaluate Modal -------- */}
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        backdrop="static"
        onHide={() => {
          props.onHide();
          setResolving(false);
          setIsEdit(false);
        }}
        top="true"
      >
        <Modal.Header closeButton className="bg-success text-light">
          <Modal.Title
            className="text-uppercase fw-bold"
            id="contained-modal-title-vcenter"
          >
            <FontAwesomeIcon icon={faFileAlt} className="icons me-1" /> View
            Request
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
                    value={requestList.student_name ?? ""}
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
                    value={requestList.student_program ?? ""}
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
                    value={requestList.student_sex ?? ""}
                    readOnly
                  />
                </FloatingLabel>
                <Form.Group className="mb-3" controlId="purposeOfRequest">
                  <Form.Label className="fw-bold">
                    Purpose of Request
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    value={requestList.request_purpose ?? ""}
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
            className="me-1"
            onClick={() => {
              props.onHide();
            }}
          >
            Close
          </Button>
          <Button
            variant="danger"
            onClick={() => checkViolation(requestList.student_id)}
          >
            Check for Violation
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
