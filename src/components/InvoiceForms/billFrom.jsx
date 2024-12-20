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
import FormCustomDropdown from "../FormDropdown";

const BillFromForm = ({
  formData,
  handleChange,
  errors,
  register,
  handleFieldChange,
  handleAddField,
  handleRemoveField,
  states = [],
  cities = [],
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

  const handleSanitizedChange = (e, callback, regex) => {
    const sanitizedValue = e.target.value.replace(regex, "");
    e.target.value = sanitizedValue;
    callback(e);
  };

  return (
    <div style={styles.section} className="bill-from-main-container w-3/6">
      <div className="bill-from-container p-4 rounded-lg">
        <h3 style={styles.titleText}>Bill From (Your Details)</h3>
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
            className="sub-title w-full flex justify-between items-center pb-5 text-slate-800"
          >
            <span className="font-semibold">
              Address (optional)
            </span>
            {isAccordionOpen[0] ? <DownArrowIcon className="rotate-180 sub-title-icon" /> : <DownArrowIcon className="sub-title-icon"/>}
          </button>
          <div
            className={`transition-all duration-300 ease-in-out ${
              isAccordionOpen[0]
                ? "max-h-screen mb-5"
                : " overflow-hidden max-h-0"
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
            className="sub-title w-full flex justify-between items-center pb-5 text-slate-800"
          >
            <span className="font-semibold">
              Tax Information (optional)
            </span>
            {isAccordionOpen[1] ? <DownArrowIcon className="rotate-180 sub-title-icon" /> : <DownArrowIcon className="sub-title-icon"/>}
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
                <div className="flex w-full flex-col">
                <CustomInput
                  type="text"
                  name="senderDetails.taxType"
                  placeholder={"IGST"}
                  value={formData.senderDetails.taxType}
                  onChange={handleChange}
                  style={styles.input}
                  title="Tax Type"
                  maxLength={15}
                />
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
                  title={`${formData.senderDetails.taxType ? formData.senderDetails.taxType : "Tax"} Number`}
                  maxLength={15}
                  errors={errors}
                  onBlur={handleBlur}
                  touched={touched}
                  register={register}
                  validationRules={{
                    pattern: {
                      value:
                        /\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}/,
                      message: "Invalid Tax number",
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

        {/* Advance paid amount Accordion */}
        <div className="border-slate-200">
          <button
            onClick={() => toggleAccordion(2)}
            className="sub-title w-full flex justify-between items-center pb-5 text-slate-800"
          >
            <span className="font-semibold">
              Advance Paid Amount (optional)
            </span>
            {isAccordionOpen[2] ? <DownArrowIcon className="rotate-180 sub-title-icon" /> : <DownArrowIcon className="sub-title-icon"/>}
          </button>
          <div
            className={`transition-all duration-300 ease-in-out ${
              isAccordionOpen[2]
                ? "max-h-screen mb-5"
                : "overflow-hidden max-h-0"
            }`}
          >
            <div className="block md:flex gap-5">
              <div className="flex w-full flex-col mb-4"></div>
            </div>
            <div className="block md:flex gap-5">
              <div className="flex w-full flex-col">
                <CustomInput
                  type="text"
                  name="senderDetails.advancedAmount"
                  placeholder="5000.25"
                  value={formData.senderDetails.advancedAmount}
                  onChange={(e) =>
                    handleSanitizedChange(e, handleChange, /[^0-9.]/g)
                  }
                  style={styles.input}
                  title="Advance Paid Amount"
                  maxLength={15}
                  onBlur={handleBlur}
                  touched={touched}
                />
              </div>
            </div>
          </div>
        </div>
        {/* Remarks Accordion */}
        <div className="border-slate-200">
          <button
            onClick={() => toggleAccordion(3)}
            className="sub-title w-full flex justify-between items-center pb-5 text-slate-800"
          >
            <span className="font-semibold">
              Brief Notes (optional)
            </span>
            {isAccordionOpen[3] ? <DownArrowIcon className="rotate-180 sub-title-icon" /> : <DownArrowIcon className="sub-title-icon"/>}
          </button>
          <div
            className={`transition-all duration-300 ease-in-out ${
              isAccordionOpen[3]
                ? "max-h-screen mb-5"
                : "overflow-hidden max-h-0"
            }`}
          >
            <div className="block md:flex gap-5">
              <div className="flex w-full flex-col mb-4"></div>
            </div>
            <div className="block md:flex gap-5">
              <div className="flex w-full flex-col">
                <textarea
                  className="textarea"
                  type="text"
                  name="senderDetails.remarks"
                  placeholder={
                    "Thanks for your business! We look forward to working with you again."
                  }
                  value={formData.senderDetails.remarks}
                  onChange={handleChange}
                  style={styles.input}
                  title="Advance Paid Amount"
                  maxLength={100}
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
              <h2 className="text-[#7c5dfa] font-semibold pb-5 text-base">
                Custom Fields
              </h2>
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
              containerClass="add-new-btn-cls w-[50%] md:w-[38%]"
            >
              <PlusIcon /> Add Custom Field
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
    fontSize: "16px",
    // marginTop: "15px",
    marginBottom: "10px",
    fontWeight: "600",
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
