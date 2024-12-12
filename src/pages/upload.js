import { useState, useRef, useEffect } from "react";
import { generateHTMLPDF } from "../utils/generateHTMLPDF";
import Papa from "papaparse";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import Layout from "../components/Layout";
import CustomButton from "../components/Button";
import "./style.css";
import InvoiceTemplates from "../components/InvoiceTemplates";
import { DropImageIcon } from "../utils/icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { collection, query, getDocs } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { previewInvoiceData } from "../utils/constants";
import { useUser } from "../app/context/userContext";
import DialogBox from "../components/DialogBox";
import { useForm } from "react-hook-form";

export default function UploadCSV() {
  const [invoices, setInvoices] = useState([]);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [isInvoceTrue, setIsInvoceTrue] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [templateData, setTemplateData] = useState(null);
  const [templateIds, setTemplateIds] = useState([]);
  const [isTemplateSelectable, setIsTemplateSelectable] = useState(true);
  const [isRandomSelectionChecked, setIsRandomSelectionChecked] =
    useState(false);
  const [isTemplateIdUpdated, setIsTemplateIdUpdated] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDownloadPdf, setIsDownloadPdf] = useState(false);
  const fileInputRef = useRef(null); // Create a reference for the file input
  const { userData } = useUser();

  const {
    register,
    formState: { errors },
    trigger,
    getValues,
  } = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
  });

  useEffect(() => {
    getTemplatesID();
  }, []);

  useEffect(() => {
    if (templateData) {
      processInvoices(templateData);
    }
  }, [selectedTemplateId]);

  useEffect(() => {
    if (isRandomSelectionChecked && isTemplateIdUpdated) {
      assignTemplateToInvoices(() => {
        const randomIndex = Math.floor(Math.random() * templateIds.length);
        return templateIds[randomIndex];
      });
      setIsTemplateIdUpdated(false);
    }
  }, [invoices, isRandomSelectionChecked]);

  const getTemplatesID = async () => {
    const q = query(collection(db, "invoiceTemplates"));
    const querySnapshot = await getDocs(q);
    const templateIds = querySnapshot.docs.map((doc) => doc.data().id);
    setTemplateIds(templateIds);
  };

  const handleFileUpload = (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    if (!file) return; // If no file is selected, return early
    // Define the maximum file size (10MB)
    const maxSize = 10 * 1024 * 1024;

    // Check if the file size exceeds the limit
    if (file.size > maxSize) {
      toast.error(
        "File size exceeds the 10MB limit. Please upload a smaller file."
      );
      return;
    }
    // Check if the file is a CSV by verifying the MIME type
    const allowedTypes = ["text/csv"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Invalid file type. Please upload a CSV file.");
      return;
    }

    if (file) {
      setSelectedFileName(file.name);
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          const data = result.data;
          setTemplateData(data);
          processInvoices(data);
        },
      });
    }
  };

  const processInvoices = (data) => {
    const invoicesMap = new Map();
    let lastInvoiceNo = "";
    let hasMissingInvoiceNo = false;
    let hasValidInvoices = true; // This will track overall validity

    const addInvoiceItem = (invoiceNo, item) => {
      if (invoicesMap.has(invoiceNo)) {
        invoicesMap.get(invoiceNo).Items.push(item);
      }
    };

    const handleMissingInvoiceNo = (index) => {
      if (!hasMissingInvoiceNo) {
        toast.error(`Error in row ${index + 1}: Missing invoice number`);
        setIsInvoceTrue(false);
        hasMissingInvoiceNo = true;
      }
    };

    const validateFields = (fields, rowIndex, fieldNames) => {
      const missingFields = fieldNames.filter(
        (field) => !fields[field] || fields[field].trim() === ""
      );
      if (missingFields.length > 0) {
        toast.error(
          `Error in row ${rowIndex + 1}: Missing ${missingFields.join(", ")}`
        );
        return false;
      }
      return true;
    };

    const validateItem = (item, rowIndex) => {
      return validateFields(item, rowIndex, [
        "name",
        "description",
        "quantity",
        "price",
      ]);
    };

    data.forEach((row, index) => {
      const invoiceNo = row["Invoice No."].trim();
      let total = (row["Item Quantity"] * row["Item Price"]).toFixed(2);
      let taxAmount = 0;
      let subTotal = (row["Item Quantity"] * row["Item Price"]).toFixed(2);
      let amountSaved = 0;
      let afterDiscount = 0;
      if (row["Item Discount Percentage"] > 0) {
        amountSaved = (
          row["Item Quantity"] *
          row["Item Price"] *
          (row["Item Discount Percentage"] / 100)
        ).toFixed(2);
        afterDiscount = (
          row["Item Quantity"] * row["Item Price"] -
          amountSaved
        ).toFixed(2);
        total = (
          row["Item Quantity"] * row["Item Price"] -
          amountSaved
        ).toFixed(2);
      }
      // If taxPercentage is greater than 0, add the tax to the total
      if (row["Item Tax Percentage"] > 0) {
        taxAmount = (
          amountSaved
            ? afterDiscount * (row["Item Tax Percentage"] / 100)
            : row["Item Quantity"] *
              row["Item Price"] *
              (row["Item Tax Percentage"] / 100)
        ).toFixed(2);
        afterDiscount = (
          row["Item Quantity"] * row["Item Price"] -
          amountSaved
        ).toFixed(2);
        total = (parseFloat(total) + parseFloat(taxAmount)).toFixed(2);
      }
      const item = {
        name: row["Item Name"],
        description: row["Item Description"],
        quantity: row["Item Quantity"],
        price: row["Item Price"],
        discountPercentage: row["Item Discount Percentage"],
        taxPercentage: row["Item Tax Percentage"],
        amountSaved: amountSaved, // Use the calculated amount
        afterDiscount: afterDiscount, // Use the calculated taxAmount
        taxAmount: taxAmount,
        amount: subTotal,
        total: total, // Now the total can reference amount and taxAmount
      };
      if (invoiceNo && invoiceNo !== lastInvoiceNo) {
        // New invoice detected
        invoicesMap.set(invoiceNo, {
          "Invoice No.": invoiceNo,
          "Template Id": selectedTemplateId || templateIds[0],
          "Invoice Issue Date": row["Invoice Issue Date"],
          "Invoice Due Date": row["Invoice Due Date"],
          "Sender's Name": row["Sender's Name"],
          "Sender's Address": row["Sender's Address"],
          "Sender's City": row["Sender's City"],
          "Sender's State": row["Sender's State"],
          "Sender's PAN No": row["Sender's PAN No"],
          "Sender's Zipcode": row["Sender's Zipcode"],
          "Sender's Contact No": row["Sender's Contact No"],
          "Sender's Email": row["Sender's Email"],
          "Sender's Tax Type": row["Sender's Tax Type"],
          "Sender's Tax No": row["Sender's Tax No"],
          "Receiver's Name": row["Receiver's Name"],
          "Receiver's Address": row["Receiver's Address"],
          "Receiver's City": row["Receiver's City"],
          "Receiver's State": row["Receiver's State"],
          "Receiver's PAN No": row["Receiver's PAN No"],
          "Receiver's Zipcode": row["Receiver's Zipcode"],
          "Receiver's Contact No": row["Receiver's Contact No"],
          "Receiver's Email": row["Receiver's Email"],
          "Receiver's Tax Type": row["Receiver's Tax Type"],
          "Receiver's Tax No": row["Receiver's Tax No"],
          "Bank Name": row["Bank Name"],
          "Account No": row["Account No"],
          "Account Holder Name": row["Account Holder Name"],
          "IFSC Code": row["IFSC Code"],
          "Account Type": row["Account Type"],
          "Bank Address": row["Bank Address"],
          "Paid Amount": row["Paid Amount"],
          Logo: row["Logo Url"],
          Remarks: row["Remarks"],
          Currency: row["Currency"],
          Items: [item],
        });
        lastInvoiceNo = invoiceNo;
      } else if (!invoiceNo) {
        // if (selectedTemplateId) {
        //   handleMissingInvoiceNo(index);
        // }
        addInvoiceItem(lastInvoiceNo, item);
      } else {
        addInvoiceItem(lastInvoiceNo, item);
      }
    });

    // Convert the Map to an array and validate all invoices and items
    const invoicesArray = Array.from(invoicesMap.values());

    invoicesArray.forEach((invoice) => {
      const itemData = handleItemCalculatation(invoice);
      invoice.itemData = itemData;
      const itemsValid = invoice.Items.every((item, itemIndex) =>
        validateItem(item, itemIndex)
      );

      // Check both invoice number and item validity
      if (!invoice["Invoice No."] || !itemsValid) {
        hasValidInvoices = false;
        setIsInvoceTrue(false);
      }
    });

    // If everything is valid, set the state to true
    if (hasValidInvoices && !hasMissingInvoiceNo) {
      setIsInvoceTrue(true);
    }
    setInvoices(invoicesArray);
    setIsTemplateIdUpdated(true);
  };

  const handleSelectTemplate = (templateId) => {
    setSelectedTemplateId(templateId);
  };

  const handleItemCalculatation = (formData) => {
    let subTotal = 0;
    let total = 0;
    let taxAmount = 0;
    let taxPercentages = 0;
    let discountMoney = 0;
    let afterDiscountAmount = 0;
    const items = formData?.Items;
    const advancedAmount = formData?.advancedAmount;
    items?.forEach((item) => {
      if (!item.quantity || !item.price) return;
      subTotal += +item.amount;
      total += +item.total;
      discountMoney += +item.amountSaved;
      taxAmount += +item.taxAmount;
      afterDiscountAmount += +item.afterDiscount;
    });
    taxPercentages =
      (taxAmount / (afterDiscountAmount ? afterDiscountAmount : subTotal)) *
      100;

    if (advancedAmount && total > 0) {
      total -= advancedAmount;
    }
    const itemData = {
      subTotal: subTotal.toFixed(2),
      total: total.toFixed(2),
      taxAmount: taxAmount.toFixed(2),
      taxPercentage: taxPercentages.toFixed(2),
      discount: discountMoney.toFixed(2),
      afterDiscountAmount: afterDiscountAmount.toFixed(2),
    };

    return itemData;
  };

  const assignTemplateToInvoices = (templateIdGenerator) => {
    // Create a new invoices array with template IDs assigned based on the generator function
    const updatedInvoices = invoices.map((invoice) => ({
      ...invoice,
      "Template Id": templateIdGenerator(), // Assign template ID
    }));

    // Update the state with the new invoices array
    setInvoices(updatedInvoices);
  };

  const handleTemplateSelection = (event) => {
    const isChecked = event.target.checked;
    setIsRandomSelectionChecked(isChecked);
    if (templateIds.length === 0) {
      toast.error("No templates available to assign");
      return;
    }

    if (!isChecked) {
      // Assign the first template ID to all invoices when toggle is off
      assignTemplateToInvoices(() => templateIds[0]);
      setIsTemplateSelectable(true);
    } else {
      setIsTemplateSelectable(false);
    }
  };

  const handleDialogBox = async () => {
    setIsDownloadPdf(true);
  };

  const handleCloseDialog = () => setIsDownloadPdf(false);

  const handleDownloadZip = async () => {
    const data = getValues();
    const isValid = await trigger();
    console.log("valid", isValid);
    console.log("data", data);

    if (!isValid) {
      return;
    }

    setLoading(true); // Start loading

    try {
      const response = await generateHTMLPDF(
        invoices,
        userData,
        data.userEmail
      );
      console.log("Zip file generated successfully", response);
    } catch (error) {
      console.error("Error generating Zip file:", error);
      alert(`An error occurred: ${error.message}`);
    } finally {
      setLoading(false); // Stop loading in both success and error cases
    }
  };

  const handleDeselectFile = (event) => {
    event.stopPropagation(); // Prevent the file input from opening
    setSelectedFileName("");
    setInvoices([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset the file input
    }
  };

  const handleDownloadCSV = (event) => {
    event.stopPropagation();
    const link = document.createElement("a");
    link.href = "assets/docs/sample.csv"; // Path to the sample CSV file
    link.setAttribute("download", "sample.csv"); // Name of the downloaded file
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (!droppedFile) return; // If no droppedFile is selected, return early
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (droppedFile.size > maxSize) {
      toast.error(
        "File size exceeds the 10MB limit. Please upload a smaller file."
      );
      return;
    }
    // Check if the file is a CSV by verifying the MIME type
    const allowedTypes = ["text/csv"];
    if (!allowedTypes.includes(droppedFile.type)) {
      toast.error("Invalid file type. Please upload a CSV file.");
      return;
    }
    if (droppedFile) {
      setSelectedFileName(droppedFile.name);
      Papa.parse(droppedFile, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          const data = result.data;
          setTemplateData(data);
          processInvoices(data);
        },
      });
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <Layout>
      <div className="container mx-auto pt-8 px-0 upload-container-cls">
        <div className="flex md:flex-row flex-col items-center mb-5 md:mb-0 p-4 gap-10">
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="flex items-center justify-center w-[60%] h-[200px] transition duration-200 min-w-[280px] flex-1"
          >
            <div
              onClick={() => fileInputRef.current.click()}
              className="file-upload-container flex flex-col items-center justify-center w-full h-full border-2 border-dashed rounded-xl cursor-pointer py-4"
            >
              <DropImageIcon />
              {selectedFileName ? (
                <span className="font-semibold mt-2">{selectedFileName}</span>
              ) : (
                <div className="text-center mt-2">
                  <div>
                    <span className="cursor-pointer font-semibold underline">
                      <a>Click to upload</a>
                    </span>
                    <span> or drag and drop</span>
                  </div>
                  <div className="mt-1">
                    <span className="mt-2">
                      Maximum file size: 10MB. (Only .csv files are accepted)
                    </span>
                  </div>
                  <div className="flex items-center justify-center mt-4">
                    <span className="cursor-pointer font-semibold underline">
                      <a onClick={handleDownloadCSV}>Download sample file</a>
                    </span>
                  </div>
                </div>
              )}
              {selectedFileName && (
                <button
                  type="button"
                  onClick={handleDeselectFile}
                  className="text-red-500 mt-2 text-[12px]"
                >
                  ✖ Remove
                </button>
              )}
            </div>
            <input
              ref={fileInputRef} // Assign ref to the file input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
          <div className="instruction-container w-full md:[width:40%]">
            <h2 className="text-lg font-semibold mb-2">Instructions</h2>
            <ol className="list-decimal list-inside space-y-1">
              <li>Download the sample CSV file to see the correct format.</li>
              <li>
                Select an invoice template from the list or use a random
                template.
              </li>
              <li>Fill in your data following the sample CSV format.</li>
              <li>Upload your CSV file.</li>
              <li>Click Generate Invoices as ZIP to download your invoices.</li>
            </ol>
          </div>
        </div>
      </div>
      <div className="p-4 mx-auto w-full">
        <InvoiceTemplates
          handleSelectTemplates={handleSelectTemplate}
          selectable={isTemplateSelectable}
          handleTemplateSelection={handleTemplateSelection}
          isShowRandomSelection={true}
          invoiceData={previewInvoiceData}
          isRandomSelectionChecked={isRandomSelectionChecked}
          setIsDialogOpen={setIsDialogOpen}
          isDialogOpen={isDialogOpen}
        />
        <ToastContainer />
      </div>
      <div onClick={(e) => e.stopPropagation()}>
        <DialogBox
          isOpen={isDownloadPdf}
          onClose={handleCloseDialog}
          onConfirm={handleDownloadZip}
          title="Enter your email to receive the invoice"
          confirmText="Send Invoice"
          cancelText="cancel"
          errors={errors}
          register={register}
          isLoading={loading}
        />
      </div>
      {invoices.length > 0 && isInvoceTrue && (
        <div className="mt-0 md:mb-6 px-4">
          <CustomButton
            type="purple"
            // onClick={handleDownloadZip}
            onClick={handleDialogBox}
            buttonStyle={{ marginTop: "1rem", minWidth: "250px" }}
          >
            {loading ? "Generating ZIP..." : "Generate Invoices as ZIP"}
          </CustomButton>
        </div>
      )}
    </Layout>
  );
}
