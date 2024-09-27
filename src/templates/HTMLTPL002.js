export default function generateHTMLTPL002(invoiceData) {
    console.log(invoiceData, "invoiceData");
  // Initialize the sub-amount
  let subAmount = 0;

  // Calculate the sub-amount by summing item prices
  invoiceData.Items.forEach((item) => {
    // Convert item price to a number
    subAmount += parseFloat(item["price"]) * parseFloat(item["quantity"]) || 0;
  });

  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = `0${d.getMonth() + 1}`.slice(-2); // Adding leading zero
    const day = `0${d.getDate()}`.slice(-2); // Adding leading zero
    return `${month}-${day}-${year}`;
  };

  invoiceData["Invoice Issue Date"] = formatDate(invoiceData["Invoice Issue Date"]);
  invoiceData["Invoice Due Date"] = formatDate(invoiceData["Invoice Due Date"]);

  // Retrieve tax percentage from invoice data
  const taxPercentage = parseFloat(invoiceData["Tax percentage"]) || 0;
  // Calculate tax amount
  const taxAmount = (subAmount * taxPercentage) / 100;

  // Calculate the total amount
  const totalAmount = subAmount + taxAmount;

  const remarksUI = invoiceData["Remarks"] ? `<div class="footer">
            <p>Notes:</p>
            <p>${invoiceData["Remarks"]}</p>
        </div>` : "";

  return `
    <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invoice Template</title>
  <style>
    body {
      font-family: 'Arial', sans-serif;
      margin: 0;
      padding: 0;
    }
    .container {
      padding: 20px;
    }
    .header {
      display: flex;
      justify-content: space-between;
      padding-bottom: 10px;
    }
    .company-info {
      text-align: left;
      p {
        margin: 0;
        max-width: 200px;
      }
    }
    .invoice-title {
      text-align: right;
      font-size: 24px;
      color: #007BFF;
      h2 {
        margin: 0;
      }
    }
    .bill-ship {
      display: flex;
      justify-content: space-between;
      margin-top: 20px;
      p {
        margin: 8px 0;
        max-width: 270px;
      }
    }
    h2 {
      font-size: 18px;
      margin-bottom: 5px;
      color: #333;
    }
    .items {
      width: 100%;
      margin-top: 20px;
      border-collapse: collapse;
    }
    .items th, .items td {
      border: 1px solid #ddd;
      padding: 8px;
      text-align: right;
    }
    .items th {
      background-color: #f4f4f4 !important;
      text-align: center;
    }
    .items td:first-child {
      text-align: center;
    }
    .total {
      text-align: right;
      margin-top: 20px;
    }
    .sub-total {
      margin: 10px 0;
    }
    .grand-total {
      margin: 10px 0;
    }
    .footer {
      margin-top:50px;
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header Section -->
    <div class="header">
      <div class="invoice-title">
        <h2>INVOICE</h2>
      </div>
      <div class="company-info">
        <p>${invoiceData["Sender's Zipcode"]},${invoiceData["Sender's Address"]}, ${invoiceData["Sender's City"]}, <br>Phone: ${invoiceData["Sender's Contact No"]}</p>
      </div>
    </div>
    
    <div class="bill-ship">
      <div class="bill">
        <h2>Bill To</h2>
        <p>${invoiceData["Sender's Name"]}</p>
        <p>${invoiceData["Sender's Address"]},${invoiceData["Sender's City"]}, ${invoiceData["Sender's State"]}</p>
        <p>${invoiceData["Sender's Email"]}</p>
      </div>
      <div class="ship">
        <h2>Ship To</h2>
        <p>${invoiceData["Receiver's Name"]}</p>
        <p>${invoiceData["Receiver's Address"]},${invoiceData["Receiver's City"]}, ${invoiceData["Receiver's State"]}</p>
        <p>${invoiceData["Receiver's email"]}</p>
      </div>
      <div class="invoice-info">
        <h2>Invoice Details</h2>
        <p><strong>Invoice No.:</strong> ${invoiceData["Invoice No."]}</p>
        <p><strong>Date:</strong> ${invoiceData["Invoice Issue Date"]}</p>
        <p><strong>Due Date:</strong> ${invoiceData["Invoice Due Date"]}</p>
      </div>
    </div>

    <table class="items">
      <thead>
        <tr>
          <th>QTY</th>
          <th>ITEM NAME</th>
          <th>ITEM DESCRIPTION</th>
          <th>ITEM PRICE</th>
        </tr>
      </thead>
      <tbody>
      ${invoiceData["Items"]
        .map( (item) => `<tr>
          <td>${item["quantity"]}</td>
          <td>${item["name"]}</td>
          <td>${item["itemDescription"] ?? ""}</td>
          <td>${item["price"]}</td>
        </tr>`).join("")}
        <tr>
          <td colspan="3" style="text-align:right; border: none;">Subtotal</td>
          <td>${subAmount}</td>
        </tr>
        <tr>
          <td colspan="3" style="text-align:right; border: none">GST ${invoiceData["Tax percentage"]}%</td>
          <td>${taxAmount}</td>
        </tr>
        <tr>
          <td colspan="3" style="text-align:right; border: none; font-weight: bold;">TOTAL</td>
          <td style="background-color: #f4f4f4; font-weight: bold;">${totalAmount}</td>
        </tr>
      </tbody>
    </table>

    ${remarksUI}
  </div>
</body>
</html>

    `;
}
