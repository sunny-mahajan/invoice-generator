import { useState, useRef, useEffect } from "react";
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
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSession } from "next-auth/react";
import { collection, query, getDocs } from "firebase/firestore";
import { db } from "../../firebaseConfig";

export default function UploadCSV() {
  const [invoices, setInvoices] = useState([]);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isInvoceTrue, setIsInvoceTrue] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [templateData, setTemplateData] = useState(null);
  const [templateIds, setTemplateIds] = useState([]);
  const [isTemplateSelectable, setIsTemplateSelectable] = useState(true);

  const fileInputRef = useRef(null); // Create a reference for the file input
  const { data: session } = useSession();

  useEffect(() => {
    getTemplatesID();
  }, []);

  useEffect(() => {
    if (templateData) {
      processInvoices(templateData);
    }
  }, [selectedTemplateId]);

  const getTemplatesID = async () => {
    const q = query(collection(db, "invoiceTemplates"));
    const querySnapshot = await getDocs(q);
    const templateIds = querySnapshot.docs.map((doc) => doc.data().id);
    setTemplateIds(templateIds);
  };

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
      const amount = row["Item Quantity"] * row["Item Price"];
      const taxAmount = amount * (row["Item Tax Percentage"] / 100);
      const item = {
        name: row["Item Name"],
        description: row["Item Description"],
        quantity: row["Item Quantity"],
        price: row["Item Price"],
        amount: amount, // Use the calculated amount
        taxAmount: taxAmount, // Use the calculated taxAmount
        taxPercentage: row["Item Tax Percentage"],
        total: amount + taxAmount, // Now the total can reference amount and taxAmount
      };
      if (invoiceNo && invoiceNo !== lastInvoiceNo) {
        // New invoice detected
        invoicesMap.set(invoiceNo, {
          "Invoice No.": invoiceNo,
          "Template Id": selectedTemplateId || "TPL001",
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
          "Sender's Tax Type": row["Sender's Tax Type"],
          "Sender's Tax No": row["Sender's Tax No"],
          "Receiver's Name": row["Receiver's Name"],
          "Receiver's Address": row["Receiver's Address"],
          "Receiver's City": row["Receiver's City"],
          "Receiver's State": row["Receiver's State"],
          "Receiver's Country": row["Receiver's Country"],
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
  };

  const handleSelectTemplate = (templateId) => {
    setSelectedTemplateId(templateId);
  };

  const handleTemplateSelection = () => {
    if (templateIds.length === 0) {
      toast.error("No templates available to assign");
      return;
    }
    if (invoices.length === 0) {
      toast.error("No invoices available to assign");
      return;
    }
    setIsTemplateSelectable(false);
    // Create a new invoices array with random template IDs assigned
    const updatedInvoices = invoices.map((invoice) => {
      // Get a random index from the templateIds array
      const randomIndex = Math.floor(Math.random() * templateIds.length);
      // Assign a random template ID to each invoice
      return {
        ...invoice,
        "Template Id": templateIds[randomIndex], // Assign random template ID
      };
    });

    // Update the state with the new invoices array
    setInvoices(updatedInvoices);

    toast.success("Template IDs assigned randomly to invoices");
  };

  const handleDownloadZip = async () => {
    setLoading(true); // Start loading

    const zip = new JSZip();
    for (const invoice of invoices) {
      const pdfBlob = await generateHTMLPDF(invoice, session.user);
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
          setTemplateData(data);
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
        <div className="flex flex-col items-center mb-5 md:mb-0">
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="cursor-pointer flex items-center justify-center w-full max-w-[400px] h-[135px] transition duration-200 min-w-[400px]"
          >
            <div
              onClick={() => fileInputRef.current.click()}
              className="file-upload-container flex flex-col items-center justify-center w-full h-full cursor-pointer border-2 border-dashed rounded-xl"
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

          {invoices.length > 0 && isInvoceTrue && (
            <div className="mt-0 md:mt-6">
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
          <div>
            <CustomButton
              type="purple"
              onClick={handleTemplateSelection}
              buttonStyle={{ minWidth: "170px" }}
            >
              select template randomly
            </CustomButton>
          </div>
          <div className="ml-4">
            <CustomButton
              type="purple"
              onClick={handleDownloadCSV}
              buttonStyle={{ minWidth: "170px" }}
            >
              Get Sample CSV
            </CustomButton>
          </div>
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
        <InvoiceTemplates
          handleSelectTemplates={handleSelectTemplate}
          selectable={isTemplateSelectable}
        />
        <ToastContainer />
      </div>
    </Layout>
  );
}
