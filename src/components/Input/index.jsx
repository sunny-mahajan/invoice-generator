import React from "react";
import "./style.css";

const CustomInput = ({
  type,
  name,
  placeholder,
  value,
  onChange,
  onKeyDown,
  title,
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
}) => {
  const fieldError = name
    ?.split(".")
    .reduce((acc, part) => acc?.[part], errors);
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
          {required && <span className="text-red-700">*</span>}
        </div>
      )}
      {!isText ? (
        <input
          type={type}
          name={name}
          style={inputStyle}
          placeholder={placeholder}
          className={`input-field ${inputClass ? inputClass : ""}`}
          onChange={onChange}
          onKeyDown={onKeyDown}
          // use the register prop from React Hook Form for validation
          {...register(name, validationRules)}
        />
      ) : (
        <div className="input-field-text">{value}</div>
      )}

      {/* Display validation error if exists */}
      {fieldError && (
        <p className="input-error text-red-600">{fieldError.message}</p>
      )}
    </div>
  );
};

export default CustomInput;
