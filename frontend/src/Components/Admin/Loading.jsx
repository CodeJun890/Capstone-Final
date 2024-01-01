import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import LoginImg from "../../Assets/cvsu-icon.webp";
export function Loading() {
  return (
    <>
      <Backdrop sx={{ color: "#fff" }} open>
        <div
          className="container rounded d-flex flex-column justify-content-center align-items-center p-5 mx-3"
          style={{
            backgroundColor: "#008000",
            maxWidth: "600px",
            zIndex: "999",
          }}
        >
          <img src={LoginImg} width={"100px"} className="img-fluid mb-2" />
          <div className="h1 fw-bold text-light text-center mb-3">
            Loading resources...
          </div>
          <CircularProgress color="inherit" />
        </div>
      </Backdrop>
    </>
  );
}
