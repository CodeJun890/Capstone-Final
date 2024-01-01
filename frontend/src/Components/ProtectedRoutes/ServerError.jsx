import React from "react";
import ServerErrorImg from "../../Assets/500.jpg";
export default function ServerError() {
  return (
    <>
      <div className="container d-flex justify-content-center align-items-center h-100 py-5">
        <div className="row justify-content-center ">
          <img
            src={ServerErrorImg}
            alt="Internal Server Error 500"
            className="img-fluid"
            style={{ maxWidth: "350px" }}
          />
          <div className="h4 text-center">Oops! Something went wrong.</div>
          <div className="lead text-center">
            Our server is currently unavailable. Please try again later.
          </div>
        </div>
      </div>
    </>
  );
}
