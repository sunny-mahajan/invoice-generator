import React, { useState } from "react";
import CustomInput from "../Input/index";
import PhoneInputField from "../Input/phoneInput";
import {
  UpArrowIcon,
  DownArrowIcon,
  PlusIcon,
  DeleteIcon,
} from "../../utils/icons"; // Adjust import path
import CustomButton from "../Button/index";

const BillToForm = ({
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
    <div style={styles.section} className="bill-to-main-container w-3/6">
      <div className="bill-to-container p-4 rounded-lg min-h-[25em]">
        <h3 style={styles.titleText}>Bill To</h3>
        <div className="block md:flex gap-5">
          <div className="flex w-full flex-col">
            <CustomInput
              type="text"
              name="clientDetails.name"
              title="Name / Company Name"
              placeholder={"Acme Corp"}
              value={formData.clientDetails.name}
              onChange={handleChange}
              style={styles.input}
              required={true}
              errors={errors}
              register={register}
              validationRules={{
                required: "Name is required",
              }}
            />
          </div>
          <PhoneInputField
            type={"tel"}
            value={formData.clientDetails?.contactNo}
            name={"clientDetails.contactNo"}
            onChange={handleChange}
            placeholder="9898989899"
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
              name="clientDetails.email"
              title="Email"
              value={formData.clientDetails.email}
              onChange={handleChange}
              onBlur={handleBlur}
              touched={touched}
              style={styles.input}
              errors={errors}
              placeholder={"contact@gmail.com"}
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
        <div className="border-slate-200 mt-4">
          <button
            onClick={() => toggleAccordion(3)}
            className="w-full flex justify-between items-center pb-5 text-slate-800"
          >
            <span className="text-[#7c5dfa]">Address (optional)</span>
            {isAccordionOpen[3] ? <UpArrowIcon /> : <DownArrowIcon />}
          </button>
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              isAccordionOpen[3] ? "max-h-screen mb-5" : "max-h-0"
            }`}
          >
            <div className="block md:flex gap-5">
              <div className="flex w-full flex-col">
                <CustomInput
                  type="text"
                  name="clientDetails.street"
                  placeholder={"123 Main St"}
                  value={formData?.clientDetails?.street}
                  onChange={handleChange}
                  title="Street Address"
                  style={styles.input}
                />
              </div>
              <div className="flex w-full flex-col">
                <CustomInput
                  type="text"
                  name="clientDetails.city"
                  placeholder={"Mumbai"}
                  value={formData?.clientDetails?.city}
                  onChange={handleChange}
                  title="City"
                  style={styles.input}
                />
              </div>
            </div>

            <div className="block md:flex gap-5">
              <div className="flex w-full flex-col">
                <CustomInput
                  type="text"
                  name="clientDetails.state"
                  placeholder={"Maharashtra"}
                  value={formData?.clientDetails?.state}
                  onChange={handleChange}
                  title="State"
                  style={styles.input}
                />
              </div>
              <div className="flex w-full flex-col">
                <CustomInput
                  type="number"
                  name="clientDetails.postCode"
                  placeholder={"400001"}
                  value={formData?.clientDetails?.postCode}
                  onChange={handleChange}
                  title="Pin Code"
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
            className="w-full flex justify-between items-center pb-5 text-slate-800"
          >
            <span className="text-[#7c5dfa]">Tax Information (optional)</span>
            {isAccordionOpen[4] ? <UpArrowIcon /> : <DownArrowIcon />}
          </button>
          <div
            className={`transition-all duration-300 ease-in-out ${
              isAccordionOpen[4]
                ? "max-h-screen mb-5"
                : "overflow-hidden max-h-0"
            }`}
          >
            <div className="block md:flex gap-5">
              <div className="flex w-full flex-col">
                <CustomInput
                  type="text"
                  name="clientDetails.taxNo"
                  placeholder={"GST123456789"}
                  value={formData.clientDetails.taxNo}
                  onChange={handleChange}
                  style={styles.input}
                  title="GST Number"
                />
              </div>
              <div className="flex w-full flex-col">
                <CustomInput
                  type="text"
                  name="clientDetails.panNo"
                  placeholder={"PAN0987654321"}
                  value={formData.clientDetails.panNo}
                  onChange={handleChange}
                  style={styles.input}
                  title="PAN Number"
                />
              </div>
            </div>
          </div>
        </div>

        <div>
          {formData.clientDetails.customFields &&
            formData.clientDetails.customFields.length > 0 && (
              <h2 className="text-[#7c5dfa] pb-5 text-base">Custom Fields</h2>
            )}
          {formData.clientDetails.customFields &&
            formData.clientDetails.customFields.map((field, index) => (
              <div key={index} style={styles.itemContainer}>
                <div className="block md:flex gap-5 w-full">
                  <CustomInput
                    type="text"
                    name="fieldName"
                    placeholder="Field Name"
                    containerClass="due-date-input-container"
                    value={field.fieldName}
                    onChange={(e) => handleFieldChange(index, e, "billTo")}
                  />
                  <CustomInput
                    type="text"
                    name="fieldValue"
                    placeholder="Value"
                    containerClass="due-date-input-container"
                    value={field.fieldValue}
                    onChange={(e) => handleFieldChange(index, e, "billTo")}
                  />
                </div>
                <div
                  onClick={() => handleRemoveField(index, "billTo")}
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
                handleAddField("billTo");
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

export default BillToForm;

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
  },
};
