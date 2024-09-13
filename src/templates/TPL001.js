import jsPDF from 'jspdf';

export default function generateTPL001(invoiceData) {
  const doc = new jsPDF();

  // Invoice Heading
  doc.setFontSize(60);
  doc.setTextColor("#FD7037");
  doc.text("INVOICE", 105, 20, null, null, "center");

  // Sender's Company name
  doc.setTextColor("#181515");
  doc.setFontSize(20);
  doc.text(invoiceData["Sender's Company Name"], 105, 50, null, null, "center");

  // Invoice details
  doc.text(`Invoice No.: ${invoiceData["Invoice No."]}`, 30, 100);
  doc.text(`Issue Date: ${invoiceData["Invoice Issue Date"]}`, 30, 120);
  doc.text(`Due Date: ${invoiceData["Invoice Due Date"]}`, 30, 130);
  // Receiver details
  doc.text(`Billed To:`, 150, 40);
  doc.text(invoiceData["Receiver's Name"], 150, 50);
  doc.text(invoiceData["Receiver's Address"], 150, 60);
  doc.text(
    `${invoiceData["Receiver's City"]}, ${invoiceData["Receiver's State"]} ${invoiceData["Receiver's Zipcode"]}`,
    150,
    70
  );

  // Items
  doc.text("Items", 20, 80);
  invoiceData.Items.forEach((item, index) => {
    doc.text(
      `${item["Item name"]} - ${item["Item quantity"]} x $${item["Item price"]}`,
      20,
      90 + index * 10
    );
  });

  // Total
  const total = invoiceData.Items.reduce(
    (sum, item) => sum + item["Item quantity"] * item["Item price"],
    0
  );
  doc.text(`Total: $${total}`, 150, 80 + invoiceData.Items.length * 10);
  return doc.output("blob");
}
