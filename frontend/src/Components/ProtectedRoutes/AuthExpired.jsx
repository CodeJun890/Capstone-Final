import Error from "../../Assets/error.png";
import { useNavigate } from "react-router-dom";

export default function AuthExpired() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/login");
  };
  return (
    <>
      <div className="error-container m-auto p-5">
        <div className="container d-flex justify-content-center align-items-center flex-column h-100">
          <img src={Error} alt="Error Icon" style={{ maxWidth: "128px" }} />
          <div className="display-6 text-center">Authentication Error</div>
          <div className="lead text-center">
            Your session has expired. Please login again.
          </div>
          <div className="btn btn-success mt-3" onClick={handleClick}>
            Get Back In
          </div>
        </div>
      </div>
    </>
  );
}
