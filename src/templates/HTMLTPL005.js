export default function generateHTMLTPL003(invoiceData) {
  // Initialize the sub-amount
  let subAmount = 0;
  let totalAmount = 0;
  let taxAmount = 0;
  let isDescriptionAvailable = false;

  // Calculate the sub-amount by summing item prices
  invoiceData?.Items?.forEach((item) => {
    // Convert item price to a number
    // subAmount += parseFloat(item["price"]) * parseFloat(item["quantity"]) || 0;
    subAmount += +item.amount || 0;
    totalAmount += +item.total || 0;
    taxAmount += +item.taxAmount || 0;

    if (item["description"]) {
      isDescriptionAvailable = true;
    }
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
  invoiceData["Invoice Due Date"] = invoiceData["Invoice Due Date"]
    ? formatDate(invoiceData["Invoice Due Date"])
    : "";

  // Retrieve tax percentage from invoice data
  const taxPercentage = (taxAmount / subAmount) * 100 || 0;

  const bankDetailsAvailable =
    invoiceData["Bank Name"] ||
    invoiceData["Account No"] ||
    invoiceData["Account Holder Name"] ||
    invoiceData["IFSC Code"] ||
    invoiceData["Bank Address"];

  return `
      <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Invoice Template</title>
    <style>
      /* Add your CSS styles here */
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      body {
        font-family: Arial, sans-serif;
        background-color: white;
      }

      .invoice-container {
        padding: 20px;
      }
        .invoice-container h2,.invoice-container h3 {
            font-weight: 700 !important;
        }

    .invoice-container p {
        color: #000000 !important;
    }

      .invoice-header {
        display: flex;
        justify-content: space-between;
        border-bottom: 3px solid #e67e22;
      }

    .invoice-logo {
        object-fit: contain;
        width: 100px;
        height: auto;
        max-height: 80px;
        margin-bottom: 10px;
      }

      .invoice-info h2 {
        font-size: 24px;
        color: #e67e22;
        text-align: right;
      }

      .invoice-address {
        display: flex;
        justify-content: space-between;
        margin-top: 20px;
        border-bottom: 1px solid #dcdcdc;
        padding-bottom: 20px;
      }

      .invoice-to,
      .invoice-from {
        width: 45%;
      }

      .invoice-to h3,
      .invoice-from h3 {
        font-size: 18px;
        color: #2c3e50;
        margin-bottom: 10px;
      }

      .invoice-table {
        width: 100%;
        margin-top: 20px;
        border-collapse: collapse;
      }
 
      .invoice-table th {
        background-color: #e67e22;
        color: white;
        text-align: center !important;
      }
        .invoice-table th, .invoice-table td {
        border: 1px solid #dcdcdc;
          padding: 10px;
          text-align: right;
      }
      .invoice-table td:first-child, .invoice-table th:first-child {
        text-align: center;
      }
      .invoice-table .item-name-cls {
          text-align: center;
          max-width: 150px;
      }
      .invoice-table .item-name-cls p{
        color: #555555 !important;
      }
      .invoice-summary {
        display: flex;
        justify-content: space-between;
      }
        
      .invoice-summary .invoice-details-cls, .invoice-summary .bank-details-cls, .invoice-summary .totals {
        margin-top: 20px;
      }
      .invoice-details-cls h3,
      .bank-details-cls h3 {
        font-size: 18px;
        color: #2c3e50;
        margin-bottom: 10px;
      }

     
      .sub-sec5-container .sub-sec5-title {
        margin: 0;
        width: 150px;
      }
      .sub-sec5-container .sub-sec5-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .sub-sec5-container {
        display: flex;
        flex-direction: column;
        gap: 5px;
      }
    </style>
  </head>
  <body>
    <div class="invoice-container">
      <div class="invoice-header">
        <div>
            ${
              invoiceData["Logo"]
                ? `<img
                        src=${invoiceData["Logo"]}
                        alt="Business Logo"
                        class="invoice-logo"
                    />`
                : ""
            }
        </div>
        <div class="invoice-info">
          <h2>INVOICE</h2>
          <p>ID No: ${invoiceData["Invoice No."] || ""}</p>
        </div>
      </div>

      <div class="invoice-address">
        <div class="invoice-to">
          <h3>Invoice To:</h3>
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
            invoiceData["Receiver's State"]
              ? `<p>
              ${
                invoiceData["Receiver's State"]
                  ? `${invoiceData["Receiver's State"]}, `
                  : ""
              }
            </p>`
              : ""
          }
        
          ${
            invoiceData["Receiver's Contact No"]
              ? `<p>+91${invoiceData["Receiver's Contact No"]}</p>`
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
          ${
            invoiceData["Receiver's PAN No"]
              ? `<p>${invoiceData["Receiver's PAN No"]}</p>`
              : ""
          }
          ${
            invoiceData["Client Custom Fields"]?.length > 0
              ? `
        
              ${invoiceData["Client Custom Fields"]
                .map(
                  (item) => `
                  ${
                    item["fieldName"] && item["fieldValue"]
                      ? `
                    <div style="display: flex; align-items: center;">
                        <p>${item["fieldName"]}:</p><p> ${item["fieldValue"]}</p>
                    </div>
                    `
                      : ""
                  }
                `
                )
                .join("")}
                `
              : ""
          }
        </div>
        <div class="invoice-from">
          <h3>Invoice From:</h3>
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
            invoiceData["Sender's State"]
              ? `<p>
              ${
                invoiceData["Sender's State"]
                  ? `${invoiceData["Sender's State"]}, `
                  : ""
              }
            </p>`
              : ""
          }
          
          ${
            invoiceData["Sender's Contact No"]
              ? `<p>+91${invoiceData["Sender's Contact No"]}</p>`
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
          ${
            invoiceData["Sender's PAN No"]
              ? `<p>${invoiceData["Sender's PAN No"]}</p>`
              : ""
          }
          ${
            invoiceData["Sender Custom Fields"]?.length > 0
              ? `
        
              ${invoiceData["Sender Custom Fields"]
                .map(
                  (item) => `
                  ${
                    item["fieldName"] && item["fieldValue"]
                      ? `
                    <div style="display: flex; align-items: center;">
                        <p>${item["fieldName"]}:</p><p> ${item["fieldValue"]}</p>
                    </div>
                    `
                      : ""
                  }
                `
                )
                .join("")}
                `
              : ""
          }
        </div>
      </div>

      <table class="invoice-table">
        <thead>
        <tr>
          <th>No.</th>
          <th class="item-name-cls">NAME</th>
          <th>PRICE</th>
          <th>QTY</th>
          <th>AMOUNT</th>
          <th>GST %</th>
          <th>GST ${currencySymbol(invoiceData["Currency"])}</th>
          <th>TOTAL</th>
        </tr>
        </thead>
        <tbody>
        ${invoiceData["Items"]
          .map(
            (item, index) => `<tr style="page-break-inside: avoid;">
          <td>${index + 1}</td>
          <td class="item-name-cls">${item["name"]}
          ${isDescriptionAvailable ? `<p>${item["description"]}</p>` : ""}
          </td>
          <td>${currencySymbol(invoiceData["Currency"])}${item["price"]}</td>
          <td>${item["quantity"]}</td>
          <td>${currencySymbol(invoiceData["Currency"])}${
              item["price"] * item["quantity"]
            }</td>
          <td>${item["taxPercentage"]}%</td>
           <td>${currencySymbol(invoiceData["Currency"])}${(
              item["price"] *
              item["quantity"] *
              (item["taxPercentage"] / 100)
            ).toFixed(1)}</td>
          <td>
          ${currencySymbol(invoiceData["Currency"])}${
              item["price"] * item["quantity"] +
              item["price"] * item["quantity"] * (item["taxPercentage"] / 100)
            }
          </td>
        </tr>`
          )
          .join("")}
      </tbody>
      </table>

      <div class="invoice-summary" style="page-break-inside: avoid;">
        <div class="invoice-details-cls">
          <h3>Invoice Details:</h3>
          <p>Invoice Date: ${invoiceData["Invoice Issue Date"]}</p>
          ${
            invoiceData["Invoice Due Date"]
              ? `<p>Invoice Due Date: ${invoiceData["Invoice Due Date"]}</p>`
              : ""
          }
          ${
            invoiceData["newFields"]?.length > 0
              ? `

              ${invoiceData["newFields"]
                .map(
                  (item) => `
                  ${
                    item["fieldName"] && item["fieldValue"]
                      ? `<p>${item["fieldName"]}: ${item["fieldValue"]}</p>`
                      : ""
                  }
                `
                )
                .join("")}
                `
              : ""
          }
        </div>
        ${
          bankDetailsAvailable
            ? `
            <div class="bank-details-cls">
              <h3>Bank Details:</h3>
              ${
                invoiceData["Bank Name"]
                  ? `<p>Bank Name: ${invoiceData["Bank Name"]}</p>`
                  : ""
              }
              ${
                invoiceData["Account No"]
                  ? `<p>Account No: ${invoiceData["Account No"]}</p>`
                  : ""
              }
            ${
              invoiceData["Account Holder Name"]
                ? `<p>Account Holder Name: ${invoiceData["Account Holder Name"]}</p>`
                : ""
            }
            ${
              invoiceData["IFSC Code"]
                ? `<p>IFSC Code: ${invoiceData["IFSC Code"]}</p>`
                : ""
            }
              ${
                invoiceData["Account Type"]
                  ? `<p>Account Type: ${invoiceData["Account Type"]}</p>`
                  : ""
              }
            ${
              invoiceData["Bank Address"]
                ? `<p>Bank Address: ${invoiceData["Bank Address"]}</p>`
                : ""
            }
            </div>
            `
            : ""
        }
        <div class="totals">
          <div class="sub-sec5-container">
                 ${
                   taxPercentage > 0
                     ? `
                  <div class="sub-sec5-item">
                        <p class="sub-sec5-title">Subtotal</p><span>${currencySymbol(
                          invoiceData["Currency"]
                        )}${subAmount.toFixed(1)}</span>
                    </div>
                    <div class="sub-sec5-item">
                    ${
                      invoiceData["Sender's Tax Type"] === "IGST"
                        ? `
                    <p class="sub-sec5-title">${
                      invoiceData["Sender's Tax Type"]
                    } (${taxPercentage.toFixed(1)}%)</p><span>${currencySymbol(
                            invoiceData["Currency"]
                          )}${taxAmount.toFixed(1)}</span>
                    `
                        : `
                        <div style="display: flex; align-items: center; flex-direction: column; gap: 5px;">
                          <div style="display: flex; align-items: center;">
                            <p class="sub-sec5-title">CGST (${(
                              taxPercentage / 2
                            ).toFixed(1)}%)</p><span>${currencySymbol(
                            invoiceData["Currency"]
                          )}${(taxAmount / 2).toFixed(1)}</span>
                          </div>
                          <div style="display: flex; align-items: center;">
                            <p class="sub-sec5-title">SGST (${(
                              taxPercentage / 2
                            ).toFixed(1)}%)</p><span>${currencySymbol(
                            invoiceData["Currency"]
                          )}${(taxAmount / 2).toFixed(1)}</span>
                          </div>
                        </div>
                    `
                    }
                        
                    </div>`
                     : ""
                 }
                    
                     <div class="sub-sec5-item">
                        <h2 class="sub-sec5-title">Total</h2><span>${currencySymbol(
                          invoiceData["Currency"]
                        )}${totalAmount.toFixed(1)}</span>
                     </div>
                </div>
        </div>
      </div>
    </div>
  </body>
</html>

      `;
}
