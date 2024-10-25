import React, { useState } from "react";
import PhoneInput, { isPossiblePhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { indianPhoneRegex } from "../../utils/constants";

const PhoneInputField = ({
  value,
  onChange,
  defaultCountry = "IN",
  label = "Contact No.",
  placeholder = "Enter phone number",
  register,
  errors,
  name,
  validationRules,
}) => {
  const [error, setError] = useState("");

  const handleContactChange = (newValue) => {
    onChange(newValue);

    if (newValue && newValue.startsWith("+91")) {
      if (!indianPhoneRegex.test(newValue)) {
        setError("Invalid phone number");
      } else {
        setError("");
      }
    } else {
      if (newValue && !isPossiblePhoneNumber(newValue)) {
        setError("Invalid phone number");
      } else {
        setError("");
      }
    }
  };

  return (
    <div className="w-full d-flex">
      {/* <form class="max-w-sm mx-auto">
        <div class="flex items-center">
          <button
            id="dropdown-phone-button"
            class="flex-shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-s-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 dark:text-white dark:border-gray-600"
            type="button"
          >
            <svg
              fill="none"
              aria-hidden="true"
              class="h-4 w-4 me-2"
              viewBox="0 0 20 15"
            ></svg>
            +91{" "}
          </button>
        </div>
        <CustomInput
          type="text"
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          title={label}
          errors={errors}
          register={register}
          validationRules={validationRules}
        />
      </form> */}
      <div class="w-full">
        <label>Phone number:</label>
        <div className="flex items-center">
          <div className="flex items-center">
            <img
              src="/assets/images/indiaFlag.png"
              alt="Indian Flag"
              className="w-6 h-4 mr-1"
            />
            +91{" "}
          </div>
          <div>
            <input
              className="input-field"
              type="number"
              max="10"
              placeholder="1234567890"
            />
          </div>
        </div>
      </div>
    </div>

    // <div
    //   style={{
    //     display: "flex",
    //     gap: "3px",
    //     width: "100%",
    //     flexDirection: "column",
    //   }}
    //   className="contact-container"
    // >
    //   <div className="invoice-title-container">
    //     <label className="input-title">{label}</label>
    //   </div>
    //   <PhoneInput
    //     international
    //     placeholder={placeholder}
    //     value={value}
    //     onChange={handleContactChange}
    //     defaultCountry={defaultCountry}
    //   />
    //   {error && <p className="input-error text-red-600">{error}</p>}
    // </div>
  );
};

export default PhoneInputField;
