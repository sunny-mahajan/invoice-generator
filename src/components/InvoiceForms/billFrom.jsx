// components/BillFromForm.js
import React, { useState } from "react";
import CustomInput from "../Input/index"; // Make sure to adjust the import path as needed
import PhoneInputField from "../Input/phoneInput"; // Adjust import path
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
  const [touched, setTouched] = useState(false);

  const toggleAccordion = (index) => {
    const newAccordionState = [...isAccordionOpen];
    newAccordionState[index] = !newAccordionState[index];
    setIsAccordionOpen(newAccordionState);
  };

  const handleBlur = () => {
    setTouched(true); // Set touched state to true on blur
  };

  return (
    <div style={styles.section} className="bill-from-main-container w-3/6">
      <div className="bill-from-container p-4 rounded-lg">
        <h3 style={styles.titleText}>Bill From</h3>
        <div className="block md:flex gap-5">
          <div className="flex w-full flex-col">
            <CustomInput
              type="text"
              name="senderDetails.name"
              title="Name / Company Name"
              placeholder="Beta LLC"
              maxLength={50}
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
            maxLength={50}
            onChange={handleChange}
            placeholder="9876543210"
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

        <div className="block md:flex gap-5">
          <div className="flex w-full md:w-[48%] flex-col">
            <CustomInput
              type="text"
              name="senderDetails.email"
              title="Email"
              placeholder="billing@beta.com"
              maxLength={50}
              value={formData?.senderDetails?.email}
              onChange={handleChange}
              style={styles.input}
              errors={errors}
              onBlur={handleBlur}
              touched={touched}
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
            <div className="block md:flex gap-5">
              <div className="flex w-full flex-col">
                <CustomInput
                  type="text"
                  name="senderDetails.street"
                  title="Street Address"
                  placeholder={"456 Broadway Ave"}
                  maxLength={50}
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
                  placeholder={"Kolkata"}
                  maxLength={50}
                  value={formData?.senderDetails?.city}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>
            </div>
            <div className="block md:flex gap-5">
              <div className="flex w-full flex-col">
                <CustomInput
                  type="text"
                  name="senderDetails.state"
                  title="State"
                  placeholder={"West Bengal"}
                  maxLength={50}
                  value={formData?.senderDetails?.state}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>
              <div className="flex w-full flex-col">
                <CustomInput
                  type="text"
                  inputMode="numeric"
                  name="senderDetails.postCode"
                  title="Pin Code"
                  placeholder={"700001"}
                  maxLength={6}
                  value={formData?.senderDetails?.postCode}
                  onChange={handleChange}
                  style={styles.input}
                  errors={errors}
                  onBlur={handleBlur}
                  touched={touched}
                  register={register}
                  validationRules={{
                    pattern: {
                      value: /^\d{6}$/,
                      message: "Invalid Pin Code",
                    },
                  }}
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
            <div className="block md:flex gap-5">
              <div className="flex w-full flex-col mb-4">
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
                  <div className="flex items-center">
                    <input
                      id="cst-radio"
                      type="radio"
                      value="None" // Set the value to "CST"
                      name="senderDetails.taxType"
                      checked={formData.senderDetails.taxType === "None"} // Check if this is the selected value
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      onChange={handleChange} // Add your change handler here
                    />
                    <label
                      htmlFor="cst-radio"
                      className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      None
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="block md:flex gap-5">
              <div className="flex w-full flex-col">
                <CustomInput
                  type="text"
                  name="senderDetails.taxNo"
                  placeholder={"GST123456789"}
                  value={formData.senderDetails.taxNo}
                  onChange={handleChange}
                  style={styles.input}
                  title="GST Number"
                  maxLength={15}
                  errors={errors}
                  onBlur={handleBlur}
                  touched={touched}
                  register={register}
                  validationRules={{
                    pattern: {
                      value: /\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}/,
                      message: "Invalid GST number",
                    },
                  }}
                />
              </div>
              <div className="flex w-full flex-col">
                <CustomInput
                  type="text"
                  name="senderDetails.panNo"
                  placeholder={"PAN123456789"}
                  value={formData.senderDetails.panNo}
                  onChange={handleChange}
                  style={styles.input}
                  title="PAN Number"
                  maxLength={10}
                  errors={errors}
                  onBlur={handleBlur}
                  touched={touched}
                  register={register}
                  validationRules={{
                    pattern: {
                      value: /[A-Z]{5}[0-9]{4}[A-Z]{1}/,
                      message: "Invalid PAN number",
                    },
                  }}
                />
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
                    maxLength={50}
                    containerClass="due-date-input-container"
                    value={field.fieldName}
                    onChange={(e) => handleFieldChange(index, e, "billFrom")}
                  />
                  <CustomInput
                    type="text"
                    name="fieldValue"
                    placeholder="Value"
                    maxLength={50}
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
                  className="pb-4"
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
              containerClass="add-new-btn-cls"
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
