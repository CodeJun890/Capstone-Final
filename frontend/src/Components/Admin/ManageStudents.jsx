import React, { useState, useRef, useEffect, useContext } from "react";
import DataTable from "react-data-table-component";
import axios from "axios";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Card from "react-bootstrap/Card";
import Swal from "sweetalert2";
import DatePicker from "react-datepicker";
import MoonLoader from "react-spinners/MoonLoader";
import "react-datepicker/dist/react-datepicker.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faUserPen,
  faTrashAlt,
  faKey,
  faBan,
  faUserGraduate,
} from "@fortawesome/free-solid-svg-icons";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";

import "../../styles.css";
import { ButtonGroup } from "@mui/material";
import { AdminContext } from "../../../Context/AdminContext";
import profileImg from "../../Assets/upload.jpg";
import regionsWithProvinces from "./RegionsAndProvinces";
export default function ManageStudents({ isToggled }) {
  const {
    records,
    setRecords,
    filteredRecords,
    setFilteredRecords,
    setCurrentStudent,
    baseUrl,
  } = useContext(AdminContext);
  const [perPage, setPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPageOptions = [5, 10];
  const [filterValue, setFilterValue] = useState("");
  const [pending, setPending] = React.useState(true);
  const [modalShow, setModalShow] = React.useState(false);
  const [editModalShow, setEditModalShow] = React.useState(false);
  const [selectedRows, setSelectedRows] = useState([]);

  useEffect(() => {
    axios
      .get(baseUrl + "fetch-students")
      .then((res) => {
        setRecords(res.data.students);
        setFilteredRecords(res.data.students);
        setPending(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const columns = [
    {
      name: "Student No.",
      selector: (row) => row.studentNumber,
      sortable: true,
    },
    {
      name: "Firstname",
      selector: (row) => row.firstName,
      sortable: true,
    },
    {
      name: "Lastname",
      selector: (row) => row.lastName,
      sortable: true,
    },
    {
      name: "Course",
      selector: (row) => row.course,
      sortable: true,
    },
    {
      name: "Year | Section",
      selector: (row) => row.sectionYear,
      sortable: true,
    },
    {
      name: "Contact No.",
      selector: (row) => row.phoneNumber,
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
              handleEditClick(row._id);
            }}
          >
            <FontAwesomeIcon icon={faUserPen} />
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
                  Swal.fire("Deleted!", "User has been deleted.", "success");
                  handleDeleteUser(row._id);
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

  const handleEditClick = (studentId) => {
    setCurrentStudent(studentId);
    setEditModalShow(true);
  };

  const handleDeleteUser = (userId) => {
    axios
      .delete(`${baseUrl}delete-students/${userId}`)
      .then((res) => {
        setRecords((prevRecords) =>
          prevRecords.filter((user) => user._id !== userId)
        );
        setFilteredRecords((prevFilteredRecords) =>
          prevFilteredRecords.filter((user) => user._id !== userId)
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleDeleteSelectedRows = () => {
    if (selectedRows.length === 0) {
      return;
    }

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete selected rows!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .post(baseUrl + "delete-students", { selectedRows })
          .then((res) => {
            const updatedRecords = records.filter(
              (user) => !selectedRows.includes(user._id)
            );
            setRecords(updatedRecords);
            setFilteredRecords(updatedRecords);

            setSelectedRows([]);

            Swal.fire(
              "Deleted!",
              "Selected rows have been deleted.",
              "success"
            );
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
  };

  const handleFilter = (e) => {
    const value = e.target.value.toLowerCase();
    setFilterValue(value);

    const newData = records.filter((row) => {
      return (
        row.firstName.toLowerCase().includes(value) ||
        row.lastName.toLowerCase().includes(value) ||
        row.middleName.toLowerCase().includes(value) ||
        row.course.toLowerCase().includes(value) ||
        row.studentNumber.toLowerCase().includes(value) ||
        row.emailAddress.toLowerCase().includes(value) ||
        row.sectionYear.toLowerCase().includes(value) ||
        row.phoneNumber.toLowerCase().includes(value)
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
        className={`container-fluid mt-5 px-3 px-md-5 pb-5 mx-md-2 me-3 scrollable-container studentEntry ${
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
            Manage Students
          </div>
          <div className="h6 mb-5">View and register student here</div>
        </div>
        <div
          className="d-flex mt-5 justify-content-between align-items-center"
          id="action-btn-student-entry"
        >
          <div className="container-group" id="add-btn">
            <button
              className="btn btn-success btn-sm"
              onClick={() => setModalShow(true)}
            >
              <FontAwesomeIcon icon={faPlus} className="me-1" />
              Add Student
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
          title="Registered Student"
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
          contextActions={
            <FontAwesomeIcon
              icon={faTrashAlt}
              className="me-3 text-danger"
              style={{ cursor: "pointer" }}
              onClick={handleDeleteSelectedRows}
            />
          }
          selectableRows
          selectableRowsVisibleOnly
          onSelectedRowsChange={(rows) => {
            const selectedIds = rows.selectedRows.map((row) => row._id);
            setSelectedRows(selectedIds);
          }}
        />

        <CreateStudent show={modalShow} onHide={() => setModalShow(false)} />

        <MyEditModal
          show={editModalShow}
          onHide={() => setEditModalShow(false)}
        />
      </div>
    </>
  );
}

function MyEditModal({ isToggled, ...props }) {
  const { currentStudent, baseUrl, setRecords, setFilteredRecords, programs } =
    useContext(AdminContext);
  const [record, setRecord] = useState({});
  const [isEmailTaken, setIsEmailTaken] = useState(false);
  const [isEditAccount, setIsEditAccount] = useState(true);

  useEffect(() => {
    if (currentStudent) {
      axios
        .get(baseUrl + `students/${currentStudent}`)
        .then((res) => {
          setRecord(res.data.student);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [currentStudent]);

  const initialProvinces = record.region
    ? regionsWithProvinces.find((reg) => reg.region === record.region)
        ?.provinces || []
    : [];
  const initialCities = record.province
    ? initialProvinces.find(
        (province) => province.provinceName === record.province
      )?.cities || []
    : [];

  const [provinces, setProvinces] = useState(initialProvinces);
  const [cities, setCities] = useState(initialCities);

  const updatedStudentData = {
    profileImage: record.profileImage,
    studentNumber: record.studentNumber,
    emailAddress: record.emailAddress,
    firstName: record.firstName,
    middleName: record.middleName,
    lastName: record.lastName,
    gender: record.gender,
    suffix: record.suffix,
    sectionYear: record.sectionYear,
    birthDate: record.birthDate,
    course: record.course,
    phoneNumber: record.phoneNumber,
    region: record.region,
    province: record.province,
    city: record.city,
    barangay: record.barangay,
    streetAddress: record.streetAddress,
  };

  const handleDisabledAccount = () => {
    setIsEditAccount(!isEditAccount);
  };

  // Check multiple select input

  const changeRegion = (e) => {
    setRecord((prevUserData) => ({
      ...prevUserData,
      region: e.target.value,
    }));

    setProvinces(
      regionsWithProvinces.find((reg) => reg.region === e.target.value)
        .provinces
    );
  };

  const changeProvince = (e) => {
    setRecord((prevUserData) => ({
      ...prevUserData,
      province: e.target.value,
    }));
    setCities(
      provinces.find((province) => province.provinceName === e.target.value)
        .cities
    );
  };

  const inputRef = useRef(null);
  // UPLOAD PROFILE IMAGE

  const handleImgClick = () => {
    inputRef.current.click();
  };

  const handleImgChange = (event) => {
    const file = event.target.files[0];
    displayImage(file);
  };

  const displayImage = (file) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target.result;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const maxWidth = 300;
        const maxHeight = 300;

        // Calculate the new dimensions
        let newWidth = img.width;
        let newHeight = img.height;

        if (img.width > maxWidth) {
          newWidth = maxWidth;
          newHeight = (img.height * maxWidth) / img.width;
        }

        if (newHeight > maxHeight) {
          newHeight = maxHeight;
          newWidth = (img.width * maxHeight) / img.height;
        }

        // Set canvas dimensions to the resized image
        canvas.width = newWidth;
        canvas.height = newHeight;

        // Draw the resized image on the canvas
        ctx.drawImage(img, 0, 0, newWidth, newHeight);

        // Get the data URL of the resized image
        const resizedImage = canvas.toDataURL("image/jpeg");

        // Set the resized image in state
        setRecord((prevUserData) => ({
          ...prevUserData,
          profileImage: resizedImage,
        }));
      };
    };

    reader.readAsDataURL(file);
  };

  const handleSubmitUpdate = async (e) => {
    e.preventDefault();

    if (isEditAccount === false) {
      setIsEditAccount(true);
    }

    const userId = record._id;
    const updatedEmail = updatedStudentData.emailAddress;

    try {
      // Fetch all existing email addresses from the server
      const response = await axios.get(baseUrl + "student-emails");
      const existingEmails = response.data.emails.map((emailObj) => ({
        id: emailObj._id,
        emailAddress: emailObj.emailAddress,
      }));

      // Exclude the email with the same ID as the user's ID
      const filteredEmails = existingEmails.filter(
        (emailObj) => emailObj.id !== userId
      );

      if (
        filteredEmails.some(
          (emailObj) => emailObj.emailAddress === updatedEmail
        )
      ) {
        setIsEmailTaken(true);
        const filteredEmail = existingEmails.filter(
          (emailObj) => emailObj.id === userId
        );
        const currentEmail = filteredEmail.map(
          (emailObj) => emailObj.emailAddress
        );
        setRecord((prevUserData) => ({
          ...prevUserData,
          emailAddress: currentEmail,
        }));
      } else {
        // Proceed with updating the user data
        const res = await axios.patch(
          `${baseUrl}student-update/${userId}`,
          updatedStudentData
        );

        // Update the records in both setRecords and setFilteredRecords
        setRecords((prevRecords) =>
          prevRecords.map((record) =>
            record._id === userId
              ? { ...record, ...updatedStudentData }
              : record
          )
        );

        setFilteredRecords((prevFilteredRecords) =>
          prevFilteredRecords.map((record) =>
            record._id === userId
              ? { ...record, ...updatedStudentData }
              : record
          )
        );

        Swal.fire({
          position: "center",
          icon: "success",
          title: "Success!",
          text: "User Updated Successfully!",
          showConfirmButton: false,
          timer: 2000,
          padding: "3em",
        });
      }
    } catch (err) {
      console.log("Error in updating user data: ", err);
    }
  };

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      top="true"
      onHide={() => {
        props.onHide();
        setIsEmailTaken(false);
      }}
    >
      <Modal.Header closeButton className="bg-success text-light">
        <Modal.Title
          className="text-uppercase fw-bold"
          id="contained-modal-title-vcenter"
        >
          Edit Student Information
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Tabs
          defaultActiveKey="account"
          id="noanim-tab-example"
          className="mb-3"
          fill
        >
          <Tab eventKey="account" title="Account">
            <div className="container">
              <div className="row d-flex justify-content-center align-items-center">
                <div className="col-10 py-3 px-2">
                  <Card style={{ width: "10rem" }} className="rounded mx-auto">
                    <Card.Body>
                      <div className="profile-image-wrap">
                        <img
                          src={
                            record.profileImage
                              ? record.profileImage
                              : profileImg
                          }
                          alt="Profile Image"
                          className="img-fluid"
                        />
                      </div>
                    </Card.Body>
                    <Card.Text
                      className="text-center bg-secondary text-light"
                      style={{ cursor: "pointer" }}
                      onClick={handleImgClick}
                    >
                      <input
                        type="file"
                        ref={inputRef}
                        style={{ display: "none" }}
                        onChange={handleImgChange}
                        disabled={isEditAccount}
                      />
                      Change Profile
                    </Card.Text>
                  </Card>
                  {isEmailTaken && (
                    <div className="emailTaken d-flex justify-content-center mt-3">
                      <p className="alert alert-danger w-75 text-center mx-md-5 mx-2">
                        This email is already taken. Please use your CVSU email.
                      </p>
                    </div>
                  )}
                  <div className="input_wrap mt-3">
                    <label htmlFor="studentNumber" className="fw-bold">
                      Student Number
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-lg bg-light fs-6"
                      name="studentNumber"
                      value={record.studentNumber ?? ""}
                      onChange={(e) =>
                        setRecord((prevRecords) => ({
                          ...prevRecords,
                          studentNumber: e.target.value,
                        }))
                      }
                      id="studentNumber"
                      disabled={isEditAccount}
                      required
                    />
                  </div>
                  <div className="input_wrap mt-3">
                    <label htmlFor="emailAddress" className="fw-bold">
                      Email Address
                    </label>
                    <input
                      type="email"
                      className="form-control form-control-lg bg-light fs-6"
                      value={record.emailAddress ?? ""}
                      name="emailAddress"
                      disabled={isEditAccount}
                      onChange={(e) => {
                        setIsEmailTaken(false);
                        setRecord((prevRecords) => ({
                          ...prevRecords,
                          emailAddress: e.target.value,
                        }));
                      }}
                      id="emailAddress"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          </Tab>
          <Tab eventKey="personal" title="Personal">
            <div className="container">
              <div className="row">
                <div className="col-md-6 py-3">
                  <div className="input_wrap">
                    <label htmlFor="firstName" className="fw-bold">
                      First Name
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-lg bg-light fs-6"
                      placeholder="Enter your firstname"
                      id="firstName"
                      name="firstName"
                      disabled={isEditAccount}
                      value={record.firstName ?? ""}
                      onChange={(e) =>
                        setRecord((prevUserData) => ({
                          ...prevUserData,
                          firstName: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>

                  <div className="input_wrap mt-4">
                    <label htmlFor="middleName" className="fw-bold">
                      Middle Name
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-lg bg-light fs-6"
                      placeholder="Enter your middlename"
                      id="middleName"
                      name="middleName"
                      disabled={isEditAccount}
                      value={record.middleName ?? ""}
                      onChange={(e) =>
                        setRecord((prevUserData) => ({
                          ...prevUserData,
                          middleName: e.target.value,
                        }))
                      }
                    />
                    <p
                      className=" px-2  mt-1 rounded sub-text"
                      style={{ fontSize: "12px", position: "absolute" }}
                    >
                      Please leave it blank if not applicable.
                    </p>
                  </div>
                  <div className="input_wrap mt-4">
                    <label htmlFor="lastName" className="fw-bold">
                      Last Name
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-lg bg-light fs-6"
                      placeholder="Enter your lastname"
                      id="lastName"
                      name="lastName"
                      disabled={isEditAccount}
                      value={record.lastName ?? ""}
                      onChange={(e) =>
                        setRecord((prevUserData) => ({
                          ...prevUserData,
                          lastName: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                  <div className="input_wrap mt-4 mb-3">
                    <label htmlFor="suffix" className="fw-bold">
                      Suffix
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-lg bg-light fs-6"
                      placeholder="Enter Suffix here"
                      id="suffix"
                      name="suffix"
                      disabled={isEditAccount}
                      value={record.suffix ?? ""}
                      onChange={(e) =>
                        setRecord((prevUserData) => ({
                          ...prevUserData,
                          suffix: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
                <div className="col-md-6 py-3">
                  <div className="input_wrap">
                    <label
                      htmlFor="gender"
                      className="text-start w-100 fw-bold"
                    >
                      Sex
                    </label>
                    <Form.Select
                      id="gender"
                      aria-label="Default select example"
                      value={record.gender ?? ""}
                      name="gender"
                      disabled={isEditAccount}
                      onChange={(e) =>
                        setRecord((prevUserData) => ({
                          ...prevUserData,
                          gender: e.target.value,
                        }))
                      }
                      required
                    >
                      <option value="" hidden>
                        Select your gender
                      </option>
                      <option value="N/A" hidden defaultValue />
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </Form.Select>
                  </div>

                  <div className="input_wrap mt-4">
                    <label
                      htmlFor="birthDate"
                      className="text-start w-100 fw-bold"
                    >
                      Birth Date
                    </label>
                    <DatePicker
                      className="form-control form-control-lg bg-light fs-6"
                      id="birthDate"
                      name="birthDate"
                      selected={
                        record.birthDate ? new Date(record.birthDate) : null
                      }
                      onChange={(date) =>
                        setRecord((prevUserData) => ({
                          ...prevUserData,
                          birthDate: date ? date.toISOString() : null,
                        }))
                      }
                      dateFormat="dd/MM/yyyy"
                      placeholderText="dd/MM/yyyy"
                      disabled={isEditAccount}
                      showYearDropdown
                      scrollableMonthYearDropdown
                      required
                    />
                    <p
                      className="px-2 mt-1 rounded sub-text"
                      style={{ fontSize: "12px", position: "absolute" }}
                    >
                      Date format:{" "}
                      <span
                        className="text-danger px-1 rounded fw-bold"
                        style={{ backgroundColor: "#eee" }}
                      >
                        dd/mm/yyyy
                      </span>
                    </p>
                  </div>
                  <div
                    className="input_wrap mt-4"
                    style={{ marginTop: "30px" }}
                  >
                    <label
                      htmlFor="course"
                      className="text-start mt-1 w-100 fw-bold"
                    >
                      Course
                    </label>
                    <Form.Select
                      id="course"
                      aria-label="Default select example"
                      value={record.course ?? ""}
                      name="course"
                      disabled={isEditAccount}
                      onChange={(e) =>
                        setRecord((prevUserData) => ({
                          ...prevUserData,
                          course: e.target.value,
                        }))
                      }
                      required
                    >
                      {programs &&
                        programs.map((program, index) => (
                          <option key={index} value={program.program_code}>
                            {program.program_code}
                          </option>
                        ))}
                    </Form.Select>
                  </div>
                  <div className="input_wrap">
                    <label
                      htmlFor="sectionYear"
                      className="text-start w-100 mt-4 fw-bold"
                    >
                      Year / Section
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-lg bg-light fs-6"
                      placeholder="Enter Year / Section"
                      id="sectionYear"
                      name="sectionYear"
                      disabled={isEditAccount}
                      value={record.sectionYear ?? ""}
                      onChange={(e) =>
                        setRecord((prevUserData) => ({
                          ...prevUserData,
                          sectionYear: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          </Tab>
          <Tab eventKey="contact" title="Contact">
            <div className="container">
              <div className="row d-flex justify-content-center align-items-center">
                <div className="col-md-6 py-4">
                  <div className="input_wrap">
                    <label
                      htmlFor="contactNumber"
                      className="text-start w-100 fw-bold"
                    >
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="contactNumber"
                      name="contactNumber"
                      maxLength="11"
                      pattern="[0-9]*"
                      placeholder="Enter your phone number"
                      onInput={(e) =>
                        (e.target.value = e.target.value
                          .replace(/\D/g, "")
                          .slice(0, 11))
                      }
                      className="form-control form-control-lg bg-light fs-6"
                      disabled={isEditAccount}
                      value={record.phoneNumber ?? ""}
                      onChange={(e) =>
                        setUserData((prevUserData) => ({
                          ...prevUserData,
                          phoneNumber: e.target.value,
                        }))
                      }
                      required
                    />
                    <p
                      style={{ fontSize: "12px" }}
                      className="ms-2 mt-1 sub-text"
                    >
                      Phone number mask:{" "}
                      <span
                        className="text-danger px-1 rounded fw-bold"
                        style={{ backgroundColor: "#eee" }}
                      >
                        0916 305 4327
                      </span>
                    </p>
                  </div>

                  <div className="input_wrap">
                    <label
                      htmlFor="region"
                      className="text-start w-100 fw-bold"
                    >
                      Region
                    </label>

                    <Form.Select
                      className="form-control form-control-lg bg-light fs-6"
                      id="region"
                      name="region"
                      value={record.region ?? ""}
                      disabled={isEditAccount}
                      onChange={changeRegion}
                      required
                    >
                      <option value="" hidden>
                        [Select Region]
                      </option>
                      <option value="N/A" defaultValue hidden />
                      {regionsWithProvinces.map((reg, index) => (
                        <option key={index} value={reg.region}>
                          {reg.region}
                        </option>
                      ))}
                    </Form.Select>
                  </div>
                  <div className="input_wrap mt-4">
                    <label
                      htmlFor="province"
                      className="text-start w-100 fw-bold"
                    >
                      Province
                    </label>

                    <Form.Select
                      className="form-control form-control-lg bg-light fs-6"
                      id="province"
                      name="province"
                      value={record.province ?? ""}
                      disabled={isEditAccount}
                      onChange={changeProvince}
                      required
                    >
                      <option value="" hidden>
                        {record.province}
                      </option>
                      {initialProvinces.map((province, index) => (
                        <option key={index} value={province.provinceName}>
                          {province.provinceName}
                        </option>
                      ))}
                    </Form.Select>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="input_wrap ">
                    <label htmlFor="city" className="text-start w-100 fw-bold">
                      City / Municipality
                    </label>
                    <Form.Select
                      type="text"
                      className="form-control form-control-lg bg-light fs-6 mt-2 mb-3"
                      id="city"
                      name="city"
                      disabled={isEditAccount}
                      value={record.city ?? ""}
                      onChange={(e) =>
                        setRecord((prevUserData) => ({
                          ...prevUserData,
                          city: e.target.value,
                        }))
                      }
                      required
                    >
                      <option value="" hidden>
                        {record.city}
                      </option>

                      {initialCities.map((city, index) => (
                        <option key={index} value={city}>
                          {city}
                        </option>
                      ))}
                    </Form.Select>
                  </div>
                  <div className="input_wrap">
                    <label
                      htmlFor="streetAddress"
                      className="text-start w-100 mt-4 fw-bold"
                    >
                      Street Address
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-lg bg-light fs-6"
                      placeholder="Ex. Block 7 Lot 40 Phase 2 Sampaguita Street"
                      id="streetAddress"
                      name="streetAddress"
                      disabled={isEditAccount}
                      value={record.streetAddress ?? ""}
                      onChange={(e) =>
                        setRecord((prevUserData) => ({
                          ...prevUserData,
                          streetAddress: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                  <div className="input_wrap mt-4">
                    <label
                      htmlFor="barangay"
                      className="text-start w-100 fw-bold"
                    >
                      Barangay
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-lg mb-2 bg-light fs-6"
                      id="barangay"
                      name="barangay"
                      disabled={isEditAccount}
                      value={record.barangay ?? ""}
                      onChange={(e) =>
                        setRecord((prevUserData) => ({
                          ...prevUserData,
                          barangay: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          </Tab>
        </Tabs>
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-between align-items-center">
        {isEditAccount && (
          <div className="edit  text-center">
            <div className="btn btn-warning" onClick={handleDisabledAccount}>
              <FontAwesomeIcon icon={faUserPen} className="me-2" />
              Edit
            </div>
          </div>
        )}
        {!isEditAccount && (
          <div className="edit  text-center">
            <div className="btn btn-secondary" onClick={handleDisabledAccount}>
              <FontAwesomeIcon icon={faBan} className="me-2" />
              Cancel
            </div>
          </div>
        )}
        <div>
          <Button
            className="bg-success border-0 me-1"
            onClick={handleSubmitUpdate}
          >
            Save
          </Button>
          <Button
            className="bg-secondary border-0"
            onClick={() => {
              props.onHide();
              setIsEditAccount(true);
              setIsEmailTaken(false);
            }}
          >
            Close
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
function CreateStudent(props) {
  const { baseUrl } = useContext(AdminContext);
  const [password, setPassword] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [course, setCourse] = useState("");
  const [studentNumber, setStudentNumber] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [sectionYear, setSectionYear] = useState("");

  const [isChecked, setIsChecked] = useState(false);
  const { setRecords, setFilteredRecords } = useContext(AdminContext);
  const [isEmailTaken, setIsEmailTaken] = useState(false);
  const generatePassword = () => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
    const passwordLength = 15;
    let newPassword = "";
    for (let i = 0; i < passwordLength; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      newPassword += characters.charAt(randomIndex);
    }

    setPassword(newPassword);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      axios
        .post(baseUrl + "check-existence", {
          emailAddress,
          studentNumber,
        })
        .then((res) => {
          if (res.data.isTaken === true) {
            setIsEmailTaken(res.data.isTaken);
          } else {
            axios
              .post(baseUrl + "signup-student", {
                isChecked,
                studentNumber,
                emailAddress,
                password,
                firstName,
                middleName,
                lastName,
                course,
                phoneNumber,
                sectionYear,
              })
              .then((res) => {
                setEmailAddress("");
                setPassword("");
                setFirstName("");
                setLastName("");
                setMiddleName("");
                setCourse("");
                setStudentNumber("");
                setPhoneNumber("");
                setSectionYear("");

                setRecords((prevRecords) => [...prevRecords, res.data.student]);
                setFilteredRecords((prevFilteredRecords) => [
                  ...prevFilteredRecords,
                  res.data.student,
                ]);

                if (isChecked) {
                  Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Success!",
                    text: "New student has been added, and the password has been sent via email!",
                    showConfirmButton: false,
                    timer: 3000,
                    padding: "3em",
                  });
                } else {
                  Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Success!",
                    text: "New student has been added!",
                    showConfirmButton: false,
                    timer: 2000,
                    padding: "3em",
                  });
                }

                props.onHide();
              })
              .catch((err) => {
                console.log(err);
              });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (err) {
      console.log(err);
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
        setCourse("");
        setFirstName("");
        setMiddleName("");
        setLastName("");
        setPhoneNumber("");
        setEmailAddress("");
        setPassword("");
        setStudentNumber("");
        setSectionYear("");
        setRecords({});
        setIsEmailTaken(false);
        setIsChecked(false);
      }}
      top="true"
    >
      <Form onSubmit={handleSubmit} autoComplete="off">
        <Modal.Header closeButton className="bg-success text-light">
          <Modal.Title className="fw-bold" id="contained-modal-title-vcenter">
            <FontAwesomeIcon icon={faUserGraduate} className="icons me-2" />
            ADD STUDENT
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="container">
            <div className="lead fw-bold text-center mb-3 text-light text-center bg-success p-2  rounded text-uppercase">
              Enter the details of new student:
            </div>
            {isEmailTaken && (
              <div className="emailTaken d-flex justify-content-center mb-3">
                <p className="alert alert-danger w-75 text-center mx-md-5 mx-2">
                  Warning: Email or Student Number Already Exists
                </p>
              </div>
            )}
            <div className="row">
              <div className="col-md-6">
                <FloatingLabel
                  controlId="floatingFirstName"
                  label="First Name"
                  className="mb-3"
                >
                  <Form.Control
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    size="sm"
                    type="text"
                    placeholder="name@example.com"
                    required
                  />
                </FloatingLabel>
                <FloatingLabel
                  controlId="floatingMiddleName"
                  label="Middle Name"
                  className="mb-3"
                >
                  <Form.Control
                    value={middleName}
                    onChange={(e) => setMiddleName(e.target.value)}
                    placeholder="name@example.com"
                    size="sm"
                    type="text"
                  />
                </FloatingLabel>
                <FloatingLabel
                  controlId="floatingLastName"
                  label="Last Name"
                  className="mb-3"
                >
                  <Form.Control
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="name@example.com"
                    size="sm"
                    type="text"
                    required
                  />
                </FloatingLabel>
                <FloatingLabel
                  controlId="floatingEmail"
                  label="Email address"
                  className="mb-3"
                >
                  <Form.Control
                    value={emailAddress}
                    onChange={(e) => {
                      setIsEmailTaken(false);
                      setEmailAddress(e.target.value);
                    }}
                    size="sm"
                    type="email"
                    placeholder="name@example.com"
                    required
                  />
                </FloatingLabel>
              </div>
              <div className="col-md-6">
                <FloatingLabel
                  controlId="floatingStudentNumber"
                  label="Student Number"
                  className="mb-3"
                >
                  <Form.Control
                    value={studentNumber}
                    onChange={(e) => setStudentNumber(e.target.value)}
                    placeholder="name@example.com"
                    size="sm"
                    type="text"
                    required
                  />
                </FloatingLabel>

                <FloatingLabel
                  controlId="floatingCourse"
                  label="Course"
                  className="mb-3"
                >
                  <Form.Select
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                    aria-label="Floating label select example"
                    required
                  >
                    <option value="" hidden defaultChecked>
                      Select Course
                    </option>
                    <option value="BSIT">BSIT</option>
                    <option value="BSP">BSP</option>
                    <option value="BSBM">BSBM</option>
                    <option value="BSHM">BSHM</option>
                    <option value="BSEE">BSEE</option>
                    <option value="BSOA">BSOA</option>
                  </Form.Select>
                </FloatingLabel>
                <FloatingLabel
                  controlId="floatingSectionYear"
                  label="Year / Section"
                  className="mb-3"
                >
                  <Form.Control
                    value={sectionYear}
                    onChange={(e) => {
                      setSectionYear(e.target.value);
                    }}
                    size="sm"
                    type="text"
                    placeholder="name@example.com"
                    required
                  />
                </FloatingLabel>
                <FloatingLabel
                  controlId="floatingPhoneNumber"
                  label="Phone Number"
                  className="mb-3"
                >
                  <Form.Control
                    value={phoneNumber}
                    type="tel"
                    name="phoneNumber"
                    maxLength="11"
                    pattern="[0-9]*"
                    placeholder="Enter your phone number"
                    onInput={(e) =>
                      (e.target.value = e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 11))
                    }
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                  />
                </FloatingLabel>
              </div>
            </div>

            <InputGroup>
              <FloatingLabel controlId="floatingPassword" label="Password">
                <Form.Control
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  size="sm"
                  type="text"
                  placeholder="Password"
                  required
                />
              </FloatingLabel>
              <InputGroup.Text
                id="basic-addon2"
                className="bg-secondary text-light"
                style={{ cursor: "pointer" }}
                onClick={generatePassword}
              >
                GENERATE
                <FontAwesomeIcon className="ms-2 text-warning" icon={faKey} />
              </InputGroup.Text>
            </InputGroup>
          </div>
        </Modal.Body>

        <Modal.Footer className="d-flex justify-content-between align-items-center">
          <Form.Check
            type="switch"
            id="custom-switch"
            label="Email the password"
            checked={isChecked}
            onChange={() => setIsChecked(!isChecked)}
          />

          <div>
            <Button type="submit" className="bg-success border-0 me-1">
              Save
            </Button>
            <Button
              className="bg-secondary border-0 "
              onClick={() => {
                props.onHide();
                setCourse("");
                setFirstName("");
                setMiddleName("");
                setLastName("");
                setPhoneNumber("");
                setEmailAddress("");
                setPassword("");
                setStudentNumber("");
                setSectionYear("");
                setRecords({});
                setIsEmailTaken(false);
                setIsChecked(false);
              }}
            >
              Close
            </Button>
          </div>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
