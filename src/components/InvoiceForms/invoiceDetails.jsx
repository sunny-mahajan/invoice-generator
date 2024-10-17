import React from "react";
import CustomInput from "../Input/index";
import CustomDatePicker from "../DatePicker/index";
import CustomButton from "../Button/index";
import { PlusIcon, DeleteIcon } from "../../utils/icons";

const InvoiceDetailsForm = ({
  formData,
  handleChange,
  handleDueDate,
  isDueDateOpen,
  handleRemoveDueDate,
  handleFieldChange,
  handleAddField,
  handleRemoveField,
  handleDatePickerInputClick,
  datePickerInputRef,
  customDatePickerRef,
  isDatePickerOpen,
  isDueDatePickerOpen,
  errors,
  register,
}) => {
  return (
    console.log("formData------", formData),
    (
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <div style={{ display: "flex", width: "45%", flexDirection: "column" }}>
          <CustomInput
            type="text"
            name="invoiceNo"
            title="Invoice No."
            placeholder="Enter invoice no."
            value={formData?.invoiceNo}
            onChange={handleChange}
            style={styles.input}
            containerClass="input-container-cls"
            required={true}
            errors={errors}
            register={register}
            validationRules={{ required: "Invoice No. is required" }}
          />
        </div>

        <div
          style={{ display: "flex", width: "45%", flexDirection: "column" }}
          ref={datePickerInputRef}
          onClick={() => handleDatePickerInputClick(false)}
        >
          <CustomDatePicker
            name="createdAt"
            title="Invoice Date"
            value={formData.createdAt}
            onChange={handleChange}
            isDatePickerOpen={isDatePickerOpen}
            customDatePickerRef={customDatePickerRef}
            containerClass="input-container-cls"
            required={true}
          />
        </div>

        {!isDueDateOpen ? (
          <div className="flex align-items-center">
            <CustomButton
              type="gray"
              onClick={(e) => {
                e.preventDefault();
                handleDueDate();
              }}
              buttonStyle={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                float: "right",
              }}
            >
              <PlusIcon f={"rgb(124, 93, 250)"} /> Add Due Date
            </CustomButton>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              width: "48%",
              gap: "20px",
              alignItems: "center",
            }}
            onClick={() => handleDatePickerInputClick(true)}
          >
            <CustomDatePicker
              name="dueDate"
              title="Invoice Due Date"
              value={formData.dueDate}
              onChange={handleChange}
              isDatePickerOpen={isDueDatePickerOpen}
              containerClass="input-container-cls"
              invoiceCreatedDate={formData.createdAt}
              isDueDate={true}
            />
            <div
              onClick={() => handleRemoveDueDate()}
              style={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                flex: "0 1 auto",
              }}
            >
              <DeleteIcon />
            </div>
          </div>
        )}

        <div>
          {formData.newFields &&
            formData.newFields.map((field, index) => (
              <div key={index} style={styles.itemContainer} className="w-[48%]">
                <CustomInput
                  type="text"
                  name="fieldName"
                  placeholder="Field Name"
                  containerClass="due-date-input-container-cls"
                  containerStyle={{ width: "80%", marginBottom: "0" }}
                  value={field.fieldName}
                  onChange={(e) => handleFieldChange(index, e)}
                />
                <CustomInput
                  type="text"
                  name="fieldValue"
                  placeholder="Value"
                  containerClass="due-date-input-container-cls"
                  value={field.fieldValue}
                  onChange={(e) => handleFieldChange(index, e)}
                />
                <div
                  onClick={() => handleRemoveField(index)}
                  style={{
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                    flex: "0 1 auto",
                  }}
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
                handleAddField();
              }}
              buttonStyle={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                float: "right",
              }}
            >
              <PlusIcon f={"rgb(124, 93, 250)"} /> Add More Field
            </CustomButton>
          </div>
        </div>
      </div>
    )
  );
};

export default InvoiceDetailsForm;

// Example styles object
const styles = {
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "4px",
    border: "5px solid #ccc",
    // Define your input styles here
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
