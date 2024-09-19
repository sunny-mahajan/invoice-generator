import { useState } from "react";
import { generateHTMLPDF } from "../utils/generateHTMLPDF";
import Papa from "papaparse";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import ProtectedPage from './protected';
import Layout from '../components/Layout';
import CustomButton from "../components/Button";
import "./style.css";

export default function UploadCSV() {
  const [invoices, setInvoices] = useState([]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];

    if (file) {
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
        "Item name": row["Item name"],
        "Item quantity": row["Item quantity"],
        "Item price": row["Item price"],
      };

      // new invoice no
      if (invoiceNo != lastInvoiceNo && invoiceNo.trim() != "") {
        invoicesMap.set(invoiceNo, {
          "Invoice No.": invoiceNo,
          "Template Id": row['Template Id'],
          "Invoice Issue Date": row["Invoice Issue Date"],
          "Invoice Due Date": row["Invoice Due Date"],
          "Sender's Company Name": row["Sender's Company Name"],
          "Sender's Name": row["Sender's Name"],
          "Sender's Address": row["Sender's Address"],
          "Sender's City": row["Sender's City"],
          "Sender's State": row["Sender's State"],
          "Sender's Zipcode": row["Sender's Zipcode"],
          "Sender's Contact No": row["Sender's Contact No"],
          "Sender's Email": row["Sender's Email"],
          "Sender's Bank": row["Sender's Bank"],
          "Sender's Account no": row["Sender's Account no"],
          "Receiver's Company Name": row["Receiver's Company Name"],
          "Receiver's Name": row["Receiver's Name"],
          "Receiver's Address": row["Receiver's Address"],
          "Receiver's City": row["Receiver's City"],
          "Receiver's State": row["Receiver's State"],
          "Receiver's Zipcode": row["Receiver's Zipcode"],
          "Receiver's Contact No": row["Receiver's Contact No"],
          "Receiver's email": row["Receiver's email"],
          Remarks: row["Remarks"],
          Items: [item],
        });
      } else {
        // previous invoice no
        invoicesMap.get(lastInvoiceNo).Items.push(item);
      }
      if (invoiceNo.trim() != "") {
        lastInvoiceNo = invoiceNo;
      }
    });

    // Convert the Map to an array
    const invoicesArray = Array.from(invoicesMap.values());
    setInvoices(invoicesArray);
  };

  const handleDownloadZip = async () => {

    const zip = new JSZip();
    for (const invoice of invoices) {
      // const pdfBlob = generatePDF(invoice);
      const pdfBlob = await generateHTMLPDF(invoice);
      console.log(`pdfBlob: `, pdfBlob);
      zip.file(`invoice_${invoice["Invoice No."]}.pdf`, pdfBlob);
    }

    zip.generateAsync({ type: "blob" }).then((content) => {
      saveAs(content, "invoices.zip");
    });
  };

  const handleDownloadCSV = () => {
    const link = document.createElement('a');
    link.href = 'assets/docs/sample.csv'; // Path to the sample CSV file
    link.setAttribute('download', 'sample.csv'); // Name of the downloaded file
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <ProtectedPage>
      <Layout>
        <div className="container mx-auto p-4 upload-container-cls">
          <div>
            <h1 className="text-2xl font-bold mb-4">Upload CSV File</h1>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="mb-4"
            />
            {invoices.length > 0 && (
              <pre className="bg-gray-100 p-4 rounded">
                {JSON.stringify(invoices, null, 2)}
              </pre>
            ) && (
              <button
                onClick={handleDownloadZip}
                className="bg-blue-500 text-white p-2 rounded"
              >
                Download Invoices as ZIP
              </button>
            )}
          </div>
          <div>
            <CustomButton type="purple" onClick={handleDownloadCSV}  buttonStyle={{ minWidth: "250px" }} isLoading={false}> Download Sample CSV File</CustomButton>
          </div>
        </div>
      </Layout>
    </ProtectedPage>
  );
}

