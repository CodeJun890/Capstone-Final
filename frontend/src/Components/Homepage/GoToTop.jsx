import { useEffect, useState } from "react";
import "../../styles.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
export function GoToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const goToBtn = () => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };
  const listenToScroll = () => {
    let heightToHidden = 250;
    const winScroll =
      document.body.scrollTop || document.documentElement.scrollTop;

    if (winScroll > heightToHidden) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", listenToScroll);
  });

  return (
    <>
      {isVisible && (
        <div
          className="top-btn d-flex justify-content-center align-items-center"
          style={{ zIndex: "999" }}
          onClick={goToBtn}
        >
          <FontAwesomeIcon icon={faArrowUp} className="fas fa-arrow-up" />
        </div>
      )}
    </>
  );
}
