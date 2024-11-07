import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const InvoiceTemplates = ({
  handleSelectTemplates = () => {},
  selectable = false,
  handleTemplateSelection = () => {},
  isShowRandomSelection = false,
}) => {
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);
  const [invoiceTemplates, setTemplates] = useState([]);

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

  const settings = {
    dots: true,
    infinite: false,
    speed: 300,
    slidesToShow: 4,
    slidesToScroll: 4,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

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
              <div className="random-temp-cls relative w-12 h-7 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[3.5px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              <span className="ml-3">Use Random Template</span>
            </label>
          </div>
        )}
      </div>

      <Slider {...settings}>
        {invoiceTemplates.map((invoiceTemplate) => (
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
                  className="template-preview-image h-full w-full"
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
      </Slider>
    </div>
  );
};

export default InvoiceTemplates;
