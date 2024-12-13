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

  const rupeeIcon = (w = 12, h = 12, color) => {
    return `
      <svg
        fill="${color}"
        width="${w}px"
        height="${h}px"
        viewBox="-96 0 512 512"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M308 96c6.627 0 12-5.373 12-12V44c0-6.627-5.373-12-12-12H12C5.373 32 0 37.373 0 44v44.748c0 6.627 5.373 12 12 12h85.28c27.308 0 48.261 9.958 60.97 27.252H12c-6.627 0-12 5.373-12 12v40c0 6.627 5.373 12 12 12h158.757c-6.217 36.086-32.961 58.632-74.757 58.632H12c-6.627 0-12 5.373-12 12v53.012c0 3.349 1.4 6.546 3.861 8.818l165.052 152.356a12.001 12.001 0 0 0 8.139 3.182h82.562c10.924 0 16.166-13.408 8.139-20.818L116.871 319.906c76.499-2.34 131.144-53.395 138.318-127.906H308c6.627 0 12-5.373 12-12v-40c0-6.627-5.373-12-12-12h-58.69c-3.486-11.541-8.28-22.246-14.252-32H308z" />
      </svg>
    `;
  };

  invoiceData["Invoice Issue Date"] = formatDate(
    invoiceData["Invoice Issue Date"]
  );
  invoiceData["Invoice Due Date"] = invoiceData["Invoice Due Date"]
    ? formatDate(invoiceData["Invoice Due Date"])
    : "";

  const escapeHTML = (text) => {
    const div = document.createElement("div");
    div.innerText = text;
    return div.innerHTML;
  };

  const remarksUI = invoiceData["Remarks"]
    ? `
      <div class="bank-details">
                <p><strong>Notes:</strong></p>
                <p>
                  ${escapeHTML(invoiceData["Remarks"])}
                </p>
              </div>`
    : "";

  const AdvancePaidAmount =
    invoiceData["Paid Amount"] && invoiceData.itemData["total"] !== "0.0"
      ? `<p><strong>Paid Amount</strong> 
            <span>${rupeeIcon()}</span>
            ${Number(invoiceData["Paid Amount"]).toFixed(2)}
        </p> `
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
        
      .currency-symbol-cls {
        display: flex;
        justify-content: flex-end;
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
                invoiceData["Sender's Address"] || invoiceData["Sender's City"]
                  ? `<span>
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
                invoiceData["Sender's Zipcode"] || invoiceData["Sender's State"]
                  ? `<span>
                  ${
                    invoiceData["Sender's State"]
                      ? `${invoiceData["Sender's State"]}, `
                      : ""
                  }
                  ${
                    invoiceData["Sender's Zipcode"]
                      ? `${invoiceData["Sender's Zipcode"]}`
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
                    <th<div class="currency-symbol-cls">GST <span>${rupeeIcon()}</span></div></th>
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
              <td><div class="currency-symbol-cls"><span>${rupeeIcon()}</span>${
                item["price"]
              }</div></td>
              <td>${item["quantity"]}</td>
              ${
                (invoiceData.itemData["taxPercentage"] <= 0 &&
                  invoiceData.itemData["discount"] > 0) ||
                (invoiceData.itemData["taxPercentage"] > 0 &&
                  invoiceData.itemData["discount"] <= 0)
                  ? `
                    <td><div class="currency-symbol-cls"><span>${rupeeIcon()}</span>${
                      item["amount"]
                    }</div>
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
                  <td><div class="currency-symbol-cls"><span>${rupeeIcon()}</span>${
                        item["afterDiscount"]
                      }</div>
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
                    <td><div class="currency-symbol-cls"><span>${rupeeIcon()}</span>${
                        item["taxAmount"]
                      }</div></td>
                    `
                    : ""
                }
                <td><div class="currency-symbol-cls"><span>${rupeeIcon()}</span>${
                item["total"]
              }</div>
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
              <p class="currency-symbol-cls"><strong>Subtotal:</strong> <span class="currency-symbol-cls"><span>${rupeeIcon()}</span>${
                invoiceData.itemData["subTotal"]
              }</span></p>
              ${
                invoiceData.itemData["discount"] > 0
                  ? `
                  <p class="currency-symbol-cls"><strong>Discount:</strong><span class="currency-symbol-cls"><span>${rupeeIcon()}</span>${
                      invoiceData.itemData["discount"]
                    }</span></p>
                `
                  : ""
              }
              ${
                invoiceData.itemData["discount"] > 0 &&
                invoiceData.itemData["taxPercentage"] > 0
                  ? `
                    <p class="currency-symbol-cls"><strong>Net Price:</strong><span class="currency-symbol-cls"><span>${rupeeIcon()}</span>${
                      invoiceData.itemData["afterDiscountAmount"]
                    }</span></p>
                `
                  : ""
              }
              ${
                invoiceData.itemData["taxPercentage"] > 0
                  ? `
                ${
                  invoiceData["Sender's Tax Type"] === "IGST"
                    ? `
                        <p class="currency-symbol-cls"><strong>${
                          invoiceData["Sender's Tax Type"]
                        }:</strong>
                        <span class="currency-symbol-cls"><span>${rupeeIcon()}</span>${
                        invoiceData.itemData["taxAmount"]
                      }</span></p>
                            `
                    : `
                        <p class="currency-symbol-cls"><strong>CGST:</strong>
                            <span class="currency-symbol-cls"><span>${rupeeIcon()}</span>${
                        invoiceData.itemData["taxAmount"] / 2
                      }</span></p>
                        <p class="currency-symbol-cls"><strong>SGST:</strong>
                            <span class="currency-symbol-cls"><span>${rupeeIcon()}</span>${
                        invoiceData.itemData["taxAmount"] / 2
                      }</span></p>
                            `
                }
                `
                  : ""
              }
                ${AdvancePaidAmount}
          </div>
          `
            : ""
        }
          
        
        <div class="total">
          <p class="total-amount currency-symbol-cls">Total:<span class="currency-symbol-cls">${rupeeIcon(
            18,
            18,
            "#4caf50"
          )}${invoiceData.itemData["total"]}</span></p>
        </div>
      </div>

      ${remarksUI}
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
            invoiceData["Receiver's Address"] || invoiceData["Receiver's City"]
              ? `<p>
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
            invoiceData["Receiver's Zipcode"] || invoiceData["Receiver's State"]
              ? `<p>
              ${
                invoiceData["Receiver's State"]
                  ? `${invoiceData["Receiver's State"]}, `
                  : ""
              }
              ${
                invoiceData["Receiver's Zipcode"]
                  ? `${invoiceData["Receiver's Zipcode"]}`
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
