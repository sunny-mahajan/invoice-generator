import React, { useState } from "react";
import PhoneInput, { isPossiblePhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";

const PhoneInputField = ({
  value,
  onChange,
  defaultCountry = "IN",
  label = "Contact No.",
  placeholder = "Enter phone number",
}) => {
  const [error, setError] = useState("");

  const handleContactChange = (newValue) => {
    onChange(newValue);

    // Validate phone number
    if (!newValue) {
      setError("Phone number required");
    } else if (!isPossiblePhoneNumber(newValue)) {
      setError("Invalid phone number");
    } else {
      setError(""); // Clear error if phone number is valid
    }
  };

  return (
    <div
      style={{
        display: "flex",
        gap: "10px",
        width: "100%",
        flexDirection: "column",
      }}
      className="contact-container"
    >
      <div className="invoice-title-container">
        <label className="input-title">{label}</label>
      </div>
      <PhoneInput
        international
        placeholder={placeholder}
        value={value}
        onChange={handleContactChange}
        defaultCountry={defaultCountry}
      />
      {error && (
        <p
          style={{
            color: "red",
            fontSize: "12px",
            marginTop: "5px",
          }}
        >
          {error}
        </p>
      )}
    </div>
  );
};

export default PhoneInputField;
