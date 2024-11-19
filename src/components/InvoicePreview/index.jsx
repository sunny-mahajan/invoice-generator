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
import generateHTMLTPL008 from "../../templates/HTMLTPL008";

export default function InvoicePreview({
  formData = {},
  data = {},
  selectedTemplateId,
  InvoiceTemplatePreview = false,
  invoiceData = {},
}) {
  const [previewHtml, setPreviewHtml] = useState("");

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
        : generateHTMLTPL008(invoiceData);

    setPreviewHtml(htmlString);
  };

  useEffect(() => {
    if (!InvoiceTemplatePreview) {
      handleData(formData, data, generatePreview);
    }
  }, [formData, selectedTemplateId, data]);
  useEffect(() => {
    if (InvoiceTemplatePreview) {
      generatePreview(invoiceData);
    }
  }, [InvoiceTemplatePreview, invoiceData]);

  return (
    <div className="invoice-preview-container mb-5">
      {!InvoiceTemplatePreview && (
        <h2
          style={{
            padding: "25px 0 20px",
            color: "var(--color)",
          }}
        >
          Invoice Preview
        </h2>
      )}
      <div
        dangerouslySetInnerHTML={{ __html: previewHtml }}
        style={{
          border: "1px solid #ddd",
          padding: "20px",
          background: "#fff",
          color: "#000",
        }}
      ></div>
    </div>
  );
}
