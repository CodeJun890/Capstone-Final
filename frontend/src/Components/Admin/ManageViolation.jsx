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
  faListCheck,
  faPenToSquare,
} from "@fortawesome/free-solid-svg-icons";
import Button from "react-bootstrap/esm/Button";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import Swal from "sweetalert2";
import { AdminContext } from "../../../Context/AdminContext";
import ExpandableData from "./ExpandableData";
export default function ManageViolation({ isToggled }) {
  const { baseUrl, setCurrentViolationList } = useContext(AdminContext);
  const [perPage, setPerPage] = useState(3);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPageOptions = [3];
  const [filterValue, setFilterValue] = useState("");
  const [pending, setPending] = React.useState(true);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [modalShow, setModalShow] = React.useState(false);
  const [editModalShow, setEditModalShow] = React.useState(false);
  const [record, setRecord] = useState([]);

  useEffect(() => {
    axios
      .get(baseUrl + "list-all-violation")
      .then((res) => {
        setRecord(res.data.violation);
        setFilteredRecords(res.data.violation);
        setPending(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const columns = [
    {
      name: "Violation Type",
      selector: (row) => row.violation_type,
      width: "200px",
      sortable: true,
    },
    {
      name: "Violation Description",
      selector: (row) => row.violation_description,
      width: "350px",
      sortable: true,
    },
    {
      name: "Violation Sanction",
      width: "350px",
      selector: (row) => row.violation_sanction,
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
              handleEditViolationList(row._id);
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
                  Swal.fire(
                    "Deleted!",
                    "Violation has been deleted.",
                    "success"
                  );
                  handleDeleteViolationList(row._id);
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

  const handleDeleteViolationList = (violationId) => {
    axios
      .delete(`${baseUrl}delete-violation-list/${violationId}`)
      .then((res) => {
        setRecord((prevRecord) =>
          prevRecord.filter((violation) => violation._id !== violationId)
        );
        setFilteredRecords((prevFilteredRecords) =>
          prevFilteredRecords.filter(
            (violation) => violation._id !== violationId
          )
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleEditViolationList = (id) => {
    setCurrentViolationList(id);
    setEditModalShow(true);
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

  const ExpandedComponent = ({ data }) => <ExpandableData data={data} />;

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
            Manage Violation List
          </div>
          <div className="h6 mb-5">Add and Manage Violation List</div>
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
        <div className="me-0 ">
          <DataTable
            className="shadow violation-datatable"
            title="List of Violations"
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
            expandableRows
            expandableRowsComponent={ExpandedComponent}
            fixedHeaderScrollHeight="300px"
            responsive
          />
        </div>
      </div>
      <CreateViolation
        show={modalShow}
        onHide={() => setModalShow(false)}
        setRecord={setRecord}
        setFilteredRecords={setFilteredRecords}
      />
      <EditViolationListModal
        show={editModalShow}
        onHide={() => setEditModalShow(false)}
        setFilteredRecords={setFilteredRecords}
      />
    </>
  );
}

function EditViolationListModal({ isToggled, setFilteredRecords, ...props }) {
  const {
    baseUrl,
    violationList,
    setViolationList,
    currentViolationList,
    record,
    setRecord,
  } = useContext(AdminContext);

  useEffect(() => {
    if (currentViolationList) {
      axios
        .get(baseUrl + `violation-list/${currentViolationList}`)
        .then((res) => {
          setViolationList(res.data.violationList);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [currentViolationList]);

  const updatedViolationList = {
    violation_type: violationList.violation_type,
    violation_description: violationList.violation_description,
    violation_offense: violationList.violation_offense,
    violation_sanction: violationList.violation_sanction,
  };

  const handleViolationListUpdate = async (e) => {
    e.preventDefault();

    const violationId = violationList._id;

    try {
      const res = await axios.patch(
        `${baseUrl}update-violation-list-row/${violationId}`,
        updatedViolationList
      );

      setRecord((prevRecord) =>
        prevRecord.map((record) =>
          record._id === violationId
            ? { ...record, ...updatedViolationList }
            : record
        )
      );

      setFilteredRecords((prevFilteredRecords) =>
        prevFilteredRecords.map((violationList) =>
          violationList._id === violationId
            ? { ...violationList, ...updatedViolationList }
            : violationList
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
          Edit Violation Details
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="container">
          <div className="row">
            <div className="col-12">
              <FloatingLabel
                controlId="floatingViolationType"
                label="Violation Type"
                className="mb-3"
              >
                <Form.Select
                  value={violationList.violation_type ?? ""}
                  onChange={(e) =>
                    setViolationList((prevRecords) => ({
                      ...prevRecords,
                      violation_type: e.target.value,
                    }))
                  }
                  aria-label="Floating label select example"
                  required
                >
                  <option value="" hidden defaultChecked>
                    Select Type
                  </option>
                  <option value="MINOR OFFENSE">MINOR OFFENSE</option>
                  <option value="MAJOR OFFENSE">MAJOR OFFENSE</option>
                </Form.Select>
              </FloatingLabel>
              <FloatingLabel
                controlId="floatingViolationDescription"
                label="Violation Description"
                className="mb-3"
              >
                <Form.Control
                  as="textarea"
                  style={{ height: "100px" }}
                  placeholder="Violation Description"
                  value={violationList.violation_description ?? ""}
                  onChange={(e) =>
                    setViolationList((prevRecords) => ({
                      ...prevRecords,
                      violation_description: e.target.value,
                    }))
                  }
                  required
                />
              </FloatingLabel>
              <FloatingLabel
                controlId="floatingViolationOffense"
                label="Violation Offense"
                className="mb-3"
              >
                <Form.Select
                  value={violationList.violation_offense ?? ""}
                  onChange={(e) =>
                    setViolationList((prevRecords) => ({
                      ...prevRecords,
                      violation_offense: e.target.value,
                    }))
                  }
                  aria-label="Floating label select example"
                  required
                >
                  <option value="" hidden defaultChecked>
                    Select Offense
                  </option>
                  <option value="1ST OFFENSE">1ST OFFENSE</option>
                  <option value="2ND OFFENSE">2ND OFFENSE</option>
                  <option value="3RD OFFENSE">3RD OFFENSE</option>
                </Form.Select>
              </FloatingLabel>
              <FloatingLabel
                controlId="floatingSanction"
                label="Violation Sanction"
                className="mb-3"
              >
                <Form.Control
                  as="textarea"
                  style={{ height: "100px" }}
                  placeholder="name@example.com"
                  value={violationList.violation_sanction ?? ""}
                  onChange={(e) =>
                    setViolationList((prevRecords) => ({
                      ...prevRecords,
                      violation_sanction: e.target.value,
                    }))
                  }
                  required
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
            onClick={handleViolationListUpdate}
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

function CreateViolation({ setRecord, setFilteredRecords, ...props }) {
  const { baseUrl } = useContext(AdminContext);
  const [violationType, setViolationType] = useState("");
  const [violationDescription, setViolationDescription] = useState("");
  const [violationOffense, setViolationOffense] = useState("");
  const [violationSanction, setViolationSanction] = useState("");
  const [isExist, setIsExist] = useState(false);

  const handleViolationListSubmit = (e) => {
    e.preventDefault();

    axios
      .post(baseUrl + "generate-violation", {
        violationType,
        violationDescription,
        violationOffense,
        violationSanction,
      })
      .then((res) => {
        if (res.data.isExist === true) {
          setIsExist(true);
        } else {
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Success!",
            text: "New violation has been added!",
            showConfirmButton: false,
            timer: 2000,
            padding: "3em",
          });

          setRecord((prevRecords) => [...prevRecords, res.data.violation]);
          setFilteredRecords((prevFilteredRecords) => [
            ...prevFilteredRecords,
            res.data.violation,
          ]);
          props.onHide();
          setViolationType("");
          setViolationDescription("");
          setViolationOffense("");
          setViolationSanction("");
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
        setViolationType("");
        setViolationDescription("");
        setViolationOffense("");
        setViolationSanction("");
        setIsExist(false);
      }}
      top="true"
    >
      <Form onSubmit={handleViolationListSubmit} autoComplete="off">
        <Modal.Header closeButton className="bg-success text-light">
          <Modal.Title
            className="text-uppercase fw-bold"
            id="contained-modal-title-vcenter"
          >
            <FontAwesomeIcon icon={faListCheck} className="icons me-2" /> Create
            New Violation
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {isExist ? (
            <p className="alert alert-danger text-center">
              This Violation Already Exists
            </p>
          ) : null}
          <div className="container">
            <div className="row">
              <div className="col-12">
                <FloatingLabel
                  controlId="floatingViolationType"
                  label="Violation Type"
                  className="mb-3"
                >
                  <Form.Select
                    value={violationType}
                    onChange={(e) => setViolationType(e.target.value)}
                    aria-label="Floating label select example"
                    required
                  >
                    <option value="" hidden defaultChecked>
                      Select Type
                    </option>
                    <option value="MINOR OFFENSE">MINOR OFFENSE</option>
                    <option value="MAJOR OFFENSE">MAJOR OFFENSE</option>
                  </Form.Select>
                </FloatingLabel>
                <FloatingLabel
                  controlId="floatingViolationDescription"
                  label="Violation Description"
                  className="mb-3"
                >
                  <Form.Control
                    placeholder="Violation Description"
                    as="textarea"
                    value={violationDescription}
                    onChange={(e) => setViolationDescription(e.target.value)}
                    style={{ height: "100px" }}
                    required
                  />
                </FloatingLabel>
                <FloatingLabel
                  controlId="floatingViolationOffense"
                  label="Violation Offense"
                  className="mb-3"
                >
                  <Form.Select
                    value={violationOffense}
                    onChange={(e) => setViolationOffense(e.target.value)}
                    aria-label="Floating label select example"
                    required
                  >
                    <option value="" hidden defaultChecked>
                      Select Offense
                    </option>
                    <option value="1ST OFFENSE">1ST OFFENSE</option>
                    <option value="2ND OFFENSE">2ND OFFENSE</option>
                    <option value="3RD OFFENSE">3RD OFFENSE</option>
                  </Form.Select>
                </FloatingLabel>
                <FloatingLabel
                  controlId="floatingSanction"
                  label="Violation Sanction"
                  className="mb-3"
                >
                  <Form.Control
                    as="textarea"
                    style={{ height: "100px" }}
                    placeholder="name@example.com"
                    value={violationSanction}
                    onChange={(e) => setViolationSanction(e.target.value)}
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
              setViolationType("");
              setViolationDescription("");
              setViolationOffense("");
              setViolationSanction("");
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
