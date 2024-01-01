import Forbidden from "../../Assets/403.webp";

export default function Forbidden403() {
  return (
    <>
      <div className="container d-flex justify-content-center align-items-center p-5 pagError">
        <div className="row text-center">
          <img
            src={Forbidden}
            className="img-fluid mx-auto"
            style={{ maxWidth: "350px" }}
          />
          <div className="display-1 fw-bold text-danger">403 Error</div>
          <div className="display-6 fw-bold my-3 text-muted">Forbidden</div>
          <p className="lead px-5 mx-auto" style={{ maxWidth: "650px" }}>
            You don't have permission to access this page. It appears that
            you're trying to access content that is restricted.
          </p>
        </div>
      </div>
    </>
  );
}
