import React, { useState, useEffect } from 'react';

const InvoiceTemplates = ({ handleSelectTemplates = null, selectable = false }) => {
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);
  const [invoiceTemplates, setTemplates] = useState([]);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    const res = await fetch(
      `http://localhost:${process.env.NEXT_PUBLIC_PORT}/api/templates`
    );
    const templates = await res.json();
    setTemplates(templates);
  };

  const selectTemplate = (templateId) => {
    if(selectable) {
        setSelectedTemplateId(templateId);
        handleSelectTemplates(templateId);
    }
  };

  const styles = {
    title: {
      padding: '35px 0px',
    },
    'template-preview-image': {
      maxHeight: '300px',
    },
  };

  return (
    <div>
      <h2 style={styles.title}>{selectable ? 'Select Template' : 'Templates'}</h2>

      <div className="templates-container flex flex-wrap">
        {invoiceTemplates.map((invoiceTemplate) => (
          <div
            key={invoiceTemplate.id}
            className="template-tile w-1/3 p-2 flex items-center flex-col"
          >
            <div
              className={`template-content flex items-center flex-col ${
                selectedTemplateId === invoiceTemplate.id
                  ? 'selected-invoice-template'
                  : ''
              }`}
              onClick={() => selectTemplate(invoiceTemplate.id)}
            >
              <div className="template-preview-image-container">
                <img
                  className="template-preview-image"
                  src={invoiceTemplate.previewUrl}
                  style={styles['template-preview-image']}
                  alt={invoiceTemplate.name}
                />
              </div>
              <div className="template-name">
                { selectable && (
                 <span>{invoiceTemplate.name}</span>
                )}
                { !selectable && (
                <span>Template Id:{invoiceTemplate.id}</span>
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
