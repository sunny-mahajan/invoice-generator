import { useState, useRef } from "react";
import { generateHTMLPDF } from "../utils/generateHTMLPDF";
import Papa from "papaparse";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import Layout from "../components/Layout";
import CustomButton from "../components/Button";
import "./style.css";
import InvoiceTemplates from "../components/InvoiceTemplates";
import { DropImageIcon, infoIcon } from "../utils/icons";
import DialogBox from "../components/DialogBox/index";

export default function UploadCSV() {
  const [invoices, setInvoices] = useState([]);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fileInputRef = useRef(null); // Create a reference for the file input

  const handleFileUpload = (event) => {
    event.preventDefault();
    const file = event.target.files[0];

    if (file) {
      setSelectedFileName(file.name);
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          const data = result.data;
          processInvoices(data);
        },
      });
    }
  };

  const processInvoices = (data) => {
    const invoicesMap = new Map();
    let lastInvoiceNo = "";

    data.forEach((row) => {
      const invoiceNo = row["Invoice No."];
      const item = {
        name: row["Item Name"],
        description: row["Item Description"],
        quantity: row["Item Quantity"],
        price: row["Item Price"],
      };

      // New invoice no
      if (invoiceNo !== lastInvoiceNo && invoiceNo.trim() !== "") {
        invoicesMap.set(invoiceNo, {
          "Invoice No.": invoiceNo,
          "Template Id": row["Template Id"],
          "Invoice Issue Date": row["Invoice Issue Date"],
          "Invoice Due Date": row["Invoice Due Date"],
          "Sender's Name": row["Sender's Name"],
          "Sender's Address": row["Sender's Address"],
          "Sender's City": row["Sender's City"],
          "Sender's State": row["Sender's State"],
          "Sender's Country": row["Sender's Country"],
          "Sender's Zipcode": row["Sender's Zipcode"],
          "Sender's Contact No": row["Sender's Contact No"],
          "Sender's Email": row["Sender's Email"],
          "Sender's Bank": row["Sender's Bank"],
          "Sender's Account no": row["Sender's Account no"],
          "Sender's Account Holder Name": row["Sender's Account Holder Name"],
          "Sender's IFSC Code": row["Sender's IFSC Code"],
          "Sender's Account Type": row["Sender's Account Type"],
          "Tax Type": row["Sender's Tax Type"],
          "Tax percentage": row["Sender's Tax Percentage"],
          "Sender's GST": row["Sender's GST"],
          "Sender's PAN": row["Sender's PAN"],
          "Receiver's Name": row["Receiver's Name"],
          "Receiver's Address": row["Receiver's Address"],
          "Receiver's City": row["Receiver's City"],
          "Receiver's State": row["Receiver's State"],
          "Receiver's Country": row["Receiver's Country"],
          "Receiver's Zipcode": row["Receiver's Zipcode"],
          "Receiver's Contact No": row["Receiver's Contact No"],
          "Receiver's email": row["Receiver's Email"],
          "Receiver's Tax Type": row["Receiver's Tax Type"],
          "Receiver's Tax Percentage": row["Receiver's Tax Percentage"],
          "Receiver's GST": row["Receiver's GST"],
          "Receiver's PAN": row["Receiver's PAN"],
          Remarks: row["Remarks"],
          Currency: row["Currency"],
          Items: [item],
        });
      } else {
        // Previous invoice no
        invoicesMap.get(lastInvoiceNo).Items.push(item);
      }
      if (invoiceNo.trim() !== "") {
        lastInvoiceNo = invoiceNo;
      }
    });

    // Convert the Map to an array
    const invoicesArray = Array.from(invoicesMap.values());
    setInvoices(invoicesArray);
  };

  const handleDownloadZip = async () => {
    setLoading(true); // Start loading

    const zip = new JSZip();
    for (const invoice of invoices) {
      const pdfBlob = await generateHTMLPDF(invoice);
      zip.file(`invoice_${invoice["Invoice No."]}.pdf`, pdfBlob);
    }

    zip.generateAsync({ type: "blob" }).then((content) => {
      saveAs(content, "invoices.zip");
      setInvoices([]);
      setSelectedFileName("");
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Reset the file input
      }
      setLoading(false); // End loading
    });
  };

  const handleDeselectFile = (event) => {
    event.stopPropagation(); // Prevent the file input from opening
    setSelectedFileName("");
    setInvoices([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset the file input
    }
  };

  const handleDownloadCSV = () => {
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
    if (droppedFile) {
      setSelectedFileName(droppedFile.name);
      Papa.parse(droppedFile, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          const data = result.data;
          processInvoices(data);
        },
      });
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleOpenDialog = () => setIsDialogOpen(true);
  const handleCloseDialog = () => setIsDialogOpen(false);
  const handleConfirm = () => {
    setIsDialogOpen(false);
  };

  return (
      <Layout>
        <div className="container mx-auto p-4 px-0 upload-container-cls">
          <div className="flex flex-col items-center">
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="file-upload-container cursor-pointer flex items-center justify-center rounded-xl border-2 border-dashed border-white w-full max-w-[400px] h-[100px] bg-[#252945] hover:bg-[#1c1f32] transition duration-200 min-w-[300px]"
            >
              <div
                onClick={() => fileInputRef.current.click()}
                className="flex flex-col items-center justify-center w-full h-full cursor-pointer"
              >
                <DropImageIcon />
                <span className="text-white mt-2">
                  {selectedFileName
                    ? `Selected File: ${selectedFileName}`
                    : "Drop or Upload CSV file"}
                </span>
                {selectedFileName && (
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
                ref={fileInputRef} // Assign ref to the file input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            {invoices.length > 0 && (
              <div className="mt-6">
                <CustomButton
                  type="purple"
                  onClick={handleDownloadZip}
                  buttonStyle={{ marginTop: "1rem", minWidth: "250px" }}
                  isLoading={loading}
                >
                  {loading ? "Generating ZIP..." : "Generate Invoices as ZIP"}
                </CustomButton>
              </div>
            )}
          </div>
          <div className="flex items-center">
            <CustomButton
              type="purple"
              onClick={handleDownloadCSV}
              buttonStyle={{ minWidth: "170px" }}
            >
              Get Sample CSV
            </CustomButton>
            <div
              className="ml-4 cursor-pointer"
              onClick={() => handleOpenDialog()}
            >
              {infoIcon()}
            </div>
            <div>
              <DialogBox
                isOpen={isDialogOpen}
                onClose={handleCloseDialog}
                title="Instructions"
                content={`1. Download the sample CSV file for the correct format.\n2. Choose an invoice template from the list, and input the correct template ID in the CSV.\n3. Fill in your data following the sample format.\n4. Upload your CSV file.\n5. Click 'Generate Invoices as ZIP' to download your invoices.`}
                confirmText="Got it!"
                cancelText=""
                onConfirm={handleConfirm}
              />
            </div>
          </div>
        </div>
        <div className="p-4 mx-auto w-full">
          <InvoiceTemplates />
        </div>
      </Layout>
  );
}
