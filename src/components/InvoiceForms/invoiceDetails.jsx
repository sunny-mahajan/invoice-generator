import React, { useRef, useState } from "react";
import CustomInput from "../Input/index";
import CustomDatePicker from "../DatePicker/index";
import CustomButton from "../Button/index";
import { PlusIcon, DeleteIcon, UploadLogoIcon } from "../../utils/icons";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  onFileSelect,
  onFileRemove,
}) => {
  const fileInputRef = useRef(null);
  const [selectedFile, setselectedFile] = useState(null);

  const handleFileUpload = (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    if (file) {
      // Check if the file is an image (JPG/PNG)
      const fileType = file.type;
      if (fileType === "image/jpeg" || fileType === "image/png") {
        const img = new Image();
        const objectUrl = URL.createObjectURL(file);

        img.onload = () => {
          const { width, height } = img;
          // Validate resolution
          if (width <= 1080 && height <= 1080) {
            setselectedFile(file);
            onFileSelect(file);
          } else {
            toast.error(
              "Please upload an image with a resolution of 1080x1080"
            );
          }
          URL.revokeObjectURL(objectUrl); // Cleanup
        };
        img.src = objectUrl;
      } else {
        alert("Only JPG and PNG formats are allowed.");
      }
    }
  };

  const handleDeselectFile = (event) => {
    event.stopPropagation();
    setselectedFile(null);
    onFileRemove();
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset the file input
    }
  };
  return (
    <div className="flex gap-5 flex-col">
      <div className="invoice-details-section">
        <div className="w-full">
          <div className="flex w-[90%] mb-5 flex-col">
            <CustomInput
              type="text"
              name="invoiceNo"
              title="Invoice No."
              placeholder="Enter invoice no."
              value={formData?.invoiceNo}
              onChange={handleChange}
              inputClass="input-invoice-cls"
              containerClass="input-container-cls"
              required={true}
              errors={errors}
              register={register}
              validationRules={{ required: "Invoice No. is required" }}
            />
          </div>

          <div
            className="flex w-[90%] mb-5 flex-col"
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
            <div className="flex align-items-center mb-4">
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
              className="due-date-picker-sec flex w-[100%] mb-5 items-center"
              onClick={() => handleDatePickerInputClick(true)}
            >
              <CustomDatePicker
                name="dueDate"
                title="Invoice Due Date"
                value={formData.dueDate}
                onChange={handleChange}
                isDatePickerOpen={isDueDatePickerOpen}
                containerClass="input-container-cls due-date-picker-container"
                invoiceCreatedDate={formData.createdAt}
                isDueDate={true}
              />
              <div
                onClick={() => handleRemoveDueDate()}
                className="cursor-pointer flex items-center justify-center h-full flex-[0_1_auto] w-[10%]"
              >
                <DeleteIcon />
              </div>
            </div>
          )}

          {formData.newFields &&
            formData.newFields.map((field, index) => (
              <div
                key={index}
                style={styles.itemContainer}
                className="w-[100%]"
              >
                <div className="custom-field-label">
                  <CustomInput
                    type="text"
                    name="fieldName"
                    placeholder="Field Name"
                    containerClass="due-date-input-container-cls"
                    containerStyle={{ width: "100%", marginBottom: "0" }}
                    value={field.fieldName}
                    onChange={(e) => handleFieldChange(index, e)}
                  />
                  <CustomInput
                    type="text"
                    name="fieldValue"
                    placeholder="Value"
                    containerClass="due-date-input-container-cls"
                    containerStyle={{ width: "100%", marginBottom: "0" }}
                    value={field.fieldValue}
                    onChange={(e) => handleFieldChange(index, e)}
                  />
                </div>
                <div
                  onClick={() => handleRemoveField(index)}
                  className="cursor-pointer flex items-center justify-center h-full flex-[0_1_auto] w-[10%]"
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
        <div className="w-full d-flex justify-end mb-8">
          <div
            className={`file-upload-container cursor-pointer flex items-center justify-center rounded-xl border-2 border-dashed border-white w-full min-h-[150px] bg-[#252945] hover:bg-[#1c1f32] transition duration-200 min-w-[200px] p-4 ${
              selectedFile
                ? "max-w-[220px] max-h-[180px]"
                : "max-w-[250px] max-h-[150px]"
            }`}
          >
            <div
              onClick={() => fileInputRef.current.click()}
              className="flex flex-col items-center justify-center w-full h-full cursor-pointer"
            >
              {selectedFile ? (
                // Display the uploaded image when a file is selected
                <img
                  src={URL.createObjectURL(selectedFile)}
                  alt="Uploaded logo"
                  className="w-full max-h-[120px] object-contain"
                />
              ) : (
                <>
                  <UploadLogoIcon />
                  <span className="text-white mt-1">
                    <div className="flex flex-col items-center">
                      <p className="text-base mb-2 font-medium">
                        Add Business Logo
                      </p>
                      <span className="text-sm mb-1">
                        Resolution up to 1080x1080.
                      </span>
                      <span className="text-sm">JPG or PNG file.</span>
                    </div>
                  </span>
                </>
              )}

              {selectedFile && (
                <button
                  type="button"
                  onClick={handleDeselectFile}
                  className="text-red-500 mt-2"
                >
                  ✖ Remove
                </button>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".jpg, .jpeg, .png"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetailsForm;

// Example styles object
const styles = {
  itemContainer: {
    display: "flex",
    alignItems: "center",
    marginBottom: "20px",
    flex: "2 1 1 1",
    // Define your item container styles here
  },
};
