import React, { useState } from "react";
import "react-phone-number-input/style.css";

const PhoneInputField = ({
  type,
  onChange,
  placeholder = "Enter phone number",
  register = () => {},
  errors,
  name,
  validationRules = {},
}) => {
  const [touched, setTouched] = useState(false); // Track if input is touched

  const fieldError = name
    ?.split(".")
    .reduce((acc, part) => acc?.[part], errors);

  // Trigger validation on blur
  const handleBlur = () => {
    setTouched(true); // Set touched state to true on blur
  };

  return (
    <div className="input-container">
      <div className="input-title-container">
        <label className="input-title">Phone number:</label>
      </div>
      <div className="flex items-center">
        <div className="input-cont-color-cls flex items-center border font-semibold text-[13px] h-[40px] mb-[3px] w-max lg:w-[27%] p-[3px] rounded-l">
          <img
            src="/assets/images/indiaFlag.png"
            alt="Indian Flag"
            className="w-6 h-4 mr-1"
          />
          <span className="mt-[3px]">+91</span>
        </div>
        <div className="w-[70%] lg:w-[73%]">
          <input
            className="tel-input-field input-cont-color-cls w-full py-[10px] px-[5px] h-[40px] rounded-r border font-semibold text-[14px] mb-[3px] focus:outline-none"
            type={type}
            name={name}
            maxLength="10"
            placeholder={placeholder}
            onChange={onChange}
            {...register(name, { ...validationRules, onBlur: handleBlur })} // Register + custom onBlur
          />
        </div>
      </div>
      {fieldError &&
        touched && ( // Show error only if touched and error exists
          <p className="input-error text-red-600">{fieldError.message}</p>
        )}
    </div>
  );
};

export default PhoneInputField;
