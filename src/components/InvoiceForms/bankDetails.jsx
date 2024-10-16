import React from 'react';
import CustomInput from '../Input/index';

const BankDetails = ({ formData, handleChange, errors, register }) => {
  return (
    <div className="mt-20 rounded-lg" style={styles.section}>
      <h3 style={styles.titleText}>Bank Details</h3>
      <div style={{ display: "flex", gap: "20px", marginTop: "10px" }}>
        <div style={{ display: "flex", width: "100%", flexDirection: "column" }}>
          <CustomInput
            type="text"
            name="bankDetails.bankName"
            title="Bank Name"
            value={formData.bankDetails.bankName}
            onChange={handleChange}
            style={styles.input}
          />
        </div>

        <div style={{ display: "flex", width: "100%", flexDirection: "column" }}>
          <CustomInput
            type="text"
            name="bankDetails.accountNumber"
            title="Account No."
            value={formData.bankDetails.accountNumber}
            onChange={handleChange}
            style={styles.input}
          />
        </div>

        <div style={{ display: "flex", width: "100%", flexDirection: "column" }}>
          <CustomInput
            type="text"
            name="bankDetails.confirmAccountNumber"
            title="Confirm Account No."
            value={formData.bankDetails.confirmAccountNumber}
            onChange={handleChange}
            style={styles.input}
            errors={errors}
            register={register}
            validationRules={{
              required: formData.bankDetails.accountNumber ? "Confirm account number is required" : false,
              validate: (value) => formData.bankDetails.accountNumber ? value === formData.bankDetails.accountNumber || "Confirm account number does not match account number" : true,
            }}
          />
        </div>
      </div>

      <div style={{ display: "flex", gap: "20px", marginTop: "10px" }}>
        <div style={{ display: "flex", width: "100%", flexDirection: "column" }}>
          <CustomInput
            type="text"
            name="bankDetails.ifscCode"
            title="IFSC Code"
            value={formData.bankDetails.ifscCode}
            onChange={handleChange}
            style={styles.input}
          />
        </div>
        <div style={{ display: "flex", width: "100%", flexDirection: "column" }}>
          <CustomInput
            type="text"
            name="bankDetails.accountHolderName"
            title="Account Holder Name"
            value={formData.bankDetails.accountHolderName}
            onChange={handleChange}
            style={styles.input}
          />
        </div>
        <div style={{ display: "flex", width: "100%", flexDirection: "column" }}>
          <CustomInput
            type="text"
            name="bankDetails.bankAccountType"
            title="Account Type"
            value={formData.bankDetails.bankAccountType}
            onChange={handleChange}
            style={styles.input}
          />
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
    fontSize: "15px",
    marginTop: "15px",
    marginBottom: "10px",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "4px",
    border: "5px solid #ccc"
  },
};
