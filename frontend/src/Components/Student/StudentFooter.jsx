export default function StudentFooter({ isToggled }) {
  return (
    <>
      <div
        className={`text-bottom w-100 d-flex justify-content-end align-items-center bottom-footer p-3 ${
          isToggled ? "bg-dark" : "bg-light"
        }`}
        style={{ zIndex: "998" }}
      >
        <p className="credit-text my-auto me-4" style={{ fontSize: "12px" }}>
          Copyright &copy; 2023{" "}
          <span style={{ color: "#008000" }}>
            Cavite State University - Trece Martires City Campus
          </span>{" "}
          All Rights Reserved
        </p>
      </div>
    </>
  );
}
