import React, { useState, useEffect } from "react";
import DialogBox from "../DialogBox";
import { PreviewIcon } from "../../utils/icons";

const InvoiceTemplates = ({
  handleSelectTemplates = () => {},
  selectable = false,
  handleTemplateSelection = () => {},
  isShowRandomSelection = false,
  invoiceData = {},
  isRandomSelectionChecked = false,
}) => {
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);
  const [invoiceTemplates, setTemplates] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    const res = await fetch(`/api/templates`);
    const templates = await res.json();

    setTemplates(templates);

    if (templates.length > 0) {
      setSelectedTemplateId(templates[0].id);
      handleSelectTemplates(templates[0].id);
    }
  };

  const selectTemplate = (templateId) => {
    if (selectable) {
      setSelectedTemplateId(templateId);
      handleSelectTemplates(templateId);
    }
  };

  const handleTemplatePreview = (templateId) => {
    setIsDialogOpen(true);
  };
  const handleCloseDialog = () => setIsDialogOpen(false);

  const styles = {
    title: {
      color: "var(--color)",
    },
    "template-preview-image": {
      height: "200px",
      width: "100%",
    },
  };

  return (
    <div>
      <div className="flex items-center justify-between pb-2.5 pt-5">
        <h2 style={styles.title}>
          {selectable ? "Select Template" : "Templates"}
        </h2>
        {isShowRandomSelection && (
          <div className="flex items-center">
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                value=""
                className="sr-only peer"
                onChange={handleTemplateSelection} // Call the function when the toggle is changed
              />
              <div className="random-temp-cls relative w-12 h-7 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[3.66px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              <span className="ml-3">Use Random Template</span>
            </label>
          </div>
        )}
      </div>

      <div
        className={`invoice-templates-cls grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-4 ${
          isRandomSelectionChecked ? "opacity-50 pointer-events-none" : ""
        }`}
      >
        {invoiceTemplates.map((invoiceTemplate) => (
          <div
            key={invoiceTemplate.id}
            className="template-tile w-full p-2 flex items-center flex-col cursor-pointer"
            onClick={() => selectTemplate(invoiceTemplate.id)}
          >
            <div
              className={`template-content flex items-center flex-col relative group  ${
                selectedTemplateId === invoiceTemplate.id && selectable
                  ? "selected-invoice-template"
                  : ""
              }`}
            >
              <div className="template-preview-image-container w-full h-48 overflow-hidden">
                <img
                  className="template-preview-image h-full w-full"
                  src={invoiceTemplate.previewUrl}
                  alt={invoiceTemplate.name}
                />
              </div>
              <div
                onClick={() => handleTemplatePreview(invoiceTemplate.id)}
                className="absolute top-2 right-5 hidden group-hover:block"
              >
                <PreviewIcon />
              </div>
              <div onClick={(e) => e.stopPropagation()}>
                <DialogBox
                  isOpen={isDialogOpen}
                  onClose={handleCloseDialog}
                  title="Invoice Template Preview"
                  InvoiceTemplatePreview={true}
                  invoiceData={invoiceData}
                  selectedTemplateId={selectedTemplateId}
                />
              </div>
              <div className="template-name">
                {selectable ? (
                  <span>{invoiceTemplate.name}</span>
                ) : (
                  <span style={{ fontSize: "12px" }}>
                    Template Id: {invoiceTemplate.id}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InvoiceTemplates;
