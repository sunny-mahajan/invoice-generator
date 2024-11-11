import React from "react";
import InvoicePreview from "../InvoicePreview";

const DialogBox = ({
  isOpen,
  onClose,
  title,
  content,
  confirmText,
  cancelText,
  onConfirm,
  InvoiceTemplatePreview = false,
  invoiceData = {},
  selectedTemplateId,
}) => {
  if (!isOpen) return null; // Don't render if the dialog is not open

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      ></div>

      {InvoiceTemplatePreview && (
        <div className="bg-white p-6 rounded-lg shadow-lg z-50 w-full relative max-h-[70vh] max-w-[70vw] overflow-y-scroll">
          <div className="flex justify-between items-center mb-4">
            {/* Title */}
            <h3 className="text-xl font-semibold text-black">{title}</h3>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              &times;
            </button>
          </div>
          <InvoicePreview
            InvoiceTemplatePreview={InvoiceTemplatePreview}
            invoiceData={invoiceData} // Make sure to pass the correct invoice data here
            selectedTemplateId={selectedTemplateId}
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
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              &times;
            </button>
          </div>

          {/* Content */}
          <div className="mb-6 text-left">
            <div className="text-black" style={{ whiteSpace: "pre-line" }}>
              {content}
            </div>
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

            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {confirmText}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DialogBox;
