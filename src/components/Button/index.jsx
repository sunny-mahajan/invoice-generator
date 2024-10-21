import React from "react";
import "./style.css";
import Loader from "./loader";
const CustomButton = ({
  children,
  type = "white",
  buttonStyle,
  onClick,
  isLoading = false,
  disabled,
  containerClass,
}) => {
  return (
    <button
      style={buttonStyle}
      onClick={onClick}
      className={`${type}-button ${containerClass || ""}`.trim()}
      disabled={isLoading || disabled}
    >
      {isLoading ? <Loader /> : children}
    </button>
  );
};

export default CustomButton;
