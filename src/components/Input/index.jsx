import React, { useState } from "react";
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
  onBlur = () => {},
  touched = true,
  itemErrorsData = {},
}) => {
  // const [touched, setTouched] = useState(false);

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
          {required && <span className="text-red-600">*</span>}
        </div>
      )}
      <div className="w-full">
        {!isText ? (
          <input
            type={type}
            name={name}
            style={inputStyle}
            placeholder={placeholder}
            className={`${inputClass ? inputClass : ""} ${
              inputClass !== "input-invoice-cls" ? "input-field" : ""
            }
             ${required && fieldError ? "input-error-cls" : ""}
              ${
                required && itemErrorsData.name && name === "name"
                  ? "input-error-cls"
                  : ""
              }
              ${
                required && itemErrorsData.quantity && name === "quantity"
                  ? "input-error-cls"
                  : ""
              }
              ${
                required && itemErrorsData.price && name === "price"
                  ? "input-error-cls"
                  : ""
              }
            `}
            onChange={onChange}
            onKeyDown={onKeyDown}
            onWheel={(e) => e.target.blur()}
            // use the register prop from React Hook Form for validation
            {...register(name, { ...validationRules, onBlur: onBlur })}
          />
        ) : (
          <div className="input-field-text">{value}</div>
        )}
        {/* Display validation error if exists */}
        {Object.keys(itemErrorsData).length === 0 && (
          <div className="h-4">
            {fieldError && touched && (
              <p className="input-error text-red-600">{fieldError.message}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomInput;
