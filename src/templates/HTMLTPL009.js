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
    <title>Modern Invoice Template</title>
    <style>
      .invoice-container {
        background: #ffffff;
      }
     .invoice-container p {
        color: #555555;
        margin: 3px 0;
      }

      .header-cls {
        background: linear-gradient(135deg, #4caf50, #2f8e41);
        color: white;
        padding: 30px;
      }
      .header-content {
        display: flex;
        justify-content: space-between;
      }

      .header-cls .title {
        font-size: 32px;
        font-weight: bold;
        margin: 0;
      }

      .invoice-logo {
        width: 80px;
        height: auto;
        max-height: 80px;
        object-fit: contain;
      }

      .header-cls .from,
      .header-cls .invoice-details {
        font-size: 16px;
        margin-top: 15px;
        line-height: 1.5;
      }

      .header-cls .from span,
      .header-cls .invoice-details span {
        display: block;
        font-size: 14px;
        opacity: 0.8;
      }
      .invoice-details div {
        display: flex;
      }
      .invoice-details strong {
        min-width: 115px;
      }
      .details {
        padding: 20px 30px;
        background: #f3f4f6;
      }

      .details .info {
        display: flex;
        justify-content: space-between;
        margin-bottom: 15px;
      }

      .details .info div {
        font-size: 16px;
      }

      .details .info div span {
        display: block;
        font-size: 14px;
        opacity: 0.8;
      }

      .items {
        padding: 20px 30px;
      }

      .items table {
        width: 100%;
        border-collapse: collapse;
      }
      .items th:first-child, .items td:first-child {
        text-align: center;
      }
      .items th,
      .items td {
        text-align: right;
        padding: 8px;
        border: 1px solid #ddd;
      }

      .items th {
        background-color: #4caf50;
        color: white;
        font-size: 16px;
      }

      .items .item-des-cls {
        text-align: left;
        max-width: 120px;
      }

      .items .item-name-cls {
        text-align: center;
        max-width: 150px;
      }

      .items td {
        font-size: 14px;
      }

      .summary {
        padding: 20px 30px;
        background: #f3f4f6;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .summary .total {
        text-align: right;
      }

      .summary .total p {
        margin: 0;
        font-size: 16px;
      }

      .summary .total p.total-amount {
        font-size: 20px;
        font-weight: bold;
        color: #4caf50;
      }
      .bill-from-invoice-deatils {
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;
      }
      .bill-to-bank-deatils {
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;
        border: 1px solid #ddd;
      }

      .bank-details,
      .invoice-to-cls {
        padding: 20px 30px;
        background: white;
        font-size: 14px;
        color: #555;
      }
    </style>
  </head>
  <body>
    <div class="invoice-container">
      <!-- Header Section -->
      <div class="header-cls">
        <div class="header-content">
          <h1 class="title">INVOICE</h1>
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
        </div>
        <div class="bill-from-invoice-deatils">
          <div class="from">
            <strong>From:</strong> ${
              invoiceData["Sender's Name"]
                ? `${invoiceData["Sender's Name"]}`
                : ""
            }
              ${
                invoiceData["Sender's Zipcode"] ||
                invoiceData["Sender's Address"] ||
                invoiceData["Sender's City"]
                  ? `<span>
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
                </span>`
                  : ""
              }
            
              ${
                invoiceData["Sender's State"]
                  ? `<span>
                  ${
                    invoiceData["Sender's State"]
                      ? `${invoiceData["Sender's State"]}, `
                      : ""
                  }
                </span>`
                  : ""
              }
              
              ${
                invoiceData["Sender's Contact No"]
                  ? `<span>${invoiceData["Sender's Contact No"]}</span>`
                  : ""
              }
              ${
                invoiceData["Sender's Email"]
                  ? `<span>${invoiceData["Sender's Email"]}</span>`
                  : ""
              }
              ${
                invoiceData["Sender's Tax No"]
                  ? `<span>${invoiceData["Sender's Tax No"]}</span>`
                  : ""
              }
              ${
                invoiceData["Sender's PAN No"]
                  ? `<span>${invoiceData["Sender's PAN No"]}</span>`
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
                          <span>${item["fieldName"]}:</span><span> ${item["fieldValue"]}</span>
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
          <div class="invoice-details">
            <div>
                <strong>Invoice No.:</strong> ${invoiceData["Invoice No."]}
            </div>
            ${
              invoiceData["newFields"]?.length > 0
                ? `
                  ${invoiceData["newFields"]
                    .map(
                      (item) => `
                       ${
                         item["fieldName"] && item["fieldValue"]
                           ? `
                            <div>
                                <strong>${item["fieldName"]}:</strong>${item["fieldValue"]}
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
      </div>

      <!-- Details Section -->
      <div class="details">
        <div class="info">
          <div>
            <strong>Invoice Date:</strong>
            <span>${invoiceData["Invoice Issue Date"]}</span>
          </div>
          ${
            invoiceData["Invoice Due Date"]
              ? `
              <div>
                <strong>DUE DATE</strong>
                <span>${invoiceData["Invoice Due Date"]}</span>
              </div>`
              : ""
          }
        </div>
      </div>

      <!-- Items Section -->
      <div class="items">
        <table>
          <thead>
            <tr>
                <th>QTY</th>
                <th class="item-name-cls">NAME</th>
                ${
                  isDescriptionAvailable
                    ? `<th class="item-des-cls">DESCRIPTION</th>`
                    : ""
                }
                <th>PRICE</th>
                <th>AMOUNT</th>
                <th>TAX %</th>
                <th>TAX ${currencySymbol(invoiceData["Currency"])}</th>
                <th>TOTAL</th>
            </tr>
          </thead>
          <tbody>
          ${invoiceData["Items"]
            .map(
              (item) => `<tr>
              <td>${item["quantity"]}</td>
              <td class="item-name-cls">${item["name"]}</td>
              ${
                isDescriptionAvailable
                  ? `<td class="item-des-cls">${item["description"]}</td>`
                  : ""
              }
              <td>${currencySymbol(invoiceData["Currency"])}${
                item["price"]
              }</td>
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
      </div>

      <!-- Summary Section -->
      <div class="summary">
      ${
        taxPercentage > 0
          ? `
        <div>
            <p><strong>Subtotal:</strong> ${currencySymbol(
              invoiceData["Currency"]
            )}${subAmount.toFixed(1)}</p>
            ${
              invoiceData["Sender's Tax Type"] === "IGST"
                ? `
                    <p><strong>${
                      invoiceData["Sender's Tax Type"]
                    } (${taxPercentage.toFixed(1)}%):</strong>
                    ${currencySymbol(
                      invoiceData["Currency"]
                    )}${taxAmount.toFixed(1)}</p>
                        `
                : `
                    <p><strong>CGST (${(taxPercentage / 2).toFixed(
                      1
                    )}%)</strong>:
                         ${currencySymbol(invoiceData["Currency"])}${(
                    taxAmount / 2
                  ).toFixed(1)}</p>
                    <p><strong>SGST (${(taxPercentage / 2).toFixed(
                      1
                    )}%):</strong>
                         ${currencySymbol(invoiceData["Currency"])}${(
                    taxAmount / 2
                  ).toFixed(1)}</p>
                        `
            }
        </div>
        `
          : ""
      }
          
        
        <div class="total">
          <p class="total-amount">Total: ${currencySymbol(
            invoiceData["Currency"]
          )}${totalAmount.toFixed(1)}</p>
        </div>
      </div>
      <div class="bill-to-bank-deatils">
        ${
          bankDetailsAvailable
            ? `
              <div class="bank-details">
                <p><strong>Bank Details:</strong></p>
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
        <div class="invoice-to-cls">
          <p><strong>To:</strong></p>
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
                    <div style="display: flex; align-items: center; margin: 3px 0;">
                        <p style="margin: 0;">${item["fieldName"]}:</p><p style="margin: 0;"> ${item["fieldValue"]}</p>
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
    </div>
  </body>
</html>
        `;
}
