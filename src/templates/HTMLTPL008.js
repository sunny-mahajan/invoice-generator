export default function generateHTMLTPL003(invoiceData) {
  let isDescriptionAvailable = false;

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

  const escapeHTML = (text) => {
    const div = document.createElement("div");
    div.innerText = text;
    return div.innerHTML;
  };

  const remarksUI = invoiceData["Remarks"]
    ? `<div class="bank-details-container" style="page-break-inside: avoid;">
                   <h2>Notes:</h2>
                   <div class="sub-bank-details-container">
                   <span class="sub-bank-details-value">${escapeHTML(
                     invoiceData["Remarks"]
                   )}</span>
                  </div>
              </div>`
    : "";

  const AdvancePaidAmount =
    invoiceData["Paid Amount"] && invoiceData.itemData["total"] !== "0.0"
      ? `<div>
          <p class="total-title-cls">Paid Amount:</p>
            <p>
              <span class="currency-symbol-cls">${currencySymbol(
                invoiceData["Currency"]
              )}</span>
              ${Number(invoiceData["Paid Amount"]).toFixed(2)}
            </p>
        </div> `
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
    <title>Invoice Template</title>
    <style>
        .invoice-container {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background: linear-gradient(135deg, #7e57c2, #64b5f6);
            color: #fff;
            padding: 20px;
        }
        .invoice-container p, .invoice-container span {
            color: #fff !important;
        }
        .bill-ship {
            display: flex;
            justify-content: space-between;
            margin-top: 20px;
            gap: 20px;
        }

        .bill-ship p {
            margin: 8px 0;
            max-width: 270px;
            word-break: break-word;
        }

        .bill-ship .bill, .bill-ship .ship {
            max-width: 270px;
        }
        .invoice-content {
            padding: 10px;
            border: 2px solid rgba(255, 255, 255, 0.5);
        }
        .invoice-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.5);
            padding-bottom: 10px;
        }

        .invoice-header h1 {
            font-size: 28px;
            margin: 0;
        }

        .invoice-details {
            margin-bottom: 20px;
        }

        .invoice-details div p, .invoice-details div span  {
            font-size: 14px;
        }

        .invoice-details-heading {
            width: 120px;
            display: inline-block;
            font-weight: bold;
        }
        .bank-details-container {
            margin-top: 20px;
            font-size: 12px;
            max-width: 500px;
        }

        .bank-details-container .sub-bank-details-container {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 7px;
        }

        .bank-details-container .sub-bank-details-title {
            width: 165px;
        }
        .bank-details-container .sub-bank-details-value {
            max-width: 320px;
            word-break: break-word;
        }
        .invoice-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }

        .invoice-logo {
            width: 80px;
            height: auto;
            max-height: 80px;
            object-fit: contain;
        }

        .invoice-table th,
        .invoice-table td {
            text-align: right;
            padding: 8px;
            border: 1px solid rgba(255, 255, 255, 0.5);
        }

        .invoice-table td {
          word-break: break-word;
        }

        .invoice-table th {
            background: rgba(255, 255, 255, 0.2);
            text-align: center;
        }

        .invoice-table .item-name-cls {
            text-align: center;
            max-width: 150px;
        }
        .invoice-table td:first-child {
          text-align: center;
        }
        .invoice-total-container {
          display: flex;
          width: 100%;
          justify-content: flex-end;
        }
        .invoice-total {
          font-size: 16px;
          margin-top: 10px;
        }
        .invoice-total div {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .invoice-total div p {
            margin: 3px 0; /* Prevent extra spacing */
            padding: 0; /* Prevent extra padding */
            word-break: break-word;
        }
        .total-title-cls {
            min-width: 150px;
        }
        .currency-symbol-cls {
          font-size: 18px;
        }
    
    </style>
  </head>
  <body>
    <div class="invoice-container">
      <div class="invoice-content">
        <div class="invoice-header">
          <h1>INVOICE</h1>
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

        <div class="invoice-details">
          <div class="bill-ship">
            <div class="bill">
                <h2>BILL TO</h2>
                ${
                  invoiceData["Sender's Name"]
                    ? `<p>${invoiceData["Sender's Name"]}</p>`
                    : ""
                }
                
                ${
                  invoiceData["Sender's Address"] ||
                  invoiceData["Sender's City"]
                    ? `<p>
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
                  invoiceData["Sender's Zipcode"] ||
                  invoiceData["Sender's State"]
                    ? `<p>
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
                </p>`
                    : ""
                }
                
                ${
                  invoiceData["Sender's Contact No"]
                    ? `<p>+91-${invoiceData["Sender's Contact No"]}</p>`
                    : ""
                }
                ${
                  invoiceData["Sender's Email"]
                    ? `<p>${invoiceData["Sender's Email"]}</p>`
                    : ""
                }
                ${
                  invoiceData["Sender's Tax No"]
                    ? `<p><span>GST No: </span>${invoiceData["Sender's Tax No"]}</p>`
                    : ""
                }
                ${
                  invoiceData["Sender's PAN No"]
                    ? `<p><span>PAN No: </span>${invoiceData["Sender's PAN No"]}</p>`
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
                        <div style="display: flex; align-items: center; margin: 8px 0;">
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
            <div class="ship">
                <h2>SHIP TO</h2>
                ${
                  invoiceData["Receiver's Name"]
                    ? `<p>${invoiceData["Receiver's Name"]}</p>`
                    : ""
                }
                
                ${
                  invoiceData["Receiver's Address"] ||
                  invoiceData["Receiver's City"]
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
                  invoiceData["Receiver's Zipcode"] ||
                  invoiceData["Receiver's State"]
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
                        <div style="display: flex; align-items: center; margin: 8px 0;">
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
                ${
                  invoiceData["Invoice Due Date"]
                    ? `
                    <div>
                        <span class="invoice-details-heading" style="margin: 0 0 8px 0;">DUE DATE</span><span>${invoiceData["Invoice Due Date"]}</span>
                    </div>`
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
                            ? `
                            <div>
                            <span class="invoice-details-heading" style="margin: 0 0 8px 0;">${item["fieldName"]}</span><span>${item["fieldValue"]}
                            </span>
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

        <table class="invoice-table">
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
                    <th>GST <span class="currency-symbol-cls">${currencySymbol(
                      invoiceData["Currency"]
                    )}</span></th>
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
              <td><span class="currency-symbol-cls">${currencySymbol(
                invoiceData["Currency"]
              )}</span>${item["price"]}</td>
              <td>${item["quantity"]}</td>
              ${
                (invoiceData.itemData["taxPercentage"] <= 0 &&
                  invoiceData.itemData["discount"] > 0) ||
                (invoiceData.itemData["taxPercentage"] > 0 &&
                  invoiceData.itemData["discount"] <= 0)
                  ? `
                  <td><span class="currency-symbol-cls">${currencySymbol(
                    invoiceData["Currency"]
                  )}</span>${item["amount"]}
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
                <td><span class="currency-symbol-cls">${currencySymbol(
                  invoiceData["Currency"]
                )}</span>${item["afterDiscount"]}
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
                  <td><span class="currency-symbol-cls">${currencySymbol(
                    invoiceData["Currency"]
                  )}</span>${item["taxAmount"]}</td>
                  `
                  : ""
              }
              <td><span class="currency-symbol-cls">${currencySymbol(
                invoiceData["Currency"]
              )}</span>${item["total"]}
              </td>
            </tr>`
            )
            .join("")}
          </tbody>
        </table>
        <div class="invoice-total-container" style="page-break-inside: avoid;">
            <div class="invoice-total">
                ${
                  invoiceData.itemData["taxPercentage"] > 0 ||
                  invoiceData.itemData["discount"] > 0
                    ? `
                        <div>
                            <p class="total-title-cls">Subtotal:</p>
                            <p>
                                <span class="currency-symbol-cls">${currencySymbol(
                                  invoiceData["Currency"]
                                )}</span>${invoiceData.itemData["subTotal"]}
                            </p>
                        </div>
                        ${
                          invoiceData.itemData["discount"] > 0
                            ? `
                          <div>
                            <p class="total-title-cls">Discount</p>
                            <p><span class="currency-symbol-cls">${currencySymbol(
                              invoiceData["Currency"]
                            )}</span>${invoiceData.itemData["discount"]}</p>
                          </div>
                          `
                            : ""
                        }
                        ${
                          invoiceData.itemData["discount"] > 0 &&
                          invoiceData.itemData["taxPercentage"] > 0
                            ? `
                          <div>
                            <p class="total-title-cls">Net Price</p>
                            <p><span class="currency-symbol-cls">${currencySymbol(
                              invoiceData["Currency"]
                            )}</span>${
                                invoiceData.itemData["afterDiscountAmount"]
                              }</p>
                          </div>
                          `
                            : ""
                        }
                        ${
                          invoiceData.itemData["taxPercentage"] > 0
                            ? `
                            ${
                              invoiceData["Sender's Tax Type"] === "IGST"
                                ? `
                                <div>
                                    <p class="total-title-cls">${
                                      invoiceData["Sender's Tax Type"]
                                    }:</p>
                                    <p> <span class="currency-symbol-cls">${currencySymbol(
                                      invoiceData["Currency"]
                                    )}</span>${
                                    invoiceData.itemData["taxAmount"]
                                  }</p>
                                </div>
                                        `
                                : `
                                <div>
                                    <p class="total-title-cls">CGST:</p>
                                        <p> <span class="currency-symbol-cls">${currencySymbol(
                                          invoiceData["Currency"]
                                        )}</span>${
                                    invoiceData.itemData["taxAmount"] / 2
                                  }</p>
                                </div>
                                <div>
                                    <p class="total-title-cls">SGST:</p>
                                        <p> <span class="currency-symbol-cls">${currencySymbol(
                                          invoiceData["Currency"]
                                        )}</span>${
                                    invoiceData.itemData["taxAmount"] / 2
                                  }</p>
                                </div>
                              `
                            }
                          `
                            : ""
                        }
                        ${AdvancePaidAmount}
                    `
                    : ""
                }
                <div>
                    <p class="total-title-cls" style="font-size: 24px;"><strong>Total:</strong></p>
                    <p><span class="currency-symbol-cls">${currencySymbol(
                      invoiceData["Currency"]
                    )}</span>${invoiceData.itemData["total"]}</strong></p>
                </div>
            </div>
        </div>
        ${remarksUI}
        ${
          bankDetailsAvailable
            ? `<div class="bank-details-container" style="page-break-inside: avoid;">
            <h2>Bank Details</h2>
            ${
              invoiceData["Bank Name"]
                ? `
            <div class="sub-bank-details-container">
                <span class="sub-bank-details-title">Bank Name:</span><span class="sub-bank-details-value">${invoiceData["Bank Name"]}</span>
            </div>`
                : ""
            }
            ${
              invoiceData["Account No"]
                ? `
            <div class="sub-bank-details-container">
                <span class="sub-bank-details-title">A/c No:</span><span class="sub-bank-details-value">${invoiceData["Account No"]}</span>
            </div>`
                : ""
            }
            ${
              invoiceData["Account Holder Name"]
                ? `
            <div class="sub-bank-details-container">
                <span class="sub-bank-details-title">A/c Holder Name:</span><span class="sub-bank-details-value">${invoiceData["Account Holder Name"]}</span>
            </div>`
                : ""
            }
            ${
              invoiceData["IFSC Code"]
                ? `
            <div class="sub-bank-details-container">
                <span class="sub-bank-details-title">IFSC Code:</span><span class="sub-bank-details-value">${invoiceData["IFSC Code"]}</span>
            </div>`
                : ""
            }
            ${
              invoiceData["Account Type"]
                ? `
            <div class="sub-bank-details-container">
                <span class="sub-bank-details-title">A/c Type:</span><span class="sub-bank-details-value">${invoiceData["Account Type"]}</span>
            </div>`
                : ""
            }
            ${
              invoiceData["Bank Address"]
                ? `
              <div class="sub-bank-details-container">
                  <span class="sub-bank-details-title">Bank Address:</span><span class="sub-bank-details-value">${invoiceData["Bank Address"]}</span>
              </div>`
                : ""
            }
            </div>`
            : ""
        }
      </div>
    </div>
  </body>
</html>
      `;
}
