import React, { useState, useEffect } from "react";
import InvoicePreview from "../InvoicePreview";
import CustomInput from "../Input";
import CustomButton from "../Button";

const DialogBox = ({
  isOpen,
  onClose,
  title,
  content,
  confirmText,
  cancelText,
  onConfirm,
  InvoiceTemplatePreview = false,
  selectedTemplateId,
  previewUrl = "",
  errors,
  register,
  isLoading = false,
  touchedInput,
  disabled,
}) => {
  const [touched, setTouched] = useState(false);
  useEffect(() => {
    setTouched(touchedInput);
  }, [touchedInput]);

  if (!isOpen) return null; // Don't render if the dialog is not open

  const handleBlur = () => {
    setTouched(true); // Set touched state to true on blur
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      ></div>

      {InvoiceTemplatePreview && (
        <div className="bg-white p-6 rounded-lg shadow-lg z-50 w-full relative max-h-[80vh] max-w-[80vw] overflow-y-scroll">
          <div className="flex justify-between items-center mb-4">
            {/* Title */}
            <h3 className="text-xl font-semibold text-black">{title}</h3>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 focus:outline-none text-4xl"
            >
              &times;
            </button>
          </div>
          <InvoicePreview
            InvoiceTemplatePreview={InvoiceTemplatePreview}
            selectedTemplateId={selectedTemplateId}
            previewUrl={previewUrl}
          />
        </div>
      )}
      {!InvoiceTemplatePreview && (
        <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-lg p-6 relative z-10">
          <div className="flex justify-between items-center mb-4">
            {/* Title */}
            <h3 className="text-xl font-semibold text-black">{title}</h3>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 focus:outline-none text-2xl"
            >
              &times;
            </button>
          </div>

          {/* Content */}
          <div className="user-mail-container flex items-center justify-center text-black">
            <CustomInput
              type="text"
              title="Email"
              name="userEmail"
              maxLength={50}
              onBlur={handleBlur}
              touched={touched}
              errors={errors}
              placeholder={"contact@gmail.com"}
              containerStyle={{ width: "100%" }}
              register={register}
              required={true}
              validationRules={{
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              }}
            />
          </div>
          {/* Buttons */}
          <div className="flex justify-end space-x-4">
            {cancelText && cancelText !== "" && (
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >
                {cancelText}
              </button>
            )}
            <div className="flex justify-center md:justify-between rounded-r-lg w-full py-5">
              <CustomButton
                type="purple"
                onClick={onConfirm}
                buttonStyle={{ minWidth: "200px" }}
                isLoading={isLoading}
                disabled={disabled}
              >
                {confirmText}
              </CustomButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DialogBox;
