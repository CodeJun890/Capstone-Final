import { useRef, useState, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faUserPen } from "@fortawesome/free-solid-svg-icons";
import { faBan } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import { StudentContext } from "../../../Context/StudentContext";
import CvsuLogo from "../../Assets/cvsu-icon.webp";
import profileBg from "../../Assets/profile-bg.jpg";
import Form from "react-bootstrap/Form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import profileImg from "../../Assets/upload.jpg";
import Card from "react-bootstrap/Card";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

import regionsWithProvinces from "../Admin/RegionsAndProvinces";

import axios from "axios";

export default function StudentProfile({ isToggled }) {
  const { userData, setUserData, programList, baseUrl } =
    useContext(StudentContext);

  //enable or disable edit

  const [isEditAccount, setIsEditAccount] = useState(true);
  const [isEditPersonal, setIsEditPersonal] = useState(true);
  const [isEditContact, setIsEditContact] = useState(true);
  const [isEmailTaken, setIsEmailTaken] = useState(false);

  const updatedStudentData = {
    profileImage: userData.profileImage,
    studentNumber: userData.studentNumber,
    emailAddress: userData.emailAddress,
    firstName: userData.firstName,
    middleName: userData.middleName,
    lastName: userData.lastName,
    gender: userData.gender,
    suffix: userData.suffix,
    sectionYear: userData.sectionYear,
    birthDate: userData.birthDate,
    course: userData.course,
    phoneNumber: userData.phoneNumber,
    region: userData.region,
    province: userData.province,
    city: userData.city,
    barangay: userData.barangay,
    streetAddress: userData.streetAddress,
  };

  // Initialize provinces and cities based on userData
  const initialProvinces = userData.region
    ? regionsWithProvinces.find((reg) => reg.region === userData.region)
        ?.provinces || []
    : [];
  const initialCities = userData.province
    ? initialProvinces.find(
        (province) => province.provinceName === userData.province
      )?.cities || []
    : [];

  const [provinces, setProvinces] = useState(initialProvinces);
  const [cities, setCities] = useState(initialCities);

  const handleSubmitUpdate = async (e) => {
    e.preventDefault();

    if (
      isEditAccount === false ||
      isEditPersonal === false ||
      isEditContact === false
    ) {
      setIsEditAccount(true);
      setIsEditPersonal(true);
      setIsEditContact(true);
    }

    const userId = userData._id;
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
        setUserData((prevUserData) => ({
          ...prevUserData,
          emailAddress: currentEmail,
        }));
      } else {
        // Proceed with updating the user data
        const res = await axios.patch(
          `${baseUrl}student-update/${userId}`,
          updatedStudentData
        );

        const Toast = Swal.mixin({
          toast: true,
          position: "top-right",
          iconColor: "white",
          color: "white",
          customClass: {
            popup: "colored-toast",
          },
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true,
          background: "green",
        });

        Toast.fire({
          icon: "success",
          title: "User updated successfully",
        });
      }
    } catch (err) {
      console.log("Error in updating user data: ", err);
    }
  };

  const handleDisabledAccount = () => {
    setIsEditAccount(!isEditAccount);
  };
  const handleDisabledPersonal = () => {
    setIsEditPersonal(!isEditPersonal);
  };
  const handleDisabledContact = () => {
    setIsEditContact(!isEditContact);
  };

  // Check if password is strong

  // Check multiple select input

  const changeRegion = (e) => {
    setUserData((prevUserData) => ({
      ...prevUserData,
      region: e.target.value,
    }));

    setProvinces(
      regionsWithProvinces.find((reg) => reg.region === e.target.value)
        .provinces
    );
  };
  const changeProvince = (e) => {
    setUserData((prevUserData) => ({
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
        // Resize the image to desired dimensions
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const maxWidth = 300; // Set your desired width
        const maxHeight = 300; // Set your desired height

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
        setUserData((prevUserData) => ({
          ...prevUserData,
          profileImage: resizedImage,
        }));
      };
    };

    reader.readAsDataURL(file);
  };
  return (
    <>
      <div
        className="profile-wrapper scrollable-container-profile"
        id="#custom-target"
      >
        <div className="row">
          <div className="banner-item">
            <div
              className="image-overlay-profile"
              style={{ backgroundImage: `url(${profileBg})` }}
            >
              <div className="breadcrumb-container">
                <div className="profile-image">
                  <img src={CvsuLogo} alt="profile-image" />
                </div>
                <div className="profile-details d-flex flex-column align-items-center mt-3">
                  <h6 className="text-light">
                    {userData.firstName +
                      " " +
                      (userData.middleName
                        ? userData.middleName.charAt(0) + ". "
                        : "") +
                      userData.lastName}
                  </h6>
                  <div className="p text-light">{userData.studentNumber}</div>
                </div>
              </div>
            </div>
          </div>
          <div className="container-fluid mx-md-5" id="tabs-profile">
            <Tabs
              defaultActiveKey="account"
              transition={false}
              id="noanim-tab-example"
              className={`mb-3 tabs-profile ${isToggled ? "dark" : ""}`}
            >
              <Tab eventKey="account" title="Account">
                <div className="tab-account-header text-center bg-success py-2">
                  <div className="h4 text-light">Account Information</div>
                </div>
                <div className="tab-account-header d-flex justify-content-center align-items-center py-2 mb-md-5 my-3">
                  {isEditAccount && (
                    <div className="edit mb-3 text-center">
                      <div
                        className="btn btn-warning"
                        onClick={handleDisabledAccount}
                      >
                        <FontAwesomeIcon icon={faUserPen} className="me-2" />
                        Edit Information
                      </div>
                    </div>
                  )}
                  {!isEditAccount && (
                    <div className="edit mb-3 text-center ">
                      <div
                        className="btn btn-secondary"
                        onClick={handleDisabledAccount}
                      >
                        <FontAwesomeIcon icon={faBan} className="me-2" />
                        Cancel Editing
                      </div>
                    </div>
                  )}
                </div>
                {isEmailTaken && (
                  <div className="emailTaken d-flex justify-content-center mb-3">
                    <p className="alert alert-danger w-75 text-center mx-md-5 mx-2">
                      This email is already taken. Please use your CVSU email.
                    </p>
                  </div>
                )}
                <div
                  className={`row tab-profile-wrapper pb-4  ${
                    isToggled ? "dark" : ""
                  } justify-content-center align-items-center`}
                >
                  <div className="col-md-4 d-flex justify-content-center align-items-center px-5">
                    <div className="input-wrap">
                      <Card style={{ width: "14rem" }} className="rounded">
                        <Card.Body>
                          <div className="profile-image-wrap">
                            <img
                              src={
                                userData.profileImage
                                  ? userData.profileImage
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
                    </div>
                  </div>
                  <div className="col-md-4 d-flex flex-column justify-content-center px-5">
                    <div className="input_wrap mt-3">
                      <label htmlFor="studentNumber" className="fw-bold">
                        Student Number
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-lg bg-light fs-6"
                        name="studentNumber"
                        value={userData.studentNumber}
                        onChange={(e) =>
                          setUserData((prevUserData) => ({
                            ...prevUserData,
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
                        value={userData.emailAddress}
                        name="emailAddress"
                        disabled={isEditAccount}
                        onChange={(e) => {
                          setIsEmailTaken(false);
                          setUserData((prevUserData) => ({
                            ...prevUserData,
                            emailAddress: e.target.value,
                          }));
                        }}
                        id="emailAddress"
                        required
                      />
                    </div>

                    <div className="input_wrap mt-3">
                      <div className="mt-4 text-end ">
                        <button
                          className="btn btn-success w-100"
                          disabled={isEditAccount}
                          onClick={handleSubmitUpdate}
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Tab>
              <Tab eventKey="personal" title="Personal">
                <div className="tab-account-header text-center bg-success py-2">
                  <div className="h4 text-light">Personal Information</div>
                </div>
                <div className="tab-account-header d-flex justify-content-center align-items-center pt-2 mt-3">
                  {isEditPersonal && (
                    <div className="edit text-center">
                      <div
                        className="btn btn-warning"
                        onClick={handleDisabledPersonal}
                      >
                        <FontAwesomeIcon icon={faUserPen} className="me-2" />
                        Edit Information
                      </div>
                    </div>
                  )}
                  {!isEditPersonal && (
                    <div className="edit text-center ">
                      <div
                        className="btn btn-secondary"
                        onClick={handleDisabledPersonal}
                      >
                        <FontAwesomeIcon icon={faBan} className="me-2" />
                        Cancel Editing
                      </div>
                    </div>
                  )}
                </div>
                <div
                  className={`row tab-profile-wrapper ${
                    isToggled ? "dark" : ""
                  } justify-content-center`}
                >
                  <div className="col-md-4 px-5 mt-4 mt-md-3">
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
                        disabled={isEditPersonal}
                        value={userData.firstName}
                        onChange={(e) =>
                          setUserData((prevUserData) => ({
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
                        disabled={isEditPersonal}
                        value={userData.middleName}
                        onChange={(e) =>
                          setUserData((prevUserData) => ({
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
                    <div className="input_wrap mt-4 mb-3">
                      <label htmlFor="lastName" className="fw-bold">
                        Last Name
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-lg bg-light fs-6"
                        placeholder="Enter your lastname"
                        id="lastName"
                        name="lastName"
                        disabled={isEditPersonal}
                        value={userData.lastName}
                        onChange={(e) =>
                          setUserData((prevUserData) => ({
                            ...prevUserData,
                            lastName: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>
                    <div className="input_wrap mt-4 mt-mb-5 mb-3">
                      <label htmlFor="suffix" className="fw-bold">
                        Suffix
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-lg bg-light fs-6"
                        placeholder="Enter Suffix here"
                        id="suffix"
                        name="suffix"
                        disabled={isEditPersonal}
                        value={userData.suffix}
                        onChange={(e) =>
                          setUserData((prevUserData) => ({
                            ...prevUserData,
                            suffix: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-4 px-5">
                    <div className="input_wrap mt-md-4">
                      <label
                        htmlFor="gender"
                        className="text-start w-100 fw-bold"
                      >
                        Sex
                      </label>
                      <Form.Select
                        id="gender"
                        aria-label="Default select example"
                        value={userData.gender}
                        name="gender"
                        disabled={isEditPersonal}
                        onChange={(e) =>
                          setUserData((prevUserData) => ({
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
                    <div
                      className="input_wrap mt-4"
                      style={{ marginTop: "30px" }}
                    >
                      <label
                        htmlFor="course"
                        className="text-start w-100 fw-bold"
                      >
                        Course
                      </label>
                      <Form.Select
                        id="course"
                        aria-label="Default select example"
                        value={userData.course}
                        name="course"
                        disabled={isEditPersonal}
                        onChange={(e) =>
                          setUserData((prevUserData) => ({
                            ...prevUserData,
                            course: e.target.value,
                          }))
                        }
                        required
                      >
                        {programList &&
                          programList.map((program, index) => (
                            <option key={index} value={program.program_code}>
                              {program.program_code}
                            </option>
                          ))}
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
                        selected={new Date(userData.birthDate)}
                        onChange={(date) =>
                          setUserData((prevUserData) => ({
                            ...prevUserData,
                            birthDate: date ? date.toISOString() : null,
                          }))
                        }
                        dateFormat="dd/MM/yyyy"
                        placeholderText="dd/MM/yyyy"
                        disabled={isEditPersonal}
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
                    <div className="input_wrap mt-5 mt-md-4 mb-3">
                      <label htmlFor="section-year" className="fw-bold">
                        Section / Year
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-lg bg-light fs-6"
                        placeholder="Enter Suffix here"
                        id="section-year"
                        name="section-year"
                        disabled={isEditPersonal}
                        value={userData.sectionYear}
                        onChange={(e) =>
                          setUserData((prevUserData) => ({
                            ...prevUserData,
                            sectionYear: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>
                    <div className="col-12 text-end mt-4 mt-md-0">
                      <button
                        className="btn btn-success mb-5 w-100"
                        disabled={isEditPersonal}
                        onClick={handleSubmitUpdate}
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              </Tab>
              <Tab eventKey="contact" title="Contact">
                <div className="tab-account-header text-center bg-success py-2 mb-4">
                  <div className="h4 text-light">Contact Information</div>
                </div>
                {isEditContact && (
                  <div className="edit text-center">
                    <div
                      className="btn btn-warning"
                      onClick={handleDisabledContact}
                    >
                      <FontAwesomeIcon icon={faUserPen} className="me-2" />
                      Edit Information
                    </div>
                  </div>
                )}
                {!isEditContact && (
                  <div className="edit text-center ">
                    <div
                      className="btn btn-secondary"
                      onClick={handleDisabledContact}
                    >
                      <FontAwesomeIcon icon={faBan} className="me-2" />
                      Cancel Editing
                    </div>
                  </div>
                )}
                <div
                  className={`row tab-profile-wrapper ${
                    isToggled ? "dark" : ""
                  } justify-content-center`}
                >
                  <div className="col-md-4 px-5">
                    <div className="input_wrap mt-5 mt-md-4">
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
                        disabled={isEditContact}
                        value={userData.phoneNumber}
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
                        value={userData.region}
                        disabled={isEditContact}
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
                        value={userData.province}
                        disabled={isEditContact}
                        onChange={changeProvince}
                        required
                      >
                        <option value="" hidden>
                          {userData.province}
                        </option>
                        {provinces.map((province, index) => (
                          <option key={index} value={province.provinceName}>
                            {province.provinceName}
                          </option>
                        ))}
                      </Form.Select>
                    </div>
                  </div>
                  <div className="col-md-4 px-5 mt-md-0 mt-3">
                    <div className="input_wrap mt-md-4 mt-3 pb-3">
                      <label
                        htmlFor="city"
                        className="text-start w-100 fw-bold"
                      >
                        City / Municipality
                      </label>
                      <Form.Select
                        type="text"
                        className="form-control form-control-lg bg-light fs-6"
                        id="city"
                        name="city"
                        disabled={isEditContact}
                        value={userData.city}
                        onChange={(e) =>
                          setUserData((prevUserData) => ({
                            ...prevUserData,
                            city: e.target.value,
                          }))
                        }
                        required
                      >
                        <option value="" hidden>
                          {userData.city}
                        </option>

                        {cities.map((city, index) => (
                          <option key={index} value={city}>
                            {city}
                          </option>
                        ))}
                      </Form.Select>
                    </div>
                    <div className="input_wrap mt-4 ">
                      <label
                        htmlFor="streetAddress"
                        className="text-start w-100 fw-bold"
                      >
                        Street Address
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-lg bg-light fs-6"
                        placeholder="Ex. Block 7 Lot 40 Phase 2 Sampaguita Street"
                        id="streetAddress"
                        name="streetAddress"
                        disabled={isEditContact}
                        value={userData.streetAddress}
                        onChange={(e) =>
                          setUserData((prevUserData) => ({
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
                        className="form-control form-control-lg bg-light fs-6"
                        id="barangay"
                        name="barangay"
                        disabled={isEditContact}
                        value={userData.barangay}
                        onChange={(e) =>
                          setUserData((prevUserData) => ({
                            ...prevUserData,
                            barangay: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>
                    <div
                      className="col-12 text-end mt-4"
                      disabled={isEditContact}
                    >
                      <button
                        className="btn btn-success w-100"
                        disabled={isEditContact}
                        onClick={handleSubmitUpdate}
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              </Tab>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
}
