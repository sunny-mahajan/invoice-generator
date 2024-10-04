export default function generateHTMLTPL004(invoiceData) {
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

    const currencySymbol = (currency) => {
        const currencySymbols = {
          USD: "$",  // US Dollar
          EUR: "€",  // Euro
          GBP: "£",  // British Pound
          JPY: "¥",  // Japanese Yen
          AUD: "A$", // Australian Dollar
          CAD: "C$", // Canadian Dollar
          INR: "₹",  // Indian Rupee
          CNY: "¥",  // Chinese Yuan
        };
      
        const symbol = currencySymbols[currency] || 'INR'; // Default to empty if currency not found
        console.log(symbol, "symbol", currency);
        return symbol;
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
    <title>Invoice</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0 auto;
            padding: 20px;
        }
        h1 {
            font-size: 36px;
            font-family: 'Courier New', Courier, monospace;
        }
        .header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
        }
        .header div {
            width: 45%;
        }
        .invoice-info, .billing-info {
            margin-bottom: 20px;
        }
        .invoice-info p, .billing-info p {
            margin: 5px 0;
        }
        .product-description table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        .product-description th {
            border: 1px solid #000;
            padding: 8px;
            text-align: center;
        }
        .product-description td {
            border: 1px solid #000;
            padding: 8px;
            text-align: right;
        }
        .product-description td:first-child {
            text-align: center !important;
        }
        .product-description td:nth-child(2) {
            text-align: left !important;
            width: 300px;
        }
        .product-description th {
            background-color: #d9d9d9;
        }
        .totals {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
        }
        .totals div {
            width: 45%;
        }
        .totals table {
            width: 100%;
        }
        .totals td {
            padding: 8px;
        }
        .footer {
            display: flex;
            justify-content: space-between;
        }
        .footer div {
            width: 45%;
        }
        .footer p {
            margin: 5px 0;
        }
    </style>
</head>
<body>
    <h1>Invoice</h1>
    <div class="header">
        <div>
            <p><strong>To:</strong></p>
            <p>${invoiceData["Receiver's Name"]}</p>
            <p>${invoiceData["Receiver's Contact No"]}</p>
            <p>${invoiceData["Receiver's Address"]},${invoiceData["Receiver's City"]}, ${invoiceData["Receiver's State"]}</p>
            <p>${invoiceData["Receiver's email"]}</p>
            <p>${invoiceData["Receiver's GST"]}</p>
            <p>${invoiceData["Receiver's PAN"]}</p>

        </div>
        <div class="invoice-info">
            <p><strong>Invoice #</strong>: ${invoiceData["Invoice No."]}</p>
            <p><strong>Date</strong>: ${invoiceData["Invoice Issue Date"]}</p>
            <p><strong>Due Date</strong>: ${invoiceData["Invoice Due Date"]}</p>
        </div>
    </div>

    <div class="product-description">
        <table>
            <thead>
                <tr>
                    <th>Item Name</th>
                    <th>Description</th>
                    <th>Qty</th>
                    <th>Price</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
            ${invoiceData["Items"]
                .map(
                  (item) => `
                  <tr>
                      <td>${item["name"]}</td>
                      <td>${item["description"] ?? ""}</td>
                      <td>${item["quantity"]}</td>
                      <td>${currencySymbol(invoiceData["Currency"])}${item["price"]}</td>
                      <td>${currencySymbol(invoiceData["Currency"])}${item["price"] * item["quantity"]}</td>
                  </tr>
              `
                )
                .join("")}
                <tr>
                    <td colspan="4" style="text-align:right !important; border: none;">Sub Total</td>
                    <td style="width: auto; text-align:right !important;">${currencySymbol(invoiceData["Currency"])}${subAmount}</td>
                </tr>
                <tr>
                    <td colspan="4" style="text-align:right !important; border: none;">${invoiceData["Tax Type"]} ${invoiceData["Tax percentage"]}%</td>
                    <td style="width: auto; text-align:right !important;">${currencySymbol(invoiceData["Currency"])}${taxAmount}</td>
                </tr>
                <tr>
                    <td colspan="4" style="text-align:right !important; border: none;"><strong>Total Due</strong></td>
                    <td style="background-color: #d9d9d9; width: auto; text-align:right !important"><strong>${currencySymbol(invoiceData["Currency"])}${totalAmount}</strong></td>
                </tr>
            </tbody>
        </table>
    </div>

    

    <div class="footer">
        <div>
            <p>${invoiceData["Sender's Name"]}</p>
            <p>${invoiceData["Sender's Address"]}, ${invoiceData["Sender's City"]}, ${invoiceData["Sender's State"]}</p>
            <p>${invoiceData["Sender's Contact No"]}</p>
            <p>${invoiceData["Sender's Email"]}</p>
            <p>${invoiceData["Sender's GST"]}</p>
            <p>${invoiceData["Sender's PAN"]}</p>
        </div>
    </div>
</body>
</html>
      `;
  }
  