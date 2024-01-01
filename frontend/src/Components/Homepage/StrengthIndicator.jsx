import zxcvbc from "zxcvbn";

export function StrengthIndicator({ password }) {
  const testResult = zxcvbc(password);
  const num = (testResult.score * 100) / 4;

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
  const progressColorIndicator = () => {
    switch (testResult.score) {
      case 0:
        return "#828282";
      case 1:
        return "#ea1111";
      case 2:
        return "#ffad00";
      case 3:
        return "#9bc158";
      case 4:
        return "#00b500";
      default:
        return "none";
    }
  };
  const changePassColor = () => ({
    width: `${num}%`,
    background: progressColorIndicator(),
    height: "7px",
  });

  return (
    <>
      <div className="progress mt-1" style={{ height: "7px" }}>
        <div className="progress-bar" style={changePassColor()}></div>
      </div>
      <p className="float-end" style={{ color: progressColorIndicator() }}>
        {passLabel()}
      </p>
    </>
  );
}
