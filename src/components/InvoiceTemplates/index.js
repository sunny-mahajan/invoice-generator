import React, { useState, useEffect } from "react";

const InvoiceTemplates = ({
  handleSelectTemplates = () => {},
  selectable = false,
}) => {
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);
  const [invoiceTemplates, setTemplates] = useState([]);
  const [visibleIndex, setVisibleIndex] = useState(0);
  const templatesToShow = 5; // Number of templates to show at once

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

  const nextTemplates = () => {
    if (visibleIndex + templatesToShow < invoiceTemplates.length) {
      setVisibleIndex((prev) => prev + 1);
    }
  };

  const prevTemplates = () => {
    if (visibleIndex > 0) {
      setVisibleIndex((prev) => prev - 1);
    }
  };

  const styles = {
    title: {
      padding: "20px 0px",
    },
    "template-preview-image": {
      height: "200px", // Set fixed height
      width: "100%", // Set width to fill the container
    },
  };

  return (
    <div>
      <h2 style={styles.title}>
        {selectable ? "Select Template" : "Templates"}
      </h2>

      <div className="flex items-center">
        <button
          onClick={prevTemplates}
          disabled={visibleIndex === 0}
          className="mr-2 p-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
        >
          &lt;
        </button>

        <div className="overflow-x-auto flex space-x-4 pb-4 w-100">
          {invoiceTemplates
            .slice(visibleIndex, visibleIndex + templatesToShow)
            .map((invoiceTemplate) => (
              <div
                key={invoiceTemplate.id}
                className="template-tile w-1/4 p-2 flex items-center flex-col cursor-pointer"
                onClick={() => selectTemplate(invoiceTemplate.id)}
              >
                <div
                  className={`template-content flex items-center flex-col ${
                    selectedTemplateId === invoiceTemplate.id && selectable
                      ? "selected-invoice-template"
                      : ""
                  }`}
                >
                  <div className="template-preview-image-container w-full h-48 overflow-hidden">
                    <img
                      className="template-preview-image object-cover h-full w-full"
                      src={invoiceTemplate.previewUrl}
                      alt={invoiceTemplate.name}
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

        <button
          onClick={nextTemplates}
          disabled={visibleIndex + templatesToShow >= invoiceTemplates.length}
          className="ml-2 p-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default InvoiceTemplates;
