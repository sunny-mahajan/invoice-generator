export default function generateHTMLTPL002(invoiceData) {
    console.log(invoiceData, "invoiceData");
  // Initialize the sub-amount
  let subAmount = 0;

  // Calculate the sub-amount by summing item prices
  invoiceData.Items.forEach((item) => {
    // Convert item price to a number
    subAmount += parseFloat(item["price"]) || 0;
  });

  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = `0${d.getMonth() + 1}`.slice(-2); // Adding leading zero
    const day = `0${d.getDate()}`.slice(-2); // Adding leading zero
    return `${month}-${day}-${year}`;
  };

  invoiceData['Invoice Issue Date'] = formatDate(invoiceData['Invoice Issue Date']);
  invoiceData['Invoice Due Date'] = formatDate(invoiceData['Invoice Due Date']);

  // Retrieve tax percentage from invoice data
  const taxPercentage = parseFloat(invoiceData["Tax percentage"]) || 0;
console.log(taxPercentage, "taxPercentage", subAmount , 'subAmount');
  // Calculate tax amount
  const taxAmount = (subAmount * taxPercentage) / 100;

  // Calculate the total amount
  const totalAmount = subAmount + taxAmount;

  const remarksUI = invoiceData["Remarks"] ? `<div class="sec6-container">
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
      background-color: #f7f7f7;
      margin: 0;
      padding: 0;
    }
    .container {
      padding: 20px;
    }
    .header {
      display: flex;
      justify-content: space-between;
      border-bottom: 2px solid #007BFF;
      padding-bottom: 10px;
    }
    .company-info {
      text-align: left;
    }
    .invoice-title {
      text-align: right;
      font-size: 24px;
      color: #007BFF;
    }
    .bill-ship {
      display: flex;
      justify-content: space-between;
      margin-top: 20px;
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
      background-color: #f4f4f4;
    }
    .items td:first-child {
      text-align: left;
    }
    .total {
      text-align: right;
      margin-top: 20px;
      font-weight: bold;
    }
    .footer {
      margin-top: 30px;
      text-align: center;
      font-size: 14px;
      color: #777;
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header Section -->
    <div class="header">
      <div class="company-info">
        <p>77 Namrata Bldg<br>27, Off City, Gupta<br>Phone: +91 9876543210</p>
      </div>
      <div class="invoice-title">
        <h2>INVOICE</h2>
      </div>
    </div>
    
    <!-- Billing and Shipping Section -->
    <div class="bill-ship">
      <div class="bill">
        <h2>Bill To</h2>
        <p>Kavindra Namsan<br>27, Off City, Gupta<br>Delhi, Delhi 400003</p>
        <p>Email: kavindra@example.com</p>
      </div>
      <div class="ship">
        <h2>Ship To</h2>
        <p>Kavindra Namsan<br>264, Abdul Rehman<br>Mumbai, Bihar 400009</p>
        <p>Email: shipto@example.com</p>
      </div>
      <div class="invoice-info">
        <h2>Invoice Details</h2>
        <p><strong>Invoice No.:</strong> IN-001</p>
        <p><strong>Date:</strong> 01-01-2020</p>
        <p><strong>Due Date:</strong> 01-01-2020</p>
      </div>
    </div>

    <!-- Items Section -->
    <table class="items">
      <thead>
        <tr>
          <th>QTY</th>
          <th>DESCRIPTION</th>
          <th>UNIT PRICE</th>
          <th>AMOUNT</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1</td>
          <td>Frontend design restructure</td>
          <td>₹9,999.00</td>
          <td>₹9,999.00</td>
        </tr>
        <tr>
          <td>2</td>
          <td>Custom icon package</td>
          <td>₹75.00</td>
          <td>₹150.00</td>
        </tr>
        <tr>
          <td>3</td>
          <td>Gandhi mouse pad</td>
          <td>₹99.00</td>
          <td>₹297.00</td>
        </tr>
      </tbody>
    </table>

    <!-- Total Section -->
    <div class="total">
      <p>Subtotal: ₹12,248.00</p>
      <p>GST 12.5%: ₹1,468.52</p>
      <h3>Total: ₹13,715.52</h3>
    </div>

    <div class="footer">Thank you for your business!</div>    
  </div>
</body>
</html>

    `;
}
