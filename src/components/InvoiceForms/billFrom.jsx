// components/BillFromForm.js
import React, { useState } from "react";
import CustomInput from "../Input/index"; // Make sure to adjust the import path as needed
import PhoneInputField from "../Input/phoneInput"; // Adjust import path
import FormCustomDropdown from "../FormDropdown"; // Adjust import path
import {
  UpArrowIcon,
  DownArrowIcon,
  PlusIcon,
  DeleteIcon,
} from "../../utils/icons"; // Adjust import path
import CustomButton from "../Button/index";
import BankDetails from "./bankDetails";

const BillFromForm = ({
  formData,
  handleChange,
  errors,
  register,
  taxTypeOptions,
  handleFieldChange,
  handleAddField,
  handleRemoveField,
}) => {
  const [isAccordionOpen, setIsAccordionOpen] = useState([false, false]);

  const toggleAccordion = (index) => {
    const newAccordionState = [...isAccordionOpen];
    newAccordionState[index] = !newAccordionState[index];
    setIsAccordionOpen(newAccordionState);
  };

  return (
    <div style={styles.section} className="bill-from-main-container w-3/6">
      <div className="bill-from-container p-4 rounded-lg">
        <h3 style={styles.titleText}>Bill From</h3>
        <div className="block md:flex gap-5 mt-2.5">
          <div className="flex w-full flex-col">
            <CustomInput
              type="text"
              name="senderDetails.name"
              title="Name / Company Name"
              placeholder="Enter name"
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
            type={"tel"}
            value={formData.senderDetails?.contactNo}
            name={"senderDetails.contactNo"}
            onChange={handleChange}
            placeholder="Enter Phone number"
            errors={errors}
            register={register}
            validationRules={{
              pattern: {
                value: /^\d{10}$/,
                message: "Invalid phone number",
              },
            }}
          />
        </div>

        <div className="block md:flex gap-5 mt-2.5">
          <div className="flex w-full md:w-[48%] flex-col">
            <CustomInput
              type="text"
              name="senderDetails.email"
              title="Email"
              placeholder="Enter email"
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
        <div className="border-slate-200 mt-4">
          <button
            onClick={() => toggleAccordion(0)}
            className="w-full flex justify-between items-center pb-5 text-slate-800"
          >
            <span className="text-[#7c5dfa]">Address (optional)</span>
            {isAccordionOpen[0] ? <UpArrowIcon /> : <DownArrowIcon />}
          </button>
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              isAccordionOpen[0] ? "max-h-screen mb-5" : "max-h-0"
            }`}
          >
            <div className="block md:flex gap-5 mt-2.5">
              <div className="flex w-full flex-col">
                <CustomInput
                  type="text"
                  name="senderDetails.street"
                  title="Street Address"
                  placeholder={"Enter street address"}
                  value={formData?.senderDetails?.street}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>
              <div className="flex w-full flex-col">
                <CustomInput
                  type="text"
                  name="senderDetails.city"
                  title="City"
                  placeholder={"Enter city"}
                  value={formData?.senderDetails?.city}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>
            </div>
            <div className="block md:flex gap-5 mt-2.5">
              <div className="flex w-full flex-col">
                <CustomInput
                  type="text"
                  name="senderDetails.state"
                  title="State"
                  placeholder={"Enter state"}
                  value={formData?.senderDetails?.state}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>
              <div className="flex w-full flex-col">
                <CustomInput
                  type="number"
                  name="senderDetails.postCode"
                  title="Pin Code"
                  placeholder={"Enter pin code"}
                  value={formData?.senderDetails?.postCode}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>
            </div>
            <div className="block md:flex gap-5 mt-2.5">
              <div className="flex w-full md:w-[48%] flex-col">
                <CustomInput
                  type="text"
                  name="senderDetails.country"
                  title="Country"
                  placeholder={"Enter country"}
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
          <button
            onClick={() => toggleAccordion(1)}
            className="w-full flex justify-between items-center pb-5 text-slate-800"
          >
            <span className="text-[#7c5dfa]">Tax Information (optional)</span>
            {isAccordionOpen[1] ? <UpArrowIcon /> : <DownArrowIcon />}
          </button>
          <div
            className={`transition-all duration-300 ease-in-out ${
              isAccordionOpen[1]
                ? "max-h-screen mb-5"
                : "overflow-hidden max-h-0"
            }`}
          >
            <div className="block md:flex gap-5 mt-2.5">
              <div className="flex w-full flex-col">
                <CustomInput
                  type="text"
                  name="senderDetails.taxNo"
                  placeholder={"Enter gst number"}
                  value={formData.senderDetails.taxNo}
                  onChange={handleChange}
                  style={styles.input}
                  title="GST Number"
                />
              </div>
              <div className="flex w-full flex-col">
                {/* <FormCustomDropdown
                  name="senderDetails.taxType"
                  title="Tax Type"
                  label={formData.senderDetails.taxType}
                  onSelect={handleChange}
                  style={styles.input}
                  options={taxTypeOptions}
                /> */}
                <div>
                  <span className="input-title">Tax Type</span>
                </div>
                <div className="flex w-full gap-5 mt-[11px]">
                  <div className="flex items-center">
                    <input
                      id="igst-radio"
                      type="radio"
                      value="IGST" // Set the value to "IGST"
                      name="senderDetails.taxType"
                      checked={formData.senderDetails.taxType === "IGST"} // Check if this is the selected value
                      className="w-4 h-4 text-custom-purple bg-gray-100 border-gray-300 focus:ring-custom-purple dark:focus:ring-custom-purple dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      onChange={handleChange} // Add your change handler here
                    />
                    <label
                      htmlFor="igst-radio"
                      className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      IGST
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      id="cst-radio"
                      type="radio"
                      value="CGST & SGST" // Set the value to "CST"
                      name="senderDetails.taxType"
                      checked={formData.senderDetails.taxType === "CGST & SGST"} // Check if this is the selected value
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      onChange={handleChange} // Add your change handler here
                    />
                    <label
                      htmlFor="cst-radio"
                      className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      CGST & SGST
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <BankDetails
          formData={formData}
          handleChange={handleChange}
          errors={errors}
          register={register}
        />

        <div>
          {formData.senderDetails.customFields &&
            formData.senderDetails.customFields.length > 0 && (
              <h2 className="text-[#7c5dfa] pb-5 text-base">Custom Fields</h2>
            )}
          {formData.senderDetails.customFields &&
            formData.senderDetails.customFields.map((field, index) => (
              <div key={index} style={styles.itemContainer}>
                <div className="block md:flex gap-5 w-full">
                  <CustomInput
                    type="text"
                    name="fieldName"
                    placeholder="Field Name"
                    containerClass="due-date-input-container"
                    value={field.fieldName}
                    onChange={(e) => handleFieldChange(index, e, "billFrom")}
                  />
                  <CustomInput
                    type="text"
                    name="fieldValue"
                    placeholder="Value"
                    containerClass="due-date-input-container"
                    value={field.fieldValue}
                    onChange={(e) => handleFieldChange(index, e, "billFrom")}
                  />
                </div>
                <div
                  onClick={() => handleRemoveField(index, "billFrom")}
                  style={{
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                    flex: "0 1 auto",
                  }}
                  className="pb-5 md:pb-0"
                >
                  <DeleteIcon />
                </div>
              </div>
            ))}
          <div className="mb-4 flex align-items-center">
            <CustomButton
              type="gray"
              onClick={(e) => {
                e.preventDefault();
                handleAddField("billFrom");
              }}
              buttonStyle={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                float: "right",
                filter: "brightness(1.3)",
              }}
            >
              <PlusIcon f={"rgb(124, 93, 250)"} /> Add Custom Field
            </CustomButton>
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
    fontSize: "16px",
    // marginTop: "15px",
    marginBottom: "10px",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "4px",
    border: "5px solid #ccc",
  },
  itemContainer: {
    display: "flex",
    alignItems: "center",
    marginBottom: "20px",
    gap: "20px",
    flex: "2 1 1 1",
    // Define your item container styles here
  },
};
