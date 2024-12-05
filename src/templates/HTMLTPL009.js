export default function generateHTMLTPL003(invoiceData) {
  let isDescriptionAvailable = false;

  // Calculate the sub-amount by summing item prices
  invoiceData?.Items?.forEach((item) => {
    if (item["description"]) {
      isDescriptionAvailable = true;
    }
  });

  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = `0${d.getMonth() + 1}`.slice(-2); // Adding leading zero
    const day = `0${d.getDate()}`.slice(-2); // Adding leading zero
    return `${day}-${month}-${year}`;
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
        word-break: break-all;
      }

      .header-cls span {
        color: #ffffff !important;
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
        max-width: 300px;
      }

      .header-cls .from span,
      .header-cls .invoice-details span {
        display: block;
        font-size: 14px;
      }
      .invoice-details div {
        display: flex;
      }
      .invoice-details strong {
        width: 150px;
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
        text-align: center;
      }

      .items td {
        word-break: break-word;
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
        max-width: 300px;
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
                  ? `<span>+91-${invoiceData["Sender's Contact No"]}</span>`
                  : ""
              }
              ${
                invoiceData["Sender's Email"]
                  ? `<span>${invoiceData["Sender's Email"]}</span>`
                  : ""
              }
              ${
                invoiceData["Sender's Tax No"]
                  ? `<span><span>GST No: </span>${invoiceData["Sender's Tax No"]}</span>`
                  : ""
              }
              ${
                invoiceData["Sender's PAN No"]
                  ? `<span><span>PAN No: </span>${invoiceData["Sender's PAN No"]}</span>`
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
                <th>No.</th>
                <th class="item-name-cls">NAME</th>
                <th>PRICE</th>
                <th>QTY</th>
                ${
                  (invoiceData.itemData["taxPercentage"] <= 0 &&
                    invoiceData.itemData["discount"] > 0) ||
                  (invoiceData.itemData["taxPercentage"] > 0 &&
                    invoiceData.itemData["discount"] <= 0)
                    ? `
                  <th>AMOUNT</th>
                  `
                    : ""
                }
                ${
                  invoiceData.itemData["discount"] > 0
                    ? `<th>Discount</th>`
                    : ""
                }
                ${
                  invoiceData.itemData["taxPercentage"] > 0 &&
                  invoiceData.itemData["discount"] > 0
                    ? `
                  <th>Net Price</th>
                  `
                    : ""
                }
      
                ${
                  invoiceData.itemData["taxPercentage"] > 0
                    ? `<th>GST %</th>
                    `
                    : ""
                }
                ${
                  invoiceData.itemData["taxPercentage"] > 0 &&
                  invoiceData.itemData["discount"] <= 0
                    ? `
                    <th>GST ${currencySymbol(invoiceData["Currency"])}</th>
                  `
                    : ""
                }
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
              <td>${currencySymbol(invoiceData["Currency"])}${
                item["price"]
              }</td>
              <td>${item["quantity"]}</td>
              ${
                (invoiceData.itemData["taxPercentage"] <= 0 &&
                  invoiceData.itemData["discount"] > 0) ||
                (invoiceData.itemData["taxPercentage"] > 0 &&
                  invoiceData.itemData["discount"] <= 0)
                  ? `
                    <td>${currencySymbol(invoiceData["Currency"])}${
                      item["amount"]
                    }
                  </td>
                  `
                  : ""
              }

                ${
                  invoiceData.itemData["discount"] > 0
                    ? `
                    <td>${item["discountPercentage"] || 0}%</td>
                    `
                    : ""
                }
                ${
                  invoiceData.itemData["taxPercentage"] > 0 &&
                  invoiceData.itemData["discount"] > 0
                    ? `
                  <td>${currencySymbol(invoiceData["Currency"])}${
                        item["afterDiscount"]
                      }
                  </td>
                `
                    : ""
                }
                ${
                  invoiceData.itemData["taxPercentage"] > 0
                    ? `
                  <td>${item["taxPercentage"] || 0}%</td>
                  
                  `
                    : ""
                }
                ${
                  invoiceData.itemData["taxPercentage"] > 0 &&
                  invoiceData.itemData["discount"] <= 0
                    ? `
                    <td>${currencySymbol(invoiceData["Currency"])}${
                        item["taxAmount"]
                      }</td>
                    `
                    : ""
                }
                <td>${currencySymbol(invoiceData["Currency"])}${item["total"]}
                </td>
            </tr>`
            )
            .join("")}
          </tbody>
        </table>
      </div>

      <!-- Summary Section -->
      <div class="summary" style="page-break-inside: avoid;">
        ${
          invoiceData.itemData["taxPercentage"] > 0 ||
          invoiceData.itemData["discount"] > 0
            ? `
          <div>
              <p><strong>Subtotal:</strong> ${currencySymbol(
                invoiceData["Currency"]
              )}${invoiceData.itemData["subTotal"]}</p>
              ${
                invoiceData.itemData["discount"] > 0
                  ? `
                  <p><strong>Discount:</strong>${currencySymbol(
                    invoiceData["Currency"]
                  )}${invoiceData.itemData["discount"]}</p>
                `
                  : ""
              }
              ${
                invoiceData.itemData["discount"] > 0 &&
                invoiceData.itemData["taxPercentage"] > 0
                  ? `
                    <p><strong>Net Price:</strong>${currencySymbol(
                      invoiceData["Currency"]
                    )}${invoiceData.itemData["afterDiscountAmount"]}</p>
                `
                  : ""
              }
              ${
                invoiceData.itemData["taxPercentage"] > 0
                  ? `
                ${
                  invoiceData["Sender's Tax Type"] === "IGST"
                    ? `
                        <p><strong>${invoiceData["Sender's Tax Type"]}:</strong>
                        ${currencySymbol(invoiceData["Currency"])}${
                        invoiceData.itemData["taxAmount"]
                      }</p>
                            `
                    : `
                        <p><strong>CGST:</strong>
                            ${currencySymbol(invoiceData["Currency"])}${
                        invoiceData.itemData["taxAmount"] / 2
                      }</p>
                        <p><strong>SGST:</strong>
                            ${currencySymbol(invoiceData["Currency"])}${
                        invoiceData.itemData["taxAmount"] / 2
                      }</p>
                            `
                }
                `
                  : ""
              }
          </div>
          `
            : ""
        }
          
        
        <div class="total">
          <p class="total-amount">Total: ${currencySymbol(
            invoiceData["Currency"]
          )}${invoiceData.itemData["total"]}</p>
        </div>
      </div>
      <div class="bill-to-bank-deatils" style="page-break-inside: avoid;">
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
              ? `<p>+91-${invoiceData["Receiver's Contact No"]}</p>`
              : ""
          }
          ${
            invoiceData["Receiver's Email"]
              ? `<p>${invoiceData["Receiver's Email"]}</p>`
              : ""
          }
          ${
            invoiceData["Receiver's Tax No"]
              ? `<p><span>GST No: </span>${invoiceData["Receiver's Tax No"]}</p>`
              : ""
          }
          ${
            invoiceData["Receiver's PAN No"]
              ? `<p><span>PAN No: </span>${invoiceData["Receiver's PAN No"]}</p>`
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
