export default function generateHTMLTPL004(invoiceData) {
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

  const currencySymbol = () => "₹";

  invoiceData["Invoice Issue Date"] = formatDate(
    invoiceData["Invoice Issue Date"]
  );
  invoiceData["Invoice Due Date"] = invoiceData["Invoice Due Date"]
    ? formatDate(invoiceData["Invoice Due Date"])
    : "";

  const bankDetailsAvailable =
    invoiceData["Bank"] ||
    invoiceData["Account No"] ||
    invoiceData["Account Holder Name"] ||
    invoiceData["IFSC Code"] ||
    invoiceData["Bank Address"];

  const calculateColumnSpan = (itemData) => {
    const { discount, taxPercentage } = itemData;
    if ((discount > 0 && taxPercentage > 0) || taxPercentage > 0) return "7";
    return discount > 0 ? "6" : "4";
  };

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
      ? `<tr>
          <td 
            colspan=${calculateColumnSpan(invoiceData.itemData)}
             style="text-align:right; border: none;">
             Paid Amount
          </td>
          <td style="text-align:right">
            <span class="currency-symbol-cls">${currencySymbol()}</span>
            ${Number(invoiceData["Paid Amount"]).toFixed(2)}
          </td>
        </tr>
      `
      : "";

  return `
      <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://fonts.googleapis.com/css2?family=Spartan:wght@100..900&display=swap" rel="stylesheet" ></link>
    <title>Invoice</title>
    <style>
    body {
        margin: 0 auto;
        padding: 20px;
        font-family: 'Spartan', sans-serif;
    }

    .container-cls h2 {
        font-size: 18px;
        margin-bottom: 5px;
        font-weight: bold;
        margin: 0 ;
    }

    .container-cls p {
        margin: 0;
        color: #000000 !important;
    }

    h1 {
        font-size: 36px;
        font-family: 'Courier New', Courier, monospace;
    }

    .header-cls {
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;
    }

    .header-cls div {
        width: 45%;
    }

    .header-cls div p {
        margin: 8px 0;
    }

    .invoice-info, .billing-info {
        margin-bottom: 20px;
    }

    .invoice-info p, .billing-info p {
        margin: 8px 0;
        width: 100%;
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
        background-color: #d9d9d9;
    }

    .product-description td {
        border: 1px solid #000;
        padding: 8px;
        text-align: right;
        word-break: break-word;
    }
    .product-description td:first-child {
      text-align: center;
    }
    .product-description .item-name-cls {
        max-width: 150px;
        text-align: center !important;
    }
    .product-description .item-name-cls p{
      color: #555555 !important;
    }

    .product-description .item-cls {
        text-align: left !important;
        width: 200px;
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

    .footer-cls {
        display: flex;
        justify-content: space-between;
    }

    .footer-cls .bill-info-cls, .footer-cls .bank-details-container {
        margin-top: 20px;
        max-width: 400px;
    }

    .footer-cls p {
        margin: 8px 0;
    }

    .bank-details-container .sub-bank-details-container {
        display: flex;
        align-items: center;
        gap: 10px;
        margin: 8px 0;
        width: 100%;
    }

    .bank-details-container .sub-bank-details-title {
        width: 135px;
    }

    .bank-details-container .sub-bank-details-value {
        max-width: 255px;
        word-break: break-all;
    }

    .invoice-logo {
        width: 100px;
        height: auto;
        max-height: 100px;
        object-fit: contain;
    }

    .title-logo {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
    }

    .bill-info-cls {
      max-width: 300px;
      word-break: break-all;
    }

    .notes {
        margin-top: 25px;
    }

    .currency-symbol-cls {
      font-size: 18px;
    }
</style>

</head>
<body>
<div class="container-cls">
    <div class="title-logo">
        <h1>Invoice</h1>
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
    <div class="header-cls">
        <div class="bill-info-cls">
           <h2>TO:</h2>
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
                            <p style="margin: 0;>${item["fieldName"]}:</p><p style="margin: 0;"> ${item["fieldValue"]}</p>
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
            <p><strong>Invoice #</strong>: ${invoiceData["Invoice No."]}</p>
            <p><strong>Date</strong>: ${invoiceData["Invoice Issue Date"]}</p>
            ${
              invoiceData["Invoice Due Date"]
                ? `<p><strong>Due Date</strong>: ${invoiceData["Invoice Due Date"]}</p>`
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
                        <p><strong>${item["fieldName"]}</strong>: ${item["fieldValue"]}</p>
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

    <div class="product-description">
        <table>
            <thead>
                <tr>
                    <th>No.</th>
                    <th>Item Name</th>
                    <th>Price</th>
                    <th>Qty</th>
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
                        ? `<th style="min-width:75px">GST %</th>
                        `
                        : ""
                    }
                    ${
                      invoiceData.itemData["taxPercentage"] > 0 &&
                      invoiceData.itemData["discount"] <= 0
                        ? `
                        <th>GST <span class="currency-symbol-cls">${currencySymbol()}</span></th>
                      `
                        : ""
                    }
                    <th>TOTAL</th>
                </tr>
            </thead>
            <tbody>
            ${invoiceData["Items"]
              .map(
                (item, index) => `
                  <tr style="page-break-inside: avoid;">
                    <td >${index + 1}</td>
                    <td class="item-name-cls">${item["name"]}
                    ${
                      isDescriptionAvailable
                        ? `<p>${item["description"]}</p>`
                        : ""
                    }
                    </td>
                    <td><span class="currency-symbol-cls">${currencySymbol()}</span>${
                  item["price"]
                }</td>
                    <td>${item["quantity"]}</td>
                      ${
                        (invoiceData.itemData["taxPercentage"] <= 0 &&
                          invoiceData.itemData["discount"] > 0) ||
                        (invoiceData.itemData["taxPercentage"] > 0 &&
                          invoiceData.itemData["discount"] <= 0)
                          ? `
                          <td><span class="currency-symbol-cls">${currencySymbol()}</span>${
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
                          <td><span class="currency-symbol-cls">${currencySymbol()}</span>${
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
                          <td><span class="currency-symbol-cls">${currencySymbol()}</span>${
                              item["taxAmount"]
                            }</td>
                          `
                          : ""
                      }
                      <td><span class="currency-symbol-cls">${currencySymbol()}</span>${
                  item["total"]
                }
                      </td>
                  </tr>
              `
              )
              .join("")}
                
              ${
                invoiceData.itemData["taxPercentage"] > 0 ||
                invoiceData.itemData["discount"] > 0
                  ? `
                <tr>
                  <td colspan=${calculateColumnSpan(
                    invoiceData.itemData
                  )} style="text-align:right !important; border: none;">Sub Total</td>
                  <td style="width: auto; text-align:right !important;"><span class="currency-symbol-cls">${currencySymbol()}</span>${
                      invoiceData.itemData["subTotal"]
                    }</td>
                </tr>
                ${
                  invoiceData.itemData["discount"] > 0
                    ? `
                        <tr>
                          <td colspan=${calculateColumnSpan(
                            invoiceData.itemData
                          )} style="text-align:right; border: none;">Discount</td>
                          <td style="text-align:right"><span class="currency-symbol-cls">${currencySymbol()}</span>${
                        invoiceData.itemData["discount"]
                      }</td>
                        </tr>
                        `
                    : ""
                }
                ${
                  invoiceData.itemData["discount"] > 0 &&
                  invoiceData.itemData["taxPercentage"] > 0
                    ? `
                  <tr>
                    <td colspan=${calculateColumnSpan(
                      invoiceData.itemData
                    )} style="text-align:right; border: none;">Net Price</td>
                    <td><span class="currency-symbol-cls">${currencySymbol()}</span>${
                        invoiceData.itemData["afterDiscountAmount"]
                      }</td>
                  </tr>
                  `
                    : ""
                }
                ${
                  invoiceData.itemData["taxPercentage"] > 0
                    ? `
                      ${
                        invoiceData["Sender's Tax Type"] === "IGST"
                          ? `
                          <tr>
                            <td colspan=${calculateColumnSpan(
                              invoiceData.itemData
                            )}  style="text-align:right !important; border: none;">${
                              invoiceData["Sender's Tax Type"]
                            }</td>
                            <td style="width: auto; text-align:right !important;"><span class="currency-symbol-cls">${currencySymbol()}</span>${
                              invoiceData.itemData["taxAmount"]
                            }</td>
                          </tr>
                              `
                          : `
                          <tr>
                            <td colspan=${calculateColumnSpan(
                              invoiceData.itemData
                            )} style="text-align:right !important; border: none;">CGST</td>
                            <td style="width: auto; text-align:right !important;"><span class="currency-symbol-cls">${currencySymbol()}</span>${
                              invoiceData.itemData["taxAmount"] / 2
                            }</td>
                          </tr>
                          <tr>
                            <td colspan=${calculateColumnSpan(
                              invoiceData.itemData
                            )} style="text-align:right !important; border: none;">SGST</td>
                            <td style="width: auto; text-align:right !important;"><span class="currency-symbol-cls">${currencySymbol()}</span>${
                              invoiceData.itemData["taxAmount"] / 2
                            }</td>
                          </tr>
                        `
                      }
                    `
                    : ""
                }
               
                `
                  : ""
              }
              
                ${AdvancePaidAmount}
                <tr>
                    <td colspan=${calculateColumnSpan(
                      invoiceData.itemData
                    )} style="text-align:right !important; border: none;"><strong>Total Due</strong></td>
                    <td style="background-color: #d9d9d9; width: auto; text-align:right !important"><strong><span class="currency-symbol-cls">${currencySymbol()}</span>${
    invoiceData.itemData["total"]
  }</strong></td>
                </tr>
            </tbody>
        </table>
    </div>
    ${remarksUI}
    <div class="footer-cls" style="page-break-inside: avoid;">
        <div class="bill-info-cls">
        <h2>FROM:</h2>
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
        ${
          bankDetailsAvailable
            ? `<div class="bank-details-container">
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
                ? `<div class="sub-bank-details-container">
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
