import React, { useState, useContext, useEffect } from "react";
import DataTable from "react-data-table-component";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import MoonLoader from "react-spinners/MoonLoader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faUserPen,
  faTrashAlt,
  faFileAlt,
  faBan,
  faPenToSquare,
} from "@fortawesome/free-solid-svg-icons";
import Button from "react-bootstrap/esm/Button";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import Swal from "sweetalert2";
import format from "date-fns/format";
import PulseLoader from "react-spinners/PulseLoader";
import { StudentContext } from "../../../Context/StudentContext";
export default function StudentRequest({ isToggled }) {
  const { baseUrl, currentRequest, setCurrentRequest } =
    useContext(StudentContext);
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
      name: "Request Status",
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
      name: "Reason for Request",
      selector: (row) => row.request_purpose,
      sortable: true,
    },
    {
      name: "Date of Request",
      selector: (row) => format(new Date(row.createdAt), "MMMM d, yyyy"),
      wrap: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="btn-cont d-flex column-gap-1 justify-content-around align-items-center flex-nowrap">
          <div
            className="h6 btn-edit me-2 text-primary"
            style={{ cursor: "pointer" }}
            onClick={() => {
              handleEditRequest(row._id);
            }}
          >
            <FontAwesomeIcon icon={faPenToSquare} />
          </div>
          <div
            className="h6 btn-delete text-danger"
            style={{ cursor: "pointer" }}
            onClick={() => {
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
                  handleDeleteRequest(row._id);
                }
              });
            }}
          >
            <FontAwesomeIcon icon={faTrashAlt} />
          </div>
        </div>
      ),
    },
  ];

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

  const handleDeleteRequest = (requestId) => {
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

  const handleEditRequest = (requestId) => {
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
          className="d-flex mt-3 justify-content-between align-items-center"
          id="action-btn-student-entry"
        >
          <div>
            <div
              className="btn btn-success btn-sm"
              onClick={() => setModalShow(true)}
            >
              <FontAwesomeIcon icon={faPlus} className="me-1" />
              Create Request
            </div>
          </div>
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
      <CreateGoodMoralRequest
        show={modalShow}
        onHide={() => setModalShow(false)}
        setRecord={setRecord}
        setFilteredRecords={setFilteredRecords}
      />
      <EditGoodMoralRequest
        show={editModalShow}
        onHide={() => setEditModalShow(false)}
        setFilteredRecords={setFilteredRecords}
      />
    </>
  );
}

