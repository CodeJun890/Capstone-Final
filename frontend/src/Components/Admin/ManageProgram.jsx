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
  faClipboardList,
  faPenToSquare,
} from "@fortawesome/free-solid-svg-icons";
import Button from "react-bootstrap/esm/Button";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import Swal from "sweetalert2";
import { AdminContext } from "../../../Context/AdminContext";
export default function ManageProgram({ isToggled }) {
  const { baseUrl, setCurrentProgramList } = useContext(AdminContext);
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
      .get(baseUrl + "program-list")
      .then((res) => {
        setRecord(res.data.program);
        setFilteredRecords(res.data.program);
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
      name: "Program Code",
      selector: (row) => row.program_code,
      sortable: true,
    },
    {
      name: "Program Description",
      selector: (row) => row.program_description,
      wrap: true,
      sortable: true,
    },
    {
      name: "Program Type",
      selector: (row) => row.program_type,
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="btn-cont d-flex column-gap-1 justify-content-around align-items-center flex-nowrap">
          <div
            className="h6 btn-edit me-2 text-primary"
            style={{ cursor: "pointer" }}
            onClick={() => {
              handleEditProgramList(row._id);
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
                  Swal.fire("Deleted!", "Program has been deleted.", "success");
                  handleDeleteProgramList(row._id);
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

  const handleDeleteProgramList = (programId) => {
    axios
      .delete(`${baseUrl}delete-program-list/${programId}`)
      .then((res) => {
        setRecord((prevRecord) =>
          prevRecord.filter((program) => program._id !== programId)
        );
        setFilteredRecords((prevFilteredRecords) =>
          prevFilteredRecords.filter((program) => program._id !== programId)
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleEditProgramList = (id) => {
    setCurrentProgramList(id);
    setEditModalShow(true);
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
            Manage Program
          </div>
          <div className="h6 mb-5">Add and Manage Programs</div>
        </div>
        <div
          className="d-flex mt-3 justify-content-between align-items-center"
          id="action-btn-student-entry"
        >
          <div className="container-group" id="add-btn">
            <button
              className="btn btn-success btn-sm ms-1"
              onClick={() => setModalShow(true)}
            >
              <FontAwesomeIcon icon={faPlus} className="me-1" />
              Add Program
            </button>
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
          title="List of Programs"
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
