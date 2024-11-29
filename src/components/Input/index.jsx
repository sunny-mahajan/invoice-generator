import React, { useState } from "react";
import "./style.css";
import { HidePasswordIcon, ShowPasswordIcon } from "../../utils/icons";

const CustomInput = ({
  type,
  inputMode,
  name,
  placeholder,
  value,
  onChange,
  onKeyDown,
  title,
  maxLength,
  inputClass,
  inputStyle,
  containerStyle,
  titleStyle,
  lableClass,
  containerClass,
  isText = false,
  required = false,
  errors,
  register = () => {}, // add register from React Hook Form
  validationRules = {}, // rules for validation
  onBlur = () => {},
  touched = true,
  itemErrorsData = {},
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const fieldError = name
    ?.split(".")
    .reduce((acc, part) => acc?.[part], errors);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const inputType = type === "password" && showPassword ? "text" : type;
  return (
    <div
      className={`input-container ${containerClass ? containerClass : ""}`}
      style={containerStyle}
    >
      {title && (
        <div className="invoice-title-container">
          <label
            className={`input-title ${lableClass ? lableClass : ""}`}
            style={titleStyle}
          >
            {title}
          </label>
          {required && <span className="text-red-600"> *</span>}
        </div>
      )}
      <div className="input-cont-cls w-full">
        {!isText ? (
          <>
            <input
              type={inputType}
              inputMode={inputMode}
              name={name}
              style={inputStyle}
              placeholder={placeholder}
              maxLength={maxLength}
              className={`${inputClass ? inputClass : ""} ${
                inputClass !== "input-invoice-cls" ? "input-field" : ""
              }
             ${required && fieldError ? "input-error-cls" : ""}
            `}
              onChange={onChange}
              onKeyDown={onKeyDown}
              onWheel={(e) => e.target.blur()}
              // use the register prop from React Hook Form for validation
              {...register(name, { ...validationRules, onBlur: onBlur })}
            />
            {type === "password" && (
              <span
                className="show-hide-icon"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <ShowPasswordIcon /> : <HidePasswordIcon />}
              </span>
            )}
          </>
        ) : (
          <div className="input-field-text">{value}</div>
        )}
        {/* Display validation error if exists */}
        {Object.keys(itemErrorsData).length === 0 && 
          fieldError && touched && (
          <div className="h-8 input-error-container">
              <p className="input-error text-red-600">{fieldError.message}</p>
              </div>
            )}
      </div>
    </div>
  );
};

export default CustomInput;
