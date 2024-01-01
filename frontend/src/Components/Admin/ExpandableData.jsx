export default function ExpandableData({ data }) {
  return (
    <>
      <div className="container-fluid d-flex flex-column mx-3 py-3 ">
        <div className="violation_wrap">
          <div className="fw-bold">
            Violation Type:
            <span className="fw-light ms-3">{data.violation_type}</span>
          </div>
        </div>
        <div
          className="violation_wrap text-capitalize"
          style={{ width: "600px" }}
        >
          <div className="fw-bold">
            Violation Description:
            <span className="fw-light text-danger ms-2">
              {data.violation_description}
            </span>
          </div>
        </div>
        <div className="violation_wrap">
          <div className="fw-bold">
            Offense:
            <span className="fw-light ms-2">{data.violation_offense}</span>
          </div>
        </div>
        <div className="violation_wrap text-capitalize">
          <div className="fw-bold">
            Sanction
            <span className="fw-light ms-2">{data.violation_sanction}</span>
          </div>
        </div>
      </div>
    </>
  );
}
