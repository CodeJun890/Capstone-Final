import React from "react";
import axios from "axios";
import { useState, useEffect, useContext } from "react";
import DataTable from "react-data-table-component";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import MoonLoader from "react-spinners/MoonLoader";
import { SubAdminContext } from "../../../Context/SubAdminContext";
export default function StudentListModal({
  showStudentListModal,
  setShowStudentListModal,
}) {
  const { baseUrl, setCurrentStudent } = useContext(SubAdminContext);
  const [perPage, setPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPageOptions = [5, 10, 20, 30];
  const [filterValue, setFilterValue] = useState("");
  const [pending, setPending] = React.useState(true);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [record, setRecord] = useState([]);

  useEffect(() => {
    if (showStudentListModal) {
      axios
        .get(baseUrl + "fetch-students")
        .then((res) => {
          if (res.status === 200) {
            setRecord(res.data.students);
            setFilteredRecords(res.data.students);
            setPending(false);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);
  const columns = [
    {
      name: "Actions",
      cell: (row) => (
        <Button
          size="sm"
          variant="primary"
          onClick={() => handleSelect(row._id)}
        >
          SELECT
        </Button>
      ),
    },
    {
      name: "Student Number",
      selector: (row, index) => row.studentNumber,
      sortable: true,
    },
    {
      name: "Name",
      selector: (row) =>
        row.lastName +
          ", " +
          row.firstName +
          " " +
          row.middleName.charAt(0) +
          "." +
          row.suffix ?? "",
      sortable: true,
    },
    {
      name: "Year | Section",
      selector: (row) => row.sectionYear,
      sortable: true,
    },
  ];

  const tableHeaderStyles = {
    headCells: {
      style: {
        fontWeight: "bold",
        fontSize: "14px",
      },
    },
  };

  const handleFilter = (e) => {
    const value = e.target.value.toLowerCase();
    setFilterValue(value);

    const newData = record.filter((row) => {
      return (
        row.studentNumber.toLowerCase().includes(value) ||
        row.firstName.toLowerCase().includes(value) ||
        row.lastName.toLowerCase().includes(value) ||
        row.middleName.toLowerCase().includes(value) ||
        row.sectionYear.toLowerCase().includes(value)
      );
    });

    setFilteredRecords(newData);
  };

  const handleClose = () => {
    setShowStudentListModal(false);
  };

  const handleSelect = (id) => {
    setCurrentStudent(id);
    handleClose();
  };

  return (
    <>
      <Modal
        size="xl"
        show={showStudentListModal}
        onHide={handleClose}
        backdrop="static"
        centered
        keyboard={false}
      >
        <Modal.Header closeButton className="bg-success text-light">
          <Modal.Title className="text-uppercase fw-bold">
            List of Students
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex justify-content-end align-items-center">
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
    </>
  );
}
