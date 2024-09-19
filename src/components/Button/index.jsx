import React from "react";
import "./style.css";
import Loader from "./loader";
const CustomButton = ({ children, type = "white", buttonStyle, onClick, isLoading=false, disabled }) => {
  return (
    <button
      style={buttonStyle}
      onClick={onClick}
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
      disabled={isLoading || disabled}
    >
      {isLoading ? <Loader /> : children} 
    </button>
  );
};

export default CustomButton;
