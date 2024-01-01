import React from "react";
import axios from "axios";
import { useState, useEffect, useContext } from "react";
import DataTable from "react-data-table-component";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import MoonLoader from "react-spinners/MoonLoader";
import { SubAdminContext } from "../../../Context/SubAdminContext";
export default function ViolationListModal({
  showViolationListModal,
  setShowViolationListModal,
}) {
  const { baseUrl, setCurrentViolationList } = useContext(SubAdminContext);
  const [perPage, setPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPageOptions = [5, 10, 20, 30];
  const [filterValue, setFilterValue] = useState("");
  const [pending, setPending] = React.useState(true);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [record, setRecord] = useState([]);

  useEffect(() => {
    if (showViolationListModal) {
      axios
        .get(baseUrl + "list-all-violation")
        .then((res) => {
          if (res.status === 200) {
            setRecord(res.data.violation);
            setFilteredRecords(res.data.violation);
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
        <div>
          <Button
            size="sm"
            variant="primary"
            onClick={() => handleSelect(row._id)}
          >
            SELECT
          </Button>
        </div>
      ),
    },
    {
      name: "Type",
      selector: (row, index) => row.violation_type,
      wrap: true,
      sortable: true,
    },
    {
      name: "Offense",
      selector: (row, index) => row.violation_offense,
      wrap: true,
      sortable: true,
    },
    {
      name: "Violation Description",
      selector: (row) => row.violation_description,
      wrap: true,
      sortable: true,
    },
    {
      name: "Sanction",
      selector: (row) => row.violation_sanction,
      wrap: true,
      sortable: true,
    },
  ];

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
      },
    },
  };

  const handleClose = () => {
    setShowViolationListModal(false);
  };

  const handleSelect = (id) => {
    setCurrentViolationList(id);
    handleClose();
  };

  return (
    <>
      <Modal
        size="xl"
        show={showViolationListModal}
        onHide={handleClose}
        backdrop="static"
        centered
        keyboard={false}
      >
        <Modal.Header closeButton className="bg-success text-light">
          <Modal.Title className="text-uppercase fw-bold">
            List of Violations
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
