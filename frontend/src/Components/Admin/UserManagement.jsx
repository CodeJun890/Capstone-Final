import React, { useState, useContext, useEffect, useRef } from "react";
import DataTable from "react-data-table-component";
import Modal from "react-bootstrap/Modal";
import InputGroup from "react-bootstrap/InputGroup";
import axios from "axios";
import MoonLoader from "react-spinners/MoonLoader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faUserPen,
  faTrashAlt,
  faUserGear,
  faEye,
  faEyeSlash,
  faBan,
} from "@fortawesome/free-solid-svg-icons";
import Button from "react-bootstrap/esm/Button";
import Form from "react-bootstrap/Form";
import Swal from "sweetalert2";
import format from "date-fns/format";
import zxcvbc from "zxcvbn";
import { AdminContext } from "../../../Context/AdminContext";
import { StrengthIndicator } from "../Homepage/StrengthIndicator";
export default function UserManagement({ isToggled }) {
  const { baseUrl, setCurrentAdmin, userData } = useContext(AdminContext);
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [pending, setPending] = React.useState(true);
  const rowsPerPageOptions = [5, 10, 20, 30];
  const [filterValue, setFilterValue] = useState("");
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [modalShow, setModalShow] = React.useState(false);
  const [modalEditShow, setModalEditShow] = React.useState(false);
  const [record, setRecord] = useState([]);

  useEffect(() => {
    axios
      .get(baseUrl + "get-all-admin-users-active")
      .then((res) => {
        if (res.status === 200) {
          const filteredAdmins = res.data.admin.filter(
            (admin) => admin._id !== userData._id
          );
          setRecord(filteredAdmins);
          setFilteredRecords(filteredAdmins);
          setPending(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const columns = [
    {
      name: "Full Name",
      selector: (row) =>
        row.firstName +
          " " +
          row.middleName.charAt(0) +
          ". " +
          row.lastName +
          " " +
          row.suffix ?? "",
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.emailAddress,
      sortable: true,
    },
    {
      name: "Created",
      selector: (row) => format(new Date(row.createdAt), "MMMM d, yyyy"),
      wrap: true,
      sortable: true,
    },
    {
      name: "Activated",
      wrap: true,
      selector: (row) =>
        format(new Date(row.updatedAt), "MMMM d, yyyy") ?? "N/A",
      sortable: true,
    },
    {
      name: "Role",
      cell: (row) => (
        <div className="d-flex mt-3 align-items-center justify-content-center">
          <p className="text-uppercase">{row.role}</p>
        </div>
      ),
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
        <div>
          <div className="btn-cont d-flex column-gap-1 justify-content-around align-items-center flex-nowrap">
            <div
              className="h6 btn-edit me-2 text-primary"
              style={{ cursor: "pointer" }}
              onClick={() => {
                handleEditAdminList(row._id);
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
                    Swal.fire(
                      "Deleted!",
                      "Program has been deleted.",
                      "success"
                    );
                    handleDeleteAdminList(row._id);
                  }
                });
              }}
            >
              <FontAwesomeIcon icon={faTrashAlt} />
            </div>
          </div>
        </div>
      ),
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "enabled":
        return "#198754";
      case "disabled":
        return "#dc3545";
      default:
        return "transparent";
    }
  };

  const handleDeleteAdminList = (userId) => {
    axios
      .delete(`${baseUrl}delete-admin/${userId}`)
      .then((res) => {
        setRecord((prevRecords) =>
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
  const handleEditAdminList = (userId) => {
    setCurrentAdmin(userId);
    setModalEditShow(true);
  };

  const handleFilter = (e) => {
    const value = e.target.value.toLowerCase();
    setFilterValue(value);

    const newData = record.filter((row) => {
      return (
        row.firstName.toLowerCase().includes(value) ||
        row.middleName.toLowerCase().includes(value) ||
        row.lastName.toLowerCase().includes(value) ||
        row.suffix.toLowerCase().includes(value) ||
        row.emailAddress.toLowerCase().includes(value) ||
        row.role.toLowerCase().includes(value) ||
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
            User Management
          </div>
          <div className="h6 mb-5">Create and Manage User</div>
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
              Create User
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
          title="Active Users"
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

      <CreateUser
        show={modalShow}
        onHide={() => setModalShow(false)}
        setRecord={setRecord}
        setFilteredRecords={setFilteredRecords}
      />
      <EditUser
        show={modalEditShow}
        onHide={() => setModalEditShow(false)}
        setRecord={setRecord}
        setFilteredRecords={setFilteredRecords}
      />
    </>
  );
}

function CreateUser({ setRecord, setFilteredRecords, ...props }) {
  const { baseUrl } = useContext(AdminContext);

  const [isEmailTaken, setIsEmailTaken] = useState(false);
  const [isNotMatch, setIsNotMatch] = useState(false);
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [suffix, setSuffix] = useState("");
  const [role, setRole] = useState(null);
  const [status, setStatus] = useState(null);
  const [isChecked, setIsChecked] = useState(false);
  const [isStatus, setIsStatus] = useState(false);
  const [isRole, setIsRole] = useState(false);

  // Check if password is strong
  const [isPasswordStrong, setIsPasswordStrong] = useState(true);
  const testResult = zxcvbc(password);

  const inputRef = useRef(null);

  const passLabel = () => {
    switch (testResult.score) {
      case 0:
        return "Very Weak";
      case 1:
        return "Weak";
      case 2:
        return "Fair";
      case 3:
        return "Strong";
      case 4:
        return "Very Strong";
      default:
        return "";
    }
  };

  const validateForm = () => {
    if (
      !firstName ||
      !lastName ||
      !emailAddress ||
      !password ||
      !confirmPassword ||
      !role
    ) {
      return false;
    } else if (password !== confirmPassword) {
      setIsNotMatch(true);
      return false;
    } else {
      setIsNotMatch(false);
    }

    return true;
  };

  const clearInputFields = () => {
    setFirstName("");
    setMiddleName("");
    setLastName("");
    setSuffix("");
    setEmailAddress("");
    setPassword("");
    setConfirmPassword("");
    setRole("");
    setStatus("");
    setShowPassword1(false);
    setShowPassword2(false);
    setIsEmailTaken(false);
    setIsStatus(false);
    setIsRole(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      if (
        passLabel() === "Very Weak" ||
        passLabel() === "Weak" ||
        passLabel() === "Fair"
      ) {
        setIsPasswordStrong(false);
      } else {
        axios
          .post(baseUrl + "create-admin-users", {
            emailAddress,
            password,
            firstName,
            middleName,
            lastName,
            suffix,
            role,
            status,
            isChecked,
          })
          .then((res) => {
            if (res.status === 200) {
              Swal.fire({
                position: "center",
                icon: "success",
                title: "Success!",
                text: "New User has been created!",
                showConfirmButton: false,
                timer: 2000,
                padding: "3em",
              });

              setRecord((prevRecords) => [...prevRecords, res.data.admin]);
              setFilteredRecords((prevFilteredRecords) => [
                ...prevFilteredRecords,
                res.data.admin,
              ]);

              clearInputFields();
              props.onHide();
            } else if (res.status === 201) {
              setIsEmailTaken(true);
            } else if (res.status === 202) {
              setIsStatus(true);
            } else if (res.status === 203) {
              setIsRole(true);
            }
          });
      }
    } else {
      inputRef.current.reportValidity();
    }
  };

  return (
    <Modal
      {...props}
      onHide={() => {
        clearInputFields();
        props.onHide();
      }}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      top="true"
      backdrop="static"
    >
      <Modal.Header
        className="text-uppercase bg-success fw-bolder text-light"
        closeButton
      >
        <Modal.Title id="contained-modal-title-vcenter">
          <FontAwesomeIcon icon={faUserGear} className="me-2" />
          Create New User
        </Modal.Title>
      </Modal.Header>
      <Form ref={inputRef} autoComplete="off">
        <Modal.Body>
          {isNotMatch && (
            <p className="alert alert-danger mx-md-5 mx-2 text-center">
              Passwords don't match. Double-check and confirm your password
              entry.
            </p>
          )}
          {!isPasswordStrong && (
            <p className="alert alert-danger text-center mx-md-5 mx-2">
              Please choose a stronger password for better account security.
            </p>
          )}

          {isEmailTaken && (
            <p className="alert alert-warning text-center mx-md-5 mx-2">
              Warning: Email is Already Exists
            </p>
          )}
          {isRole && (
            <p className="alert alert-warning text-center mx-md-5 mx-2">
              Please provide role for this account
            </p>
          )}
          {isStatus && (
            <p className="alert alert-warning text-center mx-md-5 mx-2">
              Please provide status for this account
            </p>
          )}
          <div className="container-fluid">
            <div className="row d-flex justify-content-center align-items-ceter">
              <div className="col-md-6">
                <Form.Group className="mb-1" controlId="formBasicEmail">
                  <Form.Label className="fw-bold">Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={emailAddress}
                    onChange={(e) => {
                      setEmailAddress(e.target.value);
                      setIsEmailTaken(false);
                    }}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-2" controlId="formPassword">
                  <Form.Label className="fw-bold">Password</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type={showPassword1 ? "text" : "password"}
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setIsPasswordStrong(true);
                        setIsNotMatch(false);
                        setIsPasswordStrong(true);
                      }}
                      required
                    />
                    <Button
                      onClick={() => setShowPassword1(!showPassword1)}
                      variant="secondary"
                    >
                      {showPassword1 ? (
                        <FontAwesomeIcon
                          icon={faEyeSlash}
                          className="fa-solid fa-eye-slash showPassIcon"
                        />
                      ) : (
                        <FontAwesomeIcon
                          icon={faEye}
                          className="fa-solid fa-eye showPassIcon"
                        />
                      )}
                    </Button>
                  </InputGroup>
                </Form.Group>
                {password && <StrengthIndicator password={password} />}
                <Form.Group className="mb-1" controlId="formConfirmPassword">
                  <Form.Label className="fw-bold">Confirm Password</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type={showPassword2 ? "text" : "password"}
                      placeholder="Re-enter your password"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        setIsNotMatch(false);
                        setIsPasswordStrong(true);
                      }}
                      required
                    />
                    <Button
                      onClick={() => {
                        setShowPassword2(!showPassword2);
                      }}
                      variant="secondary"
                    >
                      {showPassword2 ? (
                        <FontAwesomeIcon
                          icon={faEyeSlash}
                          className="fa-solid fa-eye-slash showPassIcon"
                        />
                      ) : (
                        <FontAwesomeIcon
                          icon={faEye}
                          className="fa-solid fa-eye showPassIcon"
                        />
                      )}
                    </Button>
                  </InputGroup>
                </Form.Group>
                <Form.Group className="mb-1" controlId="formRole">
                  <Form.Label className="fw-bold">Role</Form.Label>
                  <Form.Select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    aria-label="Default select example"
                    required
                  >
                    <option value="" hidden>
                      Choose Role
                    </option>
                    <option value="admin">ADMIN</option>
                    <option value="sub-admin">SUB-ADMIN</option>
                  </Form.Select>
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-1" controlId="formBasicFirstName">
                  <Form.Label className="fw-bold">First Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter firstname"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </Form.Group>
                <Form.Group className="mb-1" controlId="formMiddleName">
                  <Form.Label className="fw-bold">Middle Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter middlename"
                    value={middleName}
                    onChange={(e) => setMiddleName(e.target.value)}
                  />
                </Form.Group>
                <Form.Group className="mb-1" controlId="formLastName">
                  <Form.Label className="fw-bold">Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter lastname"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </Form.Group>
                <Form.Group className="mb-1" controlId="formSuffix">
                  <Form.Label className="fw-bold">Suffix</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter suffix"
                    value={suffix}
                    onChange={(e) => setSuffix(e.target.value)}
                  />
                </Form.Group>
              </div>
              <Form.Group className="mb-1" controlId="formStatus">
                <Form.Label className="fw-bold">Status</Form.Label>
                <Form.Select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  aria-label="Default select example"
                  required
                >
                  <option value="" hidden>
                    Choose account status
                  </option>
                  <option value="enabled">ENABLE</option>
                  <option value="disabled">DISABLE</option>
                </Form.Select>
              </Form.Group>
            </div>
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
            <Button variant="success" className="me-1" onClick={handleSubmit}>
              Submit
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                clearInputFields();
                props.onHide();
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
function EditUser({ setRecord, setFilteredRecords, ...props }) {
  const { baseUrl, currentAdmin } = useContext(AdminContext);

  const [isEmailTaken, setIsEmailTaken] = useState(false);
  const [isStatus, setIsStatus] = useState(false);
  const [isRole, setIsRole] = useState(false);
  const [adminUsers, setAdminUsers] = useState(false);
  const [isEditAccount, setIsEditAccount] = useState(true);

  useEffect(() => {
    if (currentAdmin) {
      axios
        .get(baseUrl + `get-admin-user/${currentAdmin}`)
        .then((res) => {
          setAdminUsers(res.data.admin);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [currentAdmin]);

  const handleDisabledAccount = () => {
    setIsEditAccount(!isEditAccount);
  };

  const updatedUserData = {
    emailAddress: adminUsers.emailAddress,
    firstName: adminUsers.firstName,
    middleName: adminUsers.middleName,
    lastName: adminUsers.lastName,
    suffix: adminUsers.suffix,
    status: adminUsers.status,
    role: adminUsers.role,
  };

  const handleSubmitUpdate = async (e) => {
    e.preventDefault();

    setIsEditAccount(true);

    const userId = adminUsers._id;
    const updatedEmail = updatedUserData.emailAddress;
    try {
      // Fetch all existing email addresses from the server
      const response = await axios.get(baseUrl + "admin-user-emails");
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
        setAdminUsers((prevUserData) => ({
          ...prevUserData,
          emailAddress: currentEmail,
        }));
      } else {
        // Proceed with updating the user data
        const res = await axios.patch(
          `${baseUrl}admin-update/${userId}`,
          updatedUserData
        );

        // Update the records in both setRecords and setFilteredRecords
        setRecord((prevRecords) =>
          prevRecords.map((record) =>
            record._id === userId ? { ...record, ...updatedUserData } : record
          )
        );

        setFilteredRecords((prevFilteredRecords) =>
          prevFilteredRecords.map((record) =>
            record._id === userId ? { ...record, ...updatedUserData } : record
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
      onHide={() => {
        props.onHide();
        setIsEditAccount(true);
      }}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      top="true"
      backdrop="static"
    >
      <Modal.Header
        className="text-uppercase bg-success fw-bolder text-light"
        closeButton
      >
        <Modal.Title id="contained-modal-title-vcenter">
          <FontAwesomeIcon icon={faUserGear} className="me-2" />
          Edit User
        </Modal.Title>
      </Modal.Header>
      <Form autoComplete="off">
        <Modal.Body>
          {isEmailTaken && (
            <p className="alert alert-warning text-center mx-md-5 mx-2">
              Warning: Email is Already Exists
            </p>
          )}
          {isRole && (
            <p className="alert alert-warning text-center mx-md-5 mx-2">
              Please provide role for this account
            </p>
          )}
          {isStatus && (
            <p className="alert alert-warning text-center mx-md-5 mx-2">
              Please provide status for this account
            </p>
          )}
          <div className="container-fluid">
            <div className="row d-flex justify-content-center align-items-ceter">
              <div className="col-md-6">
                <Form.Group className="mb-1" controlId="formBasicEmail">
                  <Form.Label className="fw-bold">Email address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    required
                    value={adminUsers.emailAddress ?? ""}
                    onChange={(e) =>
                      setAdminUsers((prevRecords) => ({
                        ...prevRecords,
                        emailAddress: e.target.value,
                      }))
                    }
                    disabled={isEditAccount}
                  />
                </Form.Group>
                <Form.Group className="mb-1" controlId="formRole">
                  <Form.Label className="fw-bold">Role</Form.Label>
                  <Form.Select
                    value={adminUsers.role ?? ""}
                    onChange={(e) =>
                      setAdminUsers((prevRecords) => ({
                        ...prevRecords,
                        role: e.target.value,
                      }))
                    }
                    aria-label="Default select example"
                    required
                    disabled={isEditAccount}
                  >
                    <option value="" hidden>
                      Choose Role
                    </option>
                    <option value="admin">ADMIN</option>
                    <option value="sub-admin">SUB-ADMIN</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-1" controlId="formStatus">
                  <Form.Label className="fw-bold">Status</Form.Label>
                  <Form.Select
                    value={adminUsers.status ?? ""}
                    onChange={(e) =>
                      setAdminUsers((prevRecords) => ({
                        ...prevRecords,
                        status: e.target.value,
                      }))
                    }
                    aria-label="Default select example"
                    required
                    disabled={isEditAccount}
                  >
                    <option value="" hidden>
                      Choose account status
                    </option>
                    <option value="enabled">ENABLE</option>
                    <option value="disabled">DISABLE</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-1" controlId="formBasicFirstName">
                  <Form.Label className="fw-bold">First Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter firstname"
                    required
                    value={adminUsers.firstName ?? ""}
                    onChange={(e) =>
                      setAdminUsers((prevRecords) => ({
                        ...prevRecords,
                        firstName: e.target.value,
                      }))
                    }
                    disabled={isEditAccount}
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-1" controlId="formMiddleName">
                  <Form.Label className="fw-bold">Middle Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter middlename"
                    value={adminUsers.middleName ?? ""}
                    onChange={(e) =>
                      setAdminUsers((prevRecords) => ({
                        ...prevRecords,
                        middleName: e.target.value,
                      }))
                    }
                    disabled={isEditAccount}
                  />
                </Form.Group>
                <Form.Group className="mb-1" controlId="formLastName">
                  <Form.Label className="fw-bold">Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter lastname"
                    required
                    value={adminUsers.lastName ?? ""}
                    onChange={(e) =>
                      setAdminUsers((prevRecords) => ({
                        ...prevRecords,
                        lastName: e.target.value,
                      }))
                    }
                    disabled={isEditAccount}
                  />
                </Form.Group>
                <Form.Group className="mb-1" controlId="formSuffix">
                  <Form.Label className="fw-bold">Suffix</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter suffix"
                    value={adminUsers.suffix ?? ""}
                    onChange={(e) =>
                      setAdminUsers((prevRecords) => ({
                        ...prevRecords,
                        suffix: e.target.value,
                      }))
                    }
                    disabled={isEditAccount}
                  />
                </Form.Group>
              </div>
            </div>
          </div>
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
              <div
                className="btn btn-secondary"
                onClick={handleDisabledAccount}
              >
                <FontAwesomeIcon icon={faBan} className="me-2" />
                Cancel
              </div>
            </div>
          )}
          <div>
            <Button
              variant="success"
              className="me-1"
              onClick={handleSubmitUpdate}
            >
              Save
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                props.onHide();
                setIsEditAccount(true);
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
