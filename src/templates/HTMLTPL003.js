export default function generateHTMLTPL003(invoiceData) {
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
      USD: "$", // US Dollar
      EUR: "€", // Euro
      GBP: "£", // British Pound
      JPY: "¥", // Japanese Yen
      AUD: "A$", // Australian Dollar
      CAD: "C$", // Canadian Dollar
      INR: "₹", // Indian Rupee
      CNY: "¥", // Chinese Yuan
    };

    const symbol = currencySymbols[currency] || "INR"; // Default to empty if currency not found
    return symbol;
  };

  invoiceData["Invoice Issue Date"] = formatDate(
    invoiceData["Invoice Issue Date"]
  );
  invoiceData["Invoice Due Date"] = formatDate(invoiceData["Invoice Due Date"]);

  // Retrieve tax percentage from invoice data
  const taxPercentage = parseFloat(invoiceData["Tax Percentage"]) || 0;
  // Calculate tax amount
  const taxAmount = (subAmount * taxPercentage) / 100;

  // Calculate the total amount
  const totalAmount = subAmount + taxAmount;

  const remarksUI = invoiceData["Remarks"]
    ? `<div class="footer">
            <p>Notes:</p>
            <p>${invoiceData["Remarks"]}</p>
        </div>`
    : "";

  const bankDetailsAvailable =
    invoiceData["Bank Name"] ||
    invoiceData["Account No"] ||
    invoiceData["Account Holder Name"] ||
    invoiceData["IFSC Code"] ||
    invoiceData["Account Type"];

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
      margin-top: 20px;
      padding: 20px;
      border-top: #007BFF solid 20px;
    }
    .header {
      display: flex;
      justify-content: space-between;
      padding-bottom: 10px;
    }
    .company-info {
      text-align: left;
      p{
        max-width: 200px;
      }
    }
    .invoice-title {
      text-align: right;
      font-size: 24px;
      color: #007BFF;
    }
    .invoice-details-heading {
      width: 120px;
      display: inline-block;
      font-weight: bold;
    }
    .bill-ship {
      display: flex;
      justify-content: space-between;
      margin-top: 20px;
      p {
        margin: 8px 0;
      }
      .bill, .ship {
        max-width: 200px;
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
      padding: 8px;
      text-align: right;
    }
    .items th:first-child, .items td:first-child {
      text-align: left;
    }
    .items th:nth-child(2), .items td:nth-child(2) {
        /* Your styles for the second column here */
        text-align: center;
        width: 300px;
    }
    .total-section {
      margin: 30px 0;
    }
    .total-details {
      border-top: 2px solid;
      border-bottom: 4px solid;
      display: flex;
      justify-content: space-between;
    }
    .bank-details-container {
      .sub-bank-details-container {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 7px;
        .sub-bank-details-title {
          width: 130px;
        }
      }
    }
    .footer {
      margin-top: 25px;
      text-align: right;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="company-info">
      ${
        invoiceData["Sender's Zipcode"] ||
        invoiceData["Sender's Address"] ||
        invoiceData["Sender's City"]
          ? `<p>
          ${
            invoiceData["Sender's Zipcode"]
              ? `${invoiceData["Sender's Zipcode"]}, `
              : ""
          }
          ${
            invoiceData["Sender's Address"]
              ? `${invoiceData["Sender's Address"]}, `
              : ""
          }
          ${
            invoiceData["Sender's City"]
              ? `${invoiceData["Sender's City"]}, `
              : ""
          }
          ${
            invoiceData["Sender's Contact No"]
              ? `
            <br> Phone: ${invoiceData["Sender's Contact No"]}`
              : ""
          } 
        </p>`
          : ""
      }



        
      </div>
    </div>

    <div class="bill-ship">
      <div class="bill">
        <h2>BILL TO</h2>
        ${
          invoiceData["Sender's Name"]
            ? `<p>${invoiceData["Sender's Name"]}</p>`
            : ""
        }
        
        ${
          invoiceData["Sender's Zipcode"] ||
          invoiceData["Sender's Address"] ||
          invoiceData["Sender's City"]
            ? `<p>
            ${
              invoiceData["Sender's Zipcode"]
                ? `${invoiceData["Sender's Zipcode"]}, `
                : ""
            }
            ${
              invoiceData["Sender's Address"]
                ? `${invoiceData["Sender's Address"]}, `
                : ""
            }
            ${invoiceData["Sender's City"] || ""}
          </p>`
            : ""
        }
      
        ${
          invoiceData["Sender's State"] || invoiceData["Sender's Country"]
            ? `<p>
            ${
              invoiceData["Sender's State"]
                ? `${invoiceData["Sender's State"]}, `
                : ""
            }
            ${invoiceData["Sender's Country"] || ""}
          </p>`
            : ""
        }
        
        ${
          invoiceData["Sender's Contact No"]
            ? `<p>${invoiceData["Sender's Contact No"]}</p>`
            : ""
        }
        ${
          invoiceData["Sender's Email"]
            ? `<p>${invoiceData["Sender's Email"]}</p>`
            : ""
        }
        ${
          invoiceData["Sender's Tax No"]
            ? `<p>${invoiceData["Sender's Tax No"]}</p>`
            : ""
        }
      </div>
      <div class="ship">
        <h2>SHIP TO</h2>
        ${
          invoiceData["Receiver's Name"]
            ? `<p>${invoiceData["Receiver's Name"]}</p>`
            : ""
        }
        
        ${
          invoiceData["Receiver's Zipcode"] ||
          invoiceData["Receiver's Address"] ||
          invoiceData["Receiver's City"]
            ? `<p>
            ${
              invoiceData["Receiver's Zipcode"]
                ? `${invoiceData["Receiver's Zipcode"]}, `
                : ""
            }
            ${
              invoiceData["Receiver's Address"]
                ? `${invoiceData["Receiver's Address"]}, `
                : ""
            }
            ${invoiceData["Receiver's City"] || ""}
          </p>`
            : ""
        }
        
        ${
          invoiceData["Receiver's State"] || invoiceData["Receiver's Country"]
            ? `<p>
            ${
              invoiceData["Receiver's State"]
                ? `${invoiceData["Receiver's State"]}, `
                : ""
            }
            ${invoiceData["Receiver's Country"] || ""}
          </p>`
            : ""
        }
      
        ${
          invoiceData["Receiver's Contact No"]
            ? `<p>${invoiceData["Receiver's Contact No"]}</p>`
            : ""
        }
        ${
          invoiceData["Receiver's Email"]
            ? `<p>${invoiceData["Receiver's Email"]}</p>`
            : ""
        }
        ${
          invoiceData["Receiver's Tax No"]
            ? `<p>${invoiceData["Receiver's Tax No"]}</p>`
            : ""
        }
      </div>
      <div class="invoice-info">
        <h2>INVOICE DETAILS</h2>
        <div>
            <span class="invoice-details-heading" style="margin: 8px 0;">INVOICE NO.</span><span>${
              invoiceData["Invoice No."]
            }</span>
        </div>
        <div>
            <span class="invoice-details-heading" style="margin: 0 0 8px 0;">DATE</span><span>${
              invoiceData["Invoice Issue Date"]
            }</span>
        </div>
        <div>
            <span class="invoice-details-heading" style="margin: 0 0 8px 0;">DUE DATE</span><span>${
              invoiceData["Invoice Due Date"]
            }</span>
        </div>
        ${
          invoiceData["newFields"]?.length > 0
            ? `
            ${invoiceData["newFields"]
              .map(
                (item) => `
                 <div>
                    <span class="invoice-details-heading" style="margin: 0 0 8px 0;">${item["fieldName"]}</span><span>${item["fieldValue"]}
                    </span>
                </div>
              `
              )
              .join("")}
            `
            : ""
        }
      </div>
    </div>

    <div class="total-section">
        <div class="total-details">
            <h1><strong>Invoice Total</strong></h1>
            <h1><strong>${currencySymbol(
              invoiceData["Currency"]
            )}${totalAmount}</strong></h1>
        </div>
    </div>

    <table class="items">
      <thead>
        <tr>
          <th>QTY</th>
          <th>ITEM DESCRIPTION</th>
          <th>ITEM NAME</th>
          <th>ITEM PRICE</th>
          <th>TOTAL</th>
        </tr>
      </thead>
      <tbody>
      ${invoiceData["Items"]
        .map(
          (item) => `<tr>
          <td>${item["quantity"]}</td>
          <td>${item["description"] ?? ""}</td>
          <td>${item["name"]}</td>
          <td>${currencySymbol(invoiceData["Currency"])}${item["price"]}</td>
          <td>${currencySymbol(invoiceData["Currency"])}${
            item["price"] * item["quantity"]
          }</td>
        </tr>`
        )
        .join("")}
         ${
           invoiceData["Tax Percentage"] > 0
             ? `
          <tr>
          <td colspan="4" style="text-align:right; padding-top: 30px;">Subtotal</td>
          <td style="padding-top: 30px;text-align:right; width: auto">${currencySymbol(
            invoiceData["Currency"]
          )}${subAmount}</td>
        </tr>
        <tr>
          <td colspan="4" style="text-align:right;">${
            invoiceData["Receiver's Tax Type"]
          } ${invoiceData["Tax Percentage"]}%</td>
          <td style="text-align:right; width: auto">${currencySymbol(
            invoiceData["Currency"]
          )}${taxAmount}</td>
        </tr>`
             : ""
         }
        
      </tbody>
    </table>
    ${
      bankDetailsAvailable
        ? `<div class="bank-details-container">
      <h2>Bank Details</h2>
      ${
        invoiceData["Bank Name"]
          ? `
      <div class="sub-bank-details-container">
          <span class="sub-bank-details-title">Bank Name:</span><span>${invoiceData["Bank Name"]}</span>
      </div>`
          : ""
      }
      ${
        invoiceData["Account No"]
          ? `
      <div class="sub-bank-details-container">
          <span class="sub-bank-details-title">A/c No:</span><span>${invoiceData["Account No"]}</span>
      </div>`
          : ""
      }
      ${
        invoiceData["Account Holder Name"]
          ? `
      <div class="sub-bank-details-container">
          <span class="sub-bank-details-title">A/c Holder Name:</span><span>${invoiceData["Account Holder Name"]}</span>
      </div>`
          : ""
      }
      ${
        invoiceData["IFSC Code"]
          ? `
      <div class="sub-bank-details-container">
          <span class="sub-bank-details-title">IFSC Code:</span><span>${invoiceData["IFSC Code"]}</span>
      </div>`
          : ""
      }
      ${
        invoiceData["Account Type"]
          ? `
      <div class="sub-bank-details-container">
          <span class="sub-bank-details-title">A/c Type:</span><span>${invoiceData["Account Type"]}</span>
      </div>`
          : ""
      }
  </div>`
        : ""
    }

    ${remarksUI}
  </div>
</body>
</html>
    `;
}
