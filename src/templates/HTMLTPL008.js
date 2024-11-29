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
        }
        .total-title-cls {
            min-width: 150px;
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
              <td>${currencySymbol(invoiceData["Currency"])}${
                item["price"]
              }</td>
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
        <div class="invoice-total-container" style="page-break-inside: avoid;">
            <div class="invoice-total">
                ${
                  taxPercentage > 0
                    ? `
                        <div>
                            <p class="total-title-cls">Subtotal:</p>
                            <p>
                                ${currencySymbol(
                                  invoiceData["Currency"]
                                )}${subAmount.toFixed(1)}
                            </p>
                        </div>
                        ${
                          invoiceData["Sender's Tax Type"] === "IGST"
                            ? `
                            <div>
                                <p class="total-title-cls">${
                                  invoiceData["Sender's Tax Type"]
                                } (${taxPercentage.toFixed(1)}%):</p>
                                <p> ${currencySymbol(
                                  invoiceData["Currency"]
                                )}${taxAmount.toFixed(1)}</p>
                            </div>
                                    `
                            : `
                            <div>
                                <p class="total-title-cls">CGST (${(
                                  taxPercentage / 2
                                ).toFixed(1)}%):</p>
                                    <p> ${currencySymbol(
                                      invoiceData["Currency"]
                                    )}${(taxAmount / 2).toFixed(1)}</p>
                            </div>
                            <div>
                                <p class="total-title-cls">SGST (${(
                                  taxPercentage / 2
                                ).toFixed(1)}%):</p>
                                    <p> ${currencySymbol(
                                      invoiceData["Currency"]
                                    )}${(taxAmount / 2).toFixed(1)}</p>
                            </div>
                                    `
                        }
                    `
                    : ""
                }
                <div>
                    <p class="total-title-cls" style="font-size: 24px;"><strong>Total:</strong></p>
                    <p>${currencySymbol(
                      invoiceData["Currency"]
                    )}${totalAmount.toFixed(1)}</strong></p>
                </div>
            </div>
        </div>

        ${
          bankDetailsAvailable
            ? `<div class="bank-details-container" style="page-break-inside: avoid;">
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
            ${
              invoiceData["Bank Address"]
                ? `
              <div class="sub-bank-details-container">
                  <span class="sub-bank-details-title">Bank Address:</span><span>${invoiceData["Bank Address"]}</span>
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
