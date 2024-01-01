import Forbidden from "../../Assets/404.webp";

export default function PageNotFound404() {
  return (
    <>
      <div className="container d-flex justify-content-center align-items-center p-5 pagError">
        <div className="row text-center">
          <img
            src={Forbidden}
            className="img-fluid mx-auto"
            style={{ maxWidth: "350px" }}
          />
          <div className="display-1 fw-bold text-danger">404 Error</div>
          <div className="display-6 fw-bold my-3 text-muted">Oops!</div>
          <p className="lead px-5 mx-auto" style={{ maxWidth: "650px" }}>
            Sorry, the page you're looking for couldn't be found on our website.
            It seems like the content you requested doesn't exist or has been
            moved.
          </p>
        </div>
      </div>
    </>
  );
}
