// components/BillFromForm.js
import React, { useState } from 'react';
import CustomInput from '../Input/index'; // Make sure to adjust the import path as needed
import PhoneInputField from '../Input/phoneInput'; // Adjust import path
import FormCustomDropdown from '../FormDropdown'; // Adjust import path
import {UpArrowIcon, DownArrowIcon} from '../../utils/icons'; // Adjust import path

const BillFromForm = ({ formData, handleChange, errors, register, taxTypeOptions }) => {
  const [isAccordionOpen, setIsAccordionOpen] = useState([false, false]);

  const toggleAccordion = (index) => {
    const newAccordionState = [...isAccordionOpen];
    newAccordionState[index] = !newAccordionState[index];
    setIsAccordionOpen(newAccordionState);
  };

  return (
    <div style={styles.section} className="w-3/6">
      <div className="bill-from-container p-4 rounded-lg">
        <h3 style={styles.titleText}>Bill From</h3>
        <div style={{ display: 'flex', gap: '20px' , marginTop: "10px" }}>
          <div style={{ display: 'flex', width: '100%', flexDirection: 'column' }}>
            <CustomInput
              type="text"
              name="senderDetails.name"
              title="Name"
              value={formData?.senderDetails?.name}
              onChange={handleChange}
              style={styles.input}
              required={true}
              errors={errors}
              register={register}
              validationRules={{ required: "Name is required" }}
            />
          </div>
          <PhoneInputField
            value={formData.senderDetails?.contactNo}
            onChange={(value) =>
              handleChange({ target: { name: "senderDetails.contactNo", value } })
            }
            label="Phone No."
            placeholder="Enter Phone number"
            defaultCountry="IN"
          />
        </div>

        <div style={{ display: 'flex', gap: '20px', marginTop: '10px' }}>
          <div style={{ display: 'flex', width: '48%', flexDirection: 'column' }}>
            <CustomInput
              type="text"
              name="senderDetails.email"
              title="Email"
              value={formData?.senderDetails?.email}
              onChange={handleChange}
              style={styles.input}
              errors={errors}
              register={register}
              validationRules={{
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email format",
                },
              }}
            />
          </div>
        </div>

        {/* Address Accordion */}
        <div className="border-slate-200">
          <button onClick={() => toggleAccordion(0)} className="w-full flex justify-between items-center py-5 text-slate-800">
            <span className="text-[#dfe3fa]">Address (optional)</span>
            {isAccordionOpen[0] ? <UpArrowIcon /> : <DownArrowIcon />}
          </button>
          <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isAccordionOpen[0] ? "max-h-screen" : "max-h-0"}`}>
            <div style={{ display: 'flex', gap: '20px', marginTop: '10px' }}>
              <div style={{ display: 'flex', width: '100%', flexDirection: 'column' }}>
                <CustomInput
                  type="text"
                  name="senderDetails.street"
                  title="Street Address"
                  value={formData?.senderDetails?.street}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>
              <div style={{ display: 'flex', width: '100%', flexDirection: 'column' }}>
                <CustomInput
                  type="text"
                  name="senderDetails.city"
                  title="City"
                  value={formData?.senderDetails?.city}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '20px', marginTop: '10px' }}>
              <div style={{ display: 'flex', width: '100%', flexDirection: 'column' }}>
                <CustomInput
                  type="text"
                  name="senderDetails.state"
                  title="State"
                  value={formData?.senderDetails?.state}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>
              <div style={{ display: 'flex', width: '100%', flexDirection: 'column' }}>
                <CustomInput
                  type="text"
                  name="senderDetails.postCode"
                  title="Post Code"
                  value={formData?.senderDetails?.postCode}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '20px', marginTop: '10px' }}>
              <div style={{ display: 'flex', width: '48%', flexDirection: 'column' }}>
                <CustomInput
                  type="text"
                  name="senderDetails.country"
                  title="Country"
                  value={formData?.senderDetails?.country}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tax Information Accordion */}
        <div className="border-slate-200">
          <button onClick={() => toggleAccordion(1)} className="w-full flex justify-between items-center py-5 text-slate-800">
            <span className="text-[#dfe3fa]">Tax Information (optional)</span>
            {isAccordionOpen[1] ? <UpArrowIcon /> : <DownArrowIcon />}
          </button>
          <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isAccordionOpen[1] ? "max-h-screen" : "max-h-0"}`}>
            <div style={{ display: 'flex', gap: '20px', marginTop: '10px' }}>
              <div style={{ display: 'flex', width: '100%', flexDirection: 'column' }}>
                <FormCustomDropdown
                  name="senderDetails.taxType"
                  title="Tax Type"
                  label={formData.senderDetails.taxType}
                  onSelect={handleChange}
                  style={styles.input}
                  options={taxTypeOptions}
                />
              </div>
              <div style={{ display: 'flex', width: '100%', flexDirection: 'column' }}>
                <CustomInput
                  type="text"
                  name="senderDetails.taxNo"
                  value={formData.senderDetails.taxNo}
                  onChange={handleChange}
                  style={styles.input}
                  title={formData.senderDetails.taxType + " Number"}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillFromForm;

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