function EditGoodMoralRequest({ isToggled, setFilteredRecords, ...props }) {
  const {
    baseUrl,
    currentRequest,
    requestList,
    setRequestList,
    requestRecord,
    setRequestRecord,
    userData,
  } = useContext(StudentContext);

  const [resolving, setResolving] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

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

  const updatedRequestList = {
    request_purpose: requestList.request_purpose,
  };

  const handleDisableEdit = () => {
    setIsEdit(!isEdit);
  };

  const handleSubmitUpdateRequest = async (e) => {
    e.preventDefault();
    setResolving(true);
    const requestId = requestList._id;

    try {
      const res = await axios.patch(
        `${baseUrl}update-goodmoral-request/${requestId}`,
        updatedRequestList
      );

      setRequestRecord((prevRecord) =>
        prevRecord.map((record) =>
          record._id === requestId
            ? { ...record, ...updatedRequestList }
            : record
        )
      );

      setFilteredRecords((prevFilteredRecords) =>
        prevFilteredRecords.map((requestList) =>
          requestList._id === requestId
            ? { ...requestList, ...updatedRequestList }
            : requestList
        )
      );

      Swal.fire({
        position: "center",
        icon: "success",
        title: "Success!",
        text: "Violation list has been updated!",
        showConfirmButton: false,
        timer: 2000,
        padding: "3em",
      });
      setResolving(false);
      props.onHide();
    } catch (err) {
      console.log("Error in updating violation list data: ", err);
      setResolving(false);
    }
  };

  return (
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
      <Form onSubmit={handleSubmitUpdateRequest} autoComplete="off">
        <Modal.Header closeButton className="bg-success text-light">
          <Modal.Title
            className="text-uppercase fw-bold"
            id="contained-modal-title-vcenter"
          >
            <FontAwesomeIcon icon={faFileAlt} className="icons me-1" /> Create
            New Request
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
                    onChange={(e) =>
                      setRequestList((prevRecords) => ({
                        ...prevRecords,
                        request_purpose: e.target.value,
                      }))
                    }
                    disabled={!isEdit}
                    required
                  />
                </Form.Group>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="container-fluid d-flex justify-content-between align-items-center">
            {!isEdit && (
              <Button variant="warning" onClick={() => handleDisableEdit()}>
                <FontAwesomeIcon icon={faUserPen} className="me-1" />
                Edit
              </Button>
            )}
            {isEdit && (
              <Button variant="secondary" onClick={() => handleDisableEdit()}>
                <FontAwesomeIcon icon={faBan} className="me-1" />
                Cancel
              </Button>
            )}
            <div>
              <Button
                variant="secondary"
                className="me-1"
                onClick={() => {
                  props.onHide();
                  setResolving(false);
                  setIsEdit(false);
                }}
              >
                Close
              </Button>
              <Button variant="success" type="submit">
                Submit {""}
                {
                  <PulseLoader
                    className="ms-2"
                    color={"#ffffff"}
                    loading={resolving}
                    size={5}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                  />
                }
              </Button>
            </div>
          </div>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

function CreateGoodMoralRequest({ setRecord, setFilteredRecords, ...props }) {
  const { baseUrl, userData } = useContext(StudentContext);
  const [resolving, setResolving] = useState(false);
  const [requestPurpose, setRequestPurpose] = useState("");

  const [isExist, setIsExist] = useState(false);

  const handleSubmitRequest = (e) => {
    e.preventDefault();
    setResolving(true);
    const data = {
      student_id: userData._id,
      student_name: `${userData.firstName} ${userData.middleName} ${
        userData.lastName
      } ${userData.suffix ?? ""}`,
      student_program: userData.course,
      student_sex: userData.gender,
      request_purpose: requestPurpose,
    };
    axios
      .post(baseUrl + "create-goodmoral-request", data)
      .then((res) => {
        if (res.status === 201) {
          setRecord((prevRecords) => [...prevRecords, res.data.createdRequest]);
          setFilteredRecords((prevFilteredRecords) => [
            ...prevFilteredRecords,
            res.data.createdRequest,
          ]);
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Success!",
            text: `${res.data.message}`,
            showConfirmButton: false,
            timer: 2000,
            padding: "3em",
          });
          setResolving(false);
          clearInputFields();
          props.onHide();
        }
      })
      .catch((err) => {
        console.log(err);
        setResolving(false);
      });
  };

  const clearInputFields = () => {
    setRequestPurpose("");
    setResolving(false);
  };

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      backdrop="static"
      onHide={() => {
        props.onHide();
        clearInputFields();
        setIsExist(false);
      }}
      top="true"
    >
      <Form onSubmit={handleSubmitRequest} autoComplete="off">
        <Modal.Header closeButton className="bg-success text-light">
          <Modal.Title
            className="text-uppercase fw-bold"
            id="contained-modal-title-vcenter"
          >
            <FontAwesomeIcon icon={faFileAlt} className="icons me-1" /> Create
            New Request
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {isExist ? (
            <p className="alert alert-danger text-center">
              This Program Already Exists
            </p>
          ) : null}
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
                    value={
                      `${userData.firstName} ${userData.middleName} ${
                        userData.lastName
                      } ${userData.suffix ?? ""}` ?? ""
                    }
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
                    value={userData.course ?? ""}
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
                    value={userData.gender ?? ""}
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
                    value={requestPurpose}
                    onChange={(e) => setRequestPurpose(e.target.value)}
                    required
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
              clearInputFields();
              setIsExist(false);
            }}
          >
            Close
          </Button>
          <Button variant="success" type="submit">
            Submit {""}
            {
              <PulseLoader
                className="ms-2"
                color={"#ffffff"}
                loading={resolving}
                size={5}
                aria-label="Loading Spinner"
                data-testid="loader"
              />
            }
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
