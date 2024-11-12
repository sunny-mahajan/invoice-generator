export default function generateHTMLTPL004(invoiceData) {
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
  // Calculate tax amount
  // const taxAmount = (subAmount * taxPercentage) / 100;

  // Calculate the total amount
  // const totalAmount = subAmount + taxAmount;

  const remarksUI = invoiceData["Remarks"]
    ? `<div class="notes">
              <p>Notes:</p>
              <p>${invoiceData["Remarks"]}</p>
          </div>`
    : "";

  const bankDetailsAvailable =
    invoiceData["Bank"] ||
    invoiceData["Account No"] ||
    invoiceData["Account Holder Name"] ||
    invoiceData["IFSC Code"] ||
    invoiceData["Bank Address"];

  return `
      <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice</title>
    <style>
    body {
        font-family: "Spartan";
        margin: 0 auto;
        padding: 20px;
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

    .header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;
    }

    .header div {
        width: 45%;
    }

    .header div p {
        margin: 10px 0;
    }

    .invoice-info, .billing-info {
        margin-bottom: 20px;
    }

    .invoice-info p, .billing-info p {
        margin: 10px 0;
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
    }

    .product-description .item-name-cls {
        max-width: 150px;
        text-align: center !important;
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

    .footer-cls div {
        margin-top: 20px;
    }

    .footer-cls p {
        margin: 10px 0;
    }

    .bank-details-container .sub-bank-details-container {
        display: flex;
        align-items: center;
        gap: 10px;
        margin: 10px 0;
        width: 100%;
    }

    .bank-details-container .sub-bank-details-title {
        width: 165px;
    }

    .invoice-logo {
        width: 100px;
        height: 100px;
        object-fit: contain;
        position: absolute;
        top: 0;
        right: 0;
    }

    .title-logo {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 70px;
        position: relative;
    }

    .notes {
        margin-top: 25px;
    }
</style>

</head>
<body>
<div class="container-cls">
    <div class="${invoiceData["Logo"] ? "title-logo logo-preview" : ""}">
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
    <div class="header">
        <div>
           <h2>TO:</h2>
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
                    <th>Item Name</th>
                    ${isDescriptionAvailable ? "<th>Description</th>" : ""}
                    <th>Qty</th>
                    <th>Price</th>
                    <th>AMOUNT</th>
                    <th>TAX %</th>
                    <th>TAX ${currencySymbol(invoiceData["Currency"])}</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
            ${invoiceData["Items"]
              .map(
                (item) => `
                  <tr>
                      <td class="item-name-cls">${item["name"]}</td>
                      ${
                        isDescriptionAvailable
                          ? `<td class="item-cls">${item["description"]}</td>`
                          : ""
                      }
                      <td>${item["quantity"]}</td>
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
                  item["price"] *
                    item["quantity"] *
                    (item["taxPercentage"] / 100)
                }
          </td>
                  </tr>
              `
              )
              .join("")}
                
              ${
                taxPercentage > 0
                  ? `
                <tr>
                  <td colspan="${
                    isDescriptionAvailable ? "7" : "6"
                  }" style="text-align:right !important; border: none;">Sub Total</td>
                  <td style="width: auto; text-align:right !important;">${currencySymbol(
                    invoiceData["Currency"]
                  )}${subAmount.toFixed(1)}</td>
                </tr>
                ${
                  invoiceData["Sender's Tax Type"] === "IGST"
                    ? `
                <tr>
                  <td colspan="${
                    isDescriptionAvailable ? "7" : "6"
                  }" style="text-align:right !important; border: none;">${
                        invoiceData["Sender's Tax Type"]
                      } (${taxPercentage.toFixed(1)}%)</td>
                  <td style="width: auto; text-align:right !important;">${currencySymbol(
                    invoiceData["Currency"]
                  )}${taxAmount.toFixed(1)}</td>
                </tr>
                    `
                    : `
                <tr>
                  <td colspan="${
                    isDescriptionAvailable ? "7" : "6"
                  }" style="text-align:right !important; border: none;">CGST (${(
                        taxPercentage / 2
                      ).toFixed(1)}%)</td>
                  <td style="width: auto; text-align:right !important;">${currencySymbol(
                    invoiceData["Currency"]
                  )}${(taxAmount / 2).toFixed(1)}</td>
                </tr>
                <tr>
                  <td colspan="${
                    isDescriptionAvailable ? "7" : "6"
                  }" style="text-align:right !important; border: none;">SGST (${(
                        taxPercentage / 2
                      ).toFixed(1)}%)</td>
                  <td style="width: auto; text-align:right !important;">${currencySymbol(
                    invoiceData["Currency"]
                  )}${(taxAmount / 2).toFixed(1)}</td>
                </tr>
                    `
                }
                `
                  : ""
              }
              
                
                <tr>
                    <td colspan="${
                      isDescriptionAvailable ? "7" : "6"
                    }" style="text-align:right !important; border: none;"><strong>Total Due</strong></td>
                    <td style="background-color: #d9d9d9; width: auto; text-align:right !important"><strong>${currencySymbol(
                      invoiceData["Currency"]
                    )}${totalAmount.toFixed(1)}</strong></td>
                </tr>
            </tbody>
        </table>
    </div>

    

    <div class="footer-cls">
        <div>
        <h2>FROM:</h2>
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
            ${
              invoiceData["Bank Address"]
                ? `<div class="sub-bank-details-container">
            <span class="sub-bank-details-title">Bank Address:</span><span>${invoiceData["Bank Address"]}</span>
        </div>`
                : ""
            }
        </div>`
            : ""
        }
       

    </div>
    ${remarksUI}
  </div>
</body>
</html>
      `;
}
