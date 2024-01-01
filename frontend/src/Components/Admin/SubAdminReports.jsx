import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import MoonLoader from "react-spinners/MoonLoader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import format from "date-fns/format";
import {
  faPlus,
  faUserPen,
  faTrashAlt,
  faClipboardList,
} from "@fortawesome/free-solid-svg-icons";
import Button from "react-bootstrap/esm/Button";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import Swal from "sweetalert2";
import { AdminContext } from "../../../Context/AdminContext";
import ViolationEntry from "./ViolationEntry";
export default function SubAdminReports({ isToggled }) {
  const {
    baseUrl,
    setCurrentProgramList,
    setCurrentStudentIncidentId,
    setCurrentViolationIncidentId,
    setIncidentModalTrigger,
    setCurrentEvidenceFile,
    setCurrentId,
  } = useContext(AdminContext);
  const navigate = useNavigate();
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [pending, setPending] = React.useState(true);
  const rowsPerPageOptions = [5, 10, 20, 30];
  const [filterValue, setFilterValue] = useState("");
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [modalShow, setModalShow] = React.useState(false);
  const [editModalShow, setEditModalShow] = React.useState(false);
  const [record, setRecord] = useState([]);

  useEffect(() => {
    axios
      .get(baseUrl + "get-pending-incident-report")
      .then((res) => {
        setRecord(res.data.results);
        setFilteredRecords(res.data.results);
        setPending(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const columns = [
    {
      name: "Report #",
      selector: (row, index) => index + 1,
      sortable: true,
    },
    {
      name: "Assigned Staff",
      selector: (row) => row.assigned_staff,
      sortable: true,
    },
    {
      name: "Reporter Name",
      selector: (row) => row.reporter_name,
      wrap: true,
      sortable: true,
    },
    {
      name: "Date",
      selector: (row) => format(new Date(row.createdAt), "MMMM d, yyyy"),
      sortable: true,
    },
    {
      name: "Time",
      selector: (row) => format(new Date(row.createdAt), "h:mm a"),
      sortable: true,
    },
    {
      name: "Status",
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
        <div className="btn-cont d-flex column-gap-1 justify-content-around align-items-center flex-nowrap">
          <div>
            <div
              className="btn btn-warning btn-sm "
              onClick={() =>
                handleIncidentReport(row.student_id, row.violation_id, row._id)
              }
            >
              Evaluate
            </div>
          </div>
          <div>
            <div
              className="btn-delete"
              style={{ cursor: "pointer" }}
              onClick={() => {
                Swal.fire({
                  title: "Are you sure?",
                  text: "You won't be able to revert this!",
                  icon: "warning",
                  showCancelButton: true,
                  confirmButtonColor: "#3085d6",
                  cancelButtonColor: "#d33",
                  confirmButtonText: "Yes, please proceed!",
                }).then((result) => {
                  if (result.isConfirmed) {
                    Swal.fire(
                      "Deleted!",
                      "Incident Report has been removed.",
                      "success"
                    );
                    handleDeleteIncidentReport(row._id);
                  }
                });
              }}
            >
              <div className="btn btn-danger btn-sm">Reject</div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const handleDeleteIncidentReport = (id) => {
    axios
      .delete(`${baseUrl}delete-incident-report/${id}`)
      .then((res) => {
        setRecord((prevRecords) =>
          prevRecords.filter((studentViolation) => studentViolation._id !== id)
        );
        setFilteredRecords((prevFilteredRecords) =>
          prevFilteredRecords.filter(
            (incidentReport) => incidentReport._id !== id
          )
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleIncidentReport = (
    currentStudent,
    currentViolation,
    incidentReport,
    currentID
  ) => {
    if (currentStudent && currentViolation) {
      setCurrentViolationIncidentId(currentViolation);
      setCurrentStudentIncidentId(currentStudent);
      setIncidentModalTrigger(true);
      setCurrentEvidenceFile(incidentReport);
      setCurrentId(currentID);
      navigate("/violation-entry");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "#dc3545";
      default:
        return "transparent";
    }
  };

  const handleFilter = (e) => {
    const value = e.target.value.toLowerCase();
    setFilterValue(value);

    const newData = record.filter((row) => {
      return (
        row.program_code.toLowerCase().includes(value) ||
        row.program_description.toLowerCase().includes(value) ||
        row.program_type.toLowerCase().includes(value)
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
            Sub-Admin Reports
          </div>
          <div className="h6 mb-5">Manage reports from sub-admin</div>
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
          title="List of Pending Reports"
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
      <CreateProgram
        show={modalShow}
        onHide={() => setModalShow(false)}
        setRecord={setRecord}
        setFilteredRecords={setFilteredRecords}
      />
      <EditProgramListModal
        show={editModalShow}
        onHide={() => setEditModalShow(false)}
        setFilteredRecords={setFilteredRecords}
      />
    </>
  );
}

function EditProgramListModal({ isToggled, setFilteredRecords, ...props }) {
  const {
    baseUrl,
    programList,
    setProgramList,
    currentProgramList,
    setProgramRecord,
  } = useContext(AdminContext);

  useEffect(() => {
    if (currentProgramList) {
      axios
        .get(baseUrl + `program-list/${currentProgramList}`)
        .then((res) => {
          setProgramList(res.data.program);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [currentProgramList]);

  const updatedProgramList = {
    program_code: programList.program_code,
    program_description: programList.program_description,
  };

  const handleProgramListUpdate = async (e) => {
    e.preventDefault();

    const programId = programList._id;

    try {
      const res = await axios.patch(
        `${baseUrl}update-program-list-row/${programId}`,
        updatedProgramList
      );

      setProgramRecord((prevRecord) =>
        prevRecord.map((record) =>
          record._id === programId
            ? { ...record, ...updatedProgramList }
            : record
        )
      );

      setFilteredRecords((prevFilteredRecords) =>
        prevFilteredRecords.map((programList) =>
          programList._id === programId
            ? { ...programList, ...updatedProgramList }
            : programList
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

      props.onHide();
    } catch (err) {
      console.log("Error in updating violation list data: ", err);
    }
  };

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      top="true"
      backdrop="static"
    >
      <Modal.Header closeButton className="bg-success text-light">
        <Modal.Title
          className="text-uppercase fw-bold"
          id="contained-modal-title-vcenter"
        >
          Edit Program Details
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="container">
          <div className="row">
            <div className="col-12">
              <FloatingLabel
                controlId="floatingProgramCode"
                label="Program Code"
                className="mb-3"
              >
                <Form.Control
                  value={programList.program_code ?? ""}
                  onChange={(e) =>
                    setProgramList((prevRecords) => ({
                      ...prevRecords,
                      program_code: e.target.value,
                    }))
                  }
                  aria-label="Floating label select example"
                  required
                />
              </FloatingLabel>
              <FloatingLabel
                controlId="floatingProgramDescription"
                label="Program Description"
                className="mb-3"
              >
                <Form.Control
                  type="text"
                  placeholder="Program Description"
                  value={programList.program_description ?? ""}
                  onChange={(e) =>
                    setProgramList((prevRecords) => ({
                      ...prevRecords,
                      program_description: e.target.value,
                    }))
                  }
                  required
                />
              </FloatingLabel>
              <FloatingLabel
                controlId="floatingProgramType"
                label="Program Type"
                className="mb-3"
              >
                <Form.Control
                  placeholder="Program Type"
                  value={programList.program_type ?? ""}
                  aria-label="Floating label select example"
                  required
                  disabled
                />
              </FloatingLabel>
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div>
          <Button
            className="bg-success border-0 me-1"
            onClick={handleProgramListUpdate}
          >
            Save
          </Button>
          <Button className="bg-secondary border-0 me-1" onClick={props.onHide}>
            Close
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}

function CreateProgram({ setRecord, setFilteredRecords, ...props }) {
  const { baseUrl } = useContext(AdminContext);
  const [programType, setProgramType] = useState("");
  const [programDescription, setProgramDescription] = useState("");
  const [programCode, setProgramCode] = useState("");
  const [isExist, setIsExist] = useState(false);

  const handleProgramListSubmit = (e) => {
    e.preventDefault();

    axios
      .post(baseUrl + "generate-program", {
        programCode,
        programDescription,
      })
      .then((res) => {
        if (res.data.isExist === true) {
          setIsExist(true);
        } else {
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Success!",
            text: "New program has been added!",
            showConfirmButton: false,
            timer: 2000,
            padding: "3em",
          });

          setRecord((prevRecords) => [...prevRecords, res.data.program]);
          setFilteredRecords((prevFilteredRecords) => [
            ...prevFilteredRecords,
            res.data.program,
          ]);
          setProgramDescription("");
          setProgramCode("");
          props.onHide();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      backdrop="static"
      onHide={() => {
        props.onHide();
        setProgramDescription("");
        setProgramCode("");
        setIsExist(false);
      }}
      top="true"
    >
      <Form onSubmit={handleProgramListSubmit} autoComplete="off">
        <Modal.Header closeButton className="bg-success text-light">
          <Modal.Title
            className="text-uppercase fw-bold"
            id="contained-modal-title-vcenter"
          >
            <FontAwesomeIcon icon={faClipboardList} className="icons me-1" />{" "}
            Create New Program
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
                  controlId="floatingProgramCode"
                  label="Program Code"
                  className="mb-3"
                >
                  <Form.Control
                    type="text"
                    placeholder="Program Code"
                    value={programCode}
                    onChange={(e) => setProgramCode(e.target.value)}
                    required
                  />
                </FloatingLabel>
                <FloatingLabel
                  controlId="floatingProgramDescription"
                  label="Program Description"
                  className="mb-3"
                >
                  <Form.Control
                    type="text"
                    placeholder="Program Description"
                    value={programDescription}
                    onChange={(e) => setProgramDescription(e.target.value)}
                    required
                  />
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
              setProgramType("");
              setProgramDescription("");
              setProgramCode("");
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
