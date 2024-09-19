import React from "react";
import "./style.css";
const CustomButton = ({ children, type = "white", buttonStyle, onClick, disabled }) => {
  return (
    <button
      style={buttonStyle}
      onClick={onClick}
      disabled={disabled}
      className={
        type === "white"
          ? "white-button"
          : type === "gray"
          ? "gray-button"
          : type === "purple"
          ? "purple-button"
          : type === "red"
          ? "red-button"
          : ""
      }
    >
      {children}
    </button>
  );
};

export default CustomButton;
