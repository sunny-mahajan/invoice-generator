import { useState, useEffect } from "react";
import generateHTMLTPL001 from "../../templates/HTMLTPL001";
import {
  mapBankDetails,
  mapReceiverDetails,
  mapSenderDetails,
} from "../../utils/helpers";
import generateHTMLTPL002 from "../../templates/HTMLTPL002";
import generateHTMLTPL003 from "../../templates/HTMLTPL003";
import generateHTMLTPL004 from "../../templates/HTMLTPL004";
import generateHTMLTPL005 from "../../templates/HTMLTPL005";
import generateHTMLTPL006 from "../../templates/HTMLTPL006";
import generateHTMLTPL007 from "../../templates/HTMLTPL007";
import generateHTMLTPL008 from "../../templates/HTMLTPL008";
import generateHTMLTPL009 from "../../templates/HTMLTPL009";
import generateHTMLTPL0010 from "../../templates/HTMLTPL0010";

export default function InvoicePreview({
  formData = {},
  data = {},
  selectedTemplateId = "TPL001",
  InvoiceTemplatePreview = false,
  previewUrl = "",
  isDialogOpen = false,
}) {
  const [previewHtml, setPreviewHtml] = useState("");

  const debounce = (func, delay) => {
    let timeout;
    return () => {
      clearTimeout(timeout);
      timeout = setTimeout(func, delay);
    };
  };

  const mergeData = (formData, data) => {
    for (const key in data) {
      if (
        data[key] &&
        typeof data[key] === "object" &&
        !Array.isArray(data[key])
      ) {
        // If the key is an object, recurse
        formData[key] = mergeData(formData[key] || {}, data[key]);
      } else if (data[key] !== "") {
        // Only overwrite if the value is not empty
        formData[key] = data[key];
      }
    }
    return formData;
  };

  const handleData = (formData, data, generatePreview) => {
    mergeData(formData, data);
    const mappedData = {
      "Invoice No.": formData.invoiceNo,
      "Template Id": selectedTemplateId,
      "Invoice Issue Date": formData.createdAt,
      "Invoice Due Date": formData.dueDate,
      Logo: formData.logo,
      ...mapSenderDetails(formData.senderDetails),
      ...mapReceiverDetails(formData.clientDetails),
      ...mapBankDetails(formData.bankDetails),
      newFields: formData.newFields,
      "Sender Custom Fields": formData.senderDetails.customFields,
      "Client Custom Fields": formData.clientDetails.customFields,
      Items: formData.items,
      Currency: formData.currency,
      "Tax Percentage": formData.taxPercentage,
    };
    generatePreview(mappedData);
  };

  // Function to generate the invoice preview
  const generatePreview = (invoiceData) => {
    const htmlString =
      selectedTemplateId === "TPL001"
        ? generateHTMLTPL001(invoiceData)
        : selectedTemplateId === "TPL002"
        ? generateHTMLTPL002(invoiceData)
        : selectedTemplateId === "TPL003"
        ? generateHTMLTPL003(invoiceData)
        : selectedTemplateId === "TPL004"
        ? generateHTMLTPL004(invoiceData)
        : selectedTemplateId === "TPL005"
        ? generateHTMLTPL005(invoiceData)
        : selectedTemplateId === "TPL006"
        ? generateHTMLTPL006(invoiceData)
        : selectedTemplateId === "TPL007"
        ? generateHTMLTPL007(invoiceData)
        : selectedTemplateId === "TPL008"
        ? generateHTMLTPL008(invoiceData)
        : selectedTemplateId === "TPL009"
        ? generateHTMLTPL009(invoiceData)
        : selectedTemplateId === "TPL010" && generateHTMLTPL0010(invoiceData);

    setPreviewHtml(htmlString);
  };

  const adjustZoom = () => {
    const pdfContainer = document.querySelector(".invoice-preview-cls");
    const mainContainer = document.querySelector(".preview-container-cls");

    if (!pdfContainer || !mainContainer) return;

    const screenWidth = mainContainer.clientWidth;
    console.log(screenWidth, "screenWidth");
    let zoomFactor = 1;

    if (screenWidth <= 600) {
      zoomFactor = 0.6;
    } else if (screenWidth <= 768) {
      zoomFactor = 0.7;
    } else if (screenWidth <= 1024) {
      zoomFactor = 0.4;
    } else {
      zoomFactor = 0.5;
    }

    pdfContainer.style.zoom = zoomFactor;
  };

  useEffect(() => {
    adjustZoom();
    const handleResize = debounce(adjustZoom, 100);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [previewHtml, isDialogOpen]);

  useEffect(() => {
    if (!InvoiceTemplatePreview) {
      handleData(formData, data, generatePreview);
    }
  }, [formData, selectedTemplateId, data]);

  return (
    <div className="invoice-preview-container mb-5">
      {!InvoiceTemplatePreview ? (
        <div className="w-full h-full">
          <h2
            style={{
              padding: "25px 0 20px",
              color: "var(--color)",
            }}
          >
            Invoice Preview
          </h2>
          <div
            dangerouslySetInnerHTML={{ __html: previewHtml }}
            className="invoice-preview-cls"
            style={{
              border: "1px solid #ddd",
              padding: "20px",
              background: "#fff",
              color: "#000",
            }}
          />
        </div>
      ) : (
        <img
          className="template-preview-image h-full w-full"
          src={previewUrl}
          alt="Invoice Preview"
        />
      )}
    </div>
  );
}
