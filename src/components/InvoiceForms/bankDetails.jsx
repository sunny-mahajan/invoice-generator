import React, { useState } from "react";
import CustomInput from "../Input/index";
import { UpArrowIcon, DownArrowIcon } from "../../utils/icons";
import FormCustomDropdown from "../FormDropdown";
import { bankAccountTypeOptions } from "../../utils/constants";

const BankDetails = ({ formData, handleChange, errors, register }) => {
  const [isAccordionOpen, setIsAccordionOpen] = useState([false, false]);

  const toggleAccordion = (index) => {
    const newAccordionState = [...isAccordionOpen];
    newAccordionState[index] = !newAccordionState[index];
    setIsAccordionOpen(newAccordionState);
  };

  return (
    <div className="border-slate-200">
      <button
        onClick={() => toggleAccordion(1)}
        className="w-full flex justify-between items-center pb-5 text-slate-800"
      >
        <span className="text-[#7c5dfa]">Bank Details (optional)</span>
        {isAccordionOpen[1] ? <UpArrowIcon /> : <DownArrowIcon />}
      </button>
      <div
        className={`transition-all duration-300 ease-in-out ${
          isAccordionOpen[1] ? "max-h-screen" : "overflow-hidden max-h-0"
        }`}
      >
        <div className="rounded-lg" style={styles.section}>
          <div className="block md:flex gap-5">
            <div className="w-full flex flex-col">
              <CustomInput
                type="text"
                name="bankDetails.bankName"
                title="Bank Name"
                placeholder="First National Bank"
                value={formData.bankDetails.bankName}
                onChange={handleChange}
                style={styles.input}
              />
            </div>

            <div className="w-full flex flex-col">
              <CustomInput
                type="number"
                name="bankDetails.accountNumber"
                title="Account No."
                placeholder="1234567890"
                value={formData.bankDetails.accountNumber}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
          </div>

          <div className="block md:flex gap-5">
            <div className="w-full flex flex-col">
              <CustomInput
                type="text"
                name="bankDetails.ifscCode"
                title="IFSC Code"
                placeholder="FNB0001234"
                value={formData.bankDetails.ifscCode}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
            <div className="w-full flex flex-col">
              <CustomInput
                type="text"
                name="bankDetails.accountHolderName"
                title="Account Holder Name"
                placeholder="John Doe"
                value={formData.bankDetails.accountHolderName}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
          </div>

          <div className="block md:flex gap-5">
            <div className="w-full flex flex-col">
              <FormCustomDropdown
                name="bankDetails.bankAccountType"
                title="Account Type"
                label={formData.bankDetails.bankAccountType}
                onSelect={handleChange}
                style={styles.input}
                options={bankAccountTypeOptions}
              />
            </div>
            <div className="w-full flex flex-col">
              <CustomInput
                type="text"
                name="bankDetails.bankAddress"
                title="Bank Address"
                placeholder="789 Bank St, Kolkata, India"
                value={formData.bankDetails.bankAddress}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BankDetails;

// Example styles object
const styles = {
  section: {
    marginBottom: "20px",
  },
  titleText: {
    color: "#7C5DFA",
    fontSize: "16px",
    marginTop: "15px",
    marginBottom: "10px",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "4px",
    border: "5px solid #ccc",
  },
};
