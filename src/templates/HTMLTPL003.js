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
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="https://fonts.googleapis.com/css2?family=Spartan:wght@100..900&display=swap" rel="stylesheet" ></link>
  <title>Invoice Template</title>
  <style>
    body {
        margin: 0;
        padding: 0;
        font-family: 'Spartan', sans-serif;
    }

    .temp3-container-cls {
        margin-top: 20px;
        padding: 20px;
        border-top: #007BFF solid 20px;
    }

    .temp3-container-cls p {
        color: #000000 !important;
    }

    .temp3-container-cls h2 {
        font-size: 18px;
        margin-bottom: 5px;
        font-weight: bold;
    }

    .header-cls {
        display: flex;
        justify-content: space-between;
        padding-bottom: 10px;
    }

    .company-info {
        text-align: left;
    }

    .company-info p {
        max-width: 200px;
    }

    .invoice-title {
        text-align: right;
        font-size: 24px;
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
        gap: 20px;
    }

    .bill-ship p {
        margin: 8px 0;
        max-width: 270px;
        word-break: break-word;
    }

    .bill-ship .bill, .bill-ship .ship {
        max-width: 270px;
        width: 100%;
    }

    .invoice-info {
      width: 100%;
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

    .items .item-name-cls {
        text-align: center;
        max-width: 150px;
    }

    .total-section {
        margin: 30px 0;
    }

    .total-details {
        padding: 15px 0;
        border-top: 2px solid;
        border-bottom: 4px solid;
        display: flex;
        justify-content: space-between;
    }

    .total-details h1 {
        margin: 0;
    }

    .invoice-title h1 {
        margin: 0;
        font-size: 32px;
    }

    .bank-details-container {
        margin-top: 20px;
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

    .footer-cls {
        margin-top: 25px;
        text-align: right;
    }

    .invoice-logo {
        width: 100px;
        height: auto;
        max-height: 100px;
        object-fit: contain;
    }
</style>

</head>
<body>
  <div class="temp3-container-cls">
  
    <div class="header-cls">
        <div class="invoice-title">
          <h1><strong>INVOICE</strong></h1>
        </div>
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
                <div style="display: flex; align-items: center; margin: 8px 0;">
                    <p style="margin: 0;>${item["fieldName"]}:</p><p style="margin: 0;> ${item["fieldValue"]}</p>
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
            <span class="invoice-details-heading" style="margin: 0 0 8px 0;">DATE</span><span style="min-width:200px">${
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

    <div class="total-section">
        <div class="total-details">
            <h1><strong>Invoice Total</strong></h1>
            <h1><strong>${currencySymbol(
              invoiceData["Currency"]
            )}${totalAmount.toFixed(1)}</strong></h1>
        </div>
    </div>

    <table class="items">
      <thead>
        <tr>
          <th>#</th>
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
          ${isDescriptionAvailable ? `<p >${item["description"]}</p>` : ""}
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
        ${
          taxPercentage > 0
            ? `
          <tr>
            <td colspan="7" style="text-align:right; padding-top: 30px;">Subtotal</td>
            <td style="padding-top: 30px;text-align:right; width: auto">${currencySymbol(
              invoiceData["Currency"]
            )}${subAmount.toFixed(1)}</td>
          </tr>
          ${
            invoiceData["Sender's Tax Type"] === "IGST"
              ? `
          <tr>
            <td colspan="7" style="text-align:right;">(${
              invoiceData["Sender's Tax Type"]
            } ${taxPercentage.toFixed(1)}%)</td>
            <td style="text-align:right; width: auto">${currencySymbol(
              invoiceData["Currency"]
            )}${taxAmount.toFixed(1)}</td>
          </tr>
              `
              : `
          <tr>
            <td colspan="7" style="text-align:right;">CGST (${(
              taxPercentage / 2
            ).toFixed(2)}%)</td>
            <td style="text-align:right; width: auto">${currencySymbol(
              invoiceData["Currency"]
            )}${(taxAmount / 2).toFixed(1)}</td>
          </tr>
          <tr>
            <td colspan="7" style="text-align:right;">SGST (${(
              taxPercentage / 2
            ).toFixed(2)}%)</td>
            <td style="text-align:right; width: auto">${currencySymbol(
              invoiceData["Currency"]
            )}${(taxAmount / 2).toFixed(1)}</td>
          </tr>
              `
          }
          `
            : ""
        }
        
        
      </tbody>
    </table>
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
</body>
</html>
    `;
}
