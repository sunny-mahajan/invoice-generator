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

  const rupeeIcon = (w = 13, h = 13, color = "#000000") => {
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
    ? ` <div class="bank-details-cls">
              <h3>Notes:</h3>
              <p>${escapeHTML(invoiceData["Remarks"])}</p>
          </div>`
    : "";

  const AdvancePaidAmount =
    invoiceData["Paid Amount"] && invoiceData.itemData["total"] !== "0.0"
      ? `<div class="sub-sec5-item">
            <p class="sub-sec5-title">Paid Amount</p>
            <span class="currency-symbol-cls">
              <span>${rupeeIcon()}</span>
              ${Number(invoiceData["Paid Amount"]).toFixed(2)}
            </span>
          </div>
        `
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

      .invoice-table td {
        word-break: break-word;
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
        width: 32%;
        margin-top: 20px;
      }
      .invoice-details-cls h3,
      .bank-details-cls h3 {
        font-size: 18px;
        color: #2c3e50;
        margin-bottom: 10px;
      }

      .invoice-summary .invoice-details-cls p, .invoice-summary .bank-details-cls p, .invoice-summary .totals p {
        word-break: break-all;
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

      .sub-sec5-container .sub-sec5-item span {
        word-break: break-all;
      }
      .sub-sec5-container {
        display: flex;
        flex-direction: column;
        gap: 5px;
      }

      .currency-symbol-cls {
        display: flex;
        justify-content: flex-end;
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
            invoiceData["Sender's Address"] || invoiceData["Sender's City"]
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
            invoiceData["Sender's Zipcode"] || invoiceData["Sender's State"]
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
          ${invoiceData.itemData["discount"] > 0 ? `<th>Discount</th>` : ""}
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
              ? `<th style="min-width:80px">GST %</th>
              `
              : ""
          }
          ${
            invoiceData.itemData["taxPercentage"] > 0 &&
            invoiceData.itemData["discount"] <= 0
              ? `
              <th><div class="currency-symbol-cls">GST <span>${rupeeIcon(
                15,
                15,
                "#fff"
              )}</span></div></th>
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
                  }
              </div>
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
                } </div></td>
              `
              : ""
          }
          <td><div class="currency-symbol-cls"><span>${rupeeIcon()}</span>${
              item["total"]
            }
            </div>
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
                   invoiceData.itemData["taxPercentage"] > 0 ||
                   invoiceData.itemData["discount"] > 0
                     ? `
                  <div class="sub-sec5-item">
                        <p class="sub-sec5-title">Subtotal</p><span class="currency-symbol-cls"><span>${rupeeIcon()}</span>${
                         invoiceData.itemData["subTotal"]
                       }</span>
                    </div>
                    ${
                      invoiceData.itemData["discount"] > 0
                        ? `
                      <div class="sub-sec5-item">
                        <p class="sub-sec5-title">Discount</p>
                        <span class="currency-symbol-cls"><span>${rupeeIcon()}</span>${
                            invoiceData.itemData["discount"]
                          }</span>
                      </div>
                      `
                        : ""
                    }
                    ${
                      invoiceData.itemData["discount"] > 0 &&
                      invoiceData.itemData["taxPercentage"] > 0
                        ? `
                      <div class="sub-sec5-item">
                        <p class="sub-sec5-title">Net Price</p>
                        <span class="currency-symbol-cls"><span>${rupeeIcon()}</span>${
                            invoiceData.itemData["afterDiscountAmount"]
                          }</span>
                      </div>
                      `
                        : ""
                    }
                    ${
                      invoiceData.itemData["taxPercentage"] > 0
                        ? `
                        <div class="sub-sec5-item">
                          ${
                            invoiceData["Sender's Tax Type"] === "IGST"
                              ? `
                          <p class="sub-sec5-title">${
                            invoiceData["Sender's Tax Type"]
                          }</p><span class="currency-symbol-cls"><span>${rupeeIcon()}</span>${
                                  invoiceData.itemData["taxAmount"]
                                }</span>
                          `
                              : `
                              <div style="display: flex; align-items: center; flex-direction: column; gap: 5px; width: 100%;">
                                <div style="display: flex; align-items: center; width: 100%; justify-content: space-between;">
                                  <p class="sub-sec5-title">CGST</p><span><span class="currency-symbol-cls">${rupeeIcon()}</span>${
                                  invoiceData.itemData["taxAmount"] / 2
                                }</span>
                                </div>
                                <div style="display: flex; align-items: center; width: 100%; justify-content: space-between;">
                                  <p class="sub-sec5-title">SGST</p><span class="currency-symbol-cls"><span>${rupeeIcon()}</span>${
                                  invoiceData.itemData["taxAmount"] / 2
                                }</span>
                                </div>
                              </div>
                          `
                          } 
                        </div>
                        `
                        : ""
                    }
                    `
                     : ""
                 }
                 ${AdvancePaidAmount}
                     <div class="sub-sec5-item">
                        <h2 class="sub-sec5-title">Total</h2><span class="currency-symbol-cls"><span>${rupeeIcon(
                          15,
                          15
                        )}</span>${invoiceData.itemData["total"]}</span>
                     </div>
                </div>
        </div>
      </div>
      ${remarksUI}
    </div>
  </body>
</html>

      `;
}
