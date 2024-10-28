import React from "react";
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
  const fieldError = name
    ?.split(".")
    .reduce((acc, part) => acc?.[part], errors);

  return (
    <div className="input-container">
      <div className="input-title-container">
        <label className="input-title">Phone number:</label>
      </div>
      <div className="flex items-center">
        <div className="flex items-center border border-[#20233d] font-semibold text-[13px] bg-[#252945] text-[#f8f8f8] h-[40px] mb-[3px] w-max lg:w-[27%] p-[3px] rounded-l">
          <img
            src="/assets/images/indiaFlag.png"
            alt="Indian Flag"
            className="w-6 h-4 mr-1"
          />
          <span className="mt-[3px]">+91</span>
        </div>
        <div className="w-[70%] lg:w-[73%]">
          <input
            className="tel-input-field w-full py-[10px] px-[5px] h-[40px] rounded-r border border-[#20233d] font-semibold text-[14px] bg-[#252945] text-[#f8f8f8] mb-[3px] placeholder-[#f8f8f8] focus:outline-none"
            type={type}
            name={name}
            maxLength="10"
            placeholder={placeholder}
            onChange={onChange}
            {...register(name, validationRules)}
          />
        </div>
      </div>
      {fieldError && (
        <p className="input-error text-red-600">{fieldError.message}</p>
      )}
    </div>
  );
};

export default PhoneInputField;
