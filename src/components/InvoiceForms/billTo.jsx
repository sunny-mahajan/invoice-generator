import React, {useState} from 'react';
import CustomInput from '../Input/index';
import PhoneInputField from '../Input/phoneInput';
import FormCustomDropdown from '../FormDropdown';
import {UpArrowIcon, DownArrowIcon} from '../../utils/icons'; // Adjust import path


const BillToForm = ({
  formData,
  handleChange,
  errors,
  register,
  taxTypeOptions,
//   toggleAccordion,
//   isAccordionOpen,
}) => {
  const [isAccordionOpen, setIsAccordionOpen] = useState([false, false]);


    const toggleAccordion = (index) => {
        const newAccordionState = [...isAccordionOpen];
        newAccordionState[index] = !newAccordionState[index];
        setIsAccordionOpen(newAccordionState);
      };
  return (
    <div style={styles.section} className="w-3/6">
      <div className="bill-to-container p-4 rounded-lg">
        <h3 style={styles.titleText}>Bill To</h3>
        <div style={{ display: "flex", gap: "20px", marginTop: "10px" }}>
          <div style={{ display: "flex", width: "100%", flexDirection: "column" }}>
            <CustomInput
              type="text"
              name="clientDetails.name"
              title="Client's Name"
              value={formData.clientDetails.name}
              onChange={handleChange}
              style={styles.input}
              required={true}
              errors={errors}
              register={register}
              validationRules={{
                required: "Client name is required",
              }}
            />
          </div>
          <PhoneInputField
            value={formData.clientDetails?.contactNo}
            onChange={(value) =>
              handleChange({
                target: {
                  name: "clientDetails.contactNo",
                  value: value,
                },
              })
            }
            label="Phone No."
            placeholder="Enter phone number"
            defaultCountry="IN"
          />
        </div>

        <div style={{ display: "flex", gap: "20px", marginTop: "10px" }}>
          <div style={{ display: "flex", width: "48%", flexDirection: "column" }}>
            <CustomInput
              type="text"
              name="clientDetails.email"
              title="Client's Email"
              value={formData.clientDetails.email}
              onChange={handleChange}
              style={styles.input}
              errors={errors}
              register={register}
              validationRules={{
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              }}
            />
          </div>
        </div>

        {/* Accordion for Address (optional) */}
        <div className="border-slate-200">
          <button
            onClick={() => toggleAccordion(3)}
            className="w-full flex justify-between items-center py-5 text-slate-800"
          >
            <span className="text-[#dfe3fa]">Address (optional)</span>
            {isAccordionOpen[3] ? <UpArrowIcon /> : <DownArrowIcon />}
          </button>
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              isAccordionOpen[3] ? "max-h-screen" : "max-h-0"
            }`}
          >
            <div style={{ display: "flex", gap: "20px", marginTop: "10px" }}>
              <div style={{ display: "flex", width: "100%", flexDirection: "column" }}>
                <CustomInput
                  type="text"
                  name="clientDetails.street"
                  value={formData?.clientDetails?.street}
                  onChange={handleChange}
                  title="Street Address"
                  style={styles.input}
                />
              </div>
              <div style={{ display: "flex", width: "100%", flexDirection: "column" }}>
                <CustomInput
                  type="text"
                  name="clientDetails.city"
                  value={formData?.clientDetails?.city}
                  onChange={handleChange}
                  title="City"
                  style={styles.input}
                />
              </div>
            </div>

            <div style={{ display: "flex", gap: "20px", marginTop: "10px" }}>
              <div style={{ display: "flex", width: "100%", flexDirection: "column" }}>
                <CustomInput
                  type="text"
                  name="clientDetails.state"
                  value={formData?.clientDetails?.state}
                  onChange={handleChange}
                  title="State"
                  style={styles.input}
                />
              </div>
              <div style={{ display: "flex", width: "100%", flexDirection: "column" }}>
                <CustomInput
                  type="text"
                  name="clientDetails.postCode"
                  value={formData?.clientDetails?.postCode}
                  onChange={handleChange}
                  title="Post Code"
                  style={styles.input}
                />
              </div>
            </div>

            <div style={{ display: "flex", gap: "20px", marginTop: "10px" }}>
              <div style={{ display: "flex", width: "48%", flexDirection: "column" }}>
                <CustomInput
                  type="text"
                  name="clientDetails.country"
                  value={formData?.clientDetails?.country}
                  onChange={handleChange}
                  title="Country"
                  style={styles.input}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Accordion for Tax Information (optional) */}
        <div className="border-slate-200">
          <button
            onClick={() => toggleAccordion(4)}
            className="w-full flex justify-between items-center py-5 text-slate-800"
          >
            <span className="text-[#dfe3fa]">Tax Information (optional)</span>
            {isAccordionOpen[4] ? <UpArrowIcon /> : <DownArrowIcon />}
          </button>
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              isAccordionOpen[4] ? "max-h-screen" : "max-h-0"
            }`}
          >
            <div style={{ display: "flex", gap: "20px", marginTop: "10px" }}>
              <div style={{ display: "flex", width: "100%", flexDirection: "column" }}>
                <FormCustomDropdown
                  name="clientDetails.taxType"
                  title="Tax Type"
                  label={formData.clientDetails.taxType}
                  onSelect={handleChange}
                  style={styles.input}
                  options={taxTypeOptions}
                />
              </div>
              <div style={{ display: "flex", width: "100%", flexDirection: "column" }}>
                <CustomInput
                  type="text"
                  name="clientDetails.taxNo"
                  value={formData.clientDetails.taxNo}
                  onChange={handleChange}
                  style={styles.input}
                  title={formData.clientDetails.taxType + " Number"}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillToForm;

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
