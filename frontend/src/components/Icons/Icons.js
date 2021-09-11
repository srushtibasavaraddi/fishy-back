import React from "react";
import "./Icons.css";
const Icons = ({ icon, title, clickHandler }) => {
  let isRules = title === "Rules" ? "rules" : "";
  let quit = title === "Quit" ? "quit" : "";
  return (
    <button
      className={`icon-btn border-none ${isRules} ${quit}`}
      onClick={clickHandler}
    >
      <img src={icon} title={title} alt={title} />
    </button>
  );
};

export default Icons;
