export default function generateHTMLTPL002(invoiceData) {
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

  const bankDetailsAvailable =
    invoiceData["Bank Name"] ||
    invoiceData["Account No"] ||
    invoiceData["Account Holder Name"] ||
    invoiceData["IFSC Code"] ||
    invoiceData["Bank Address"];

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
    ? `<div class="footer-cls">
            <p>Notes:</p>
            <p>${invoiceData["Remarks"]}</p>
        </div>`
    : "";

  return `
    <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
  <title>Invoice Template</title>
  <style>
  body {
    margin: 0;
    padding: 0;
  }

  .temp1-container-cls {
    padding: 20px;
  }

  .temp1-container-cls h2 {
    font-size: 18px;
    margin-bottom: 5px;
    font-weight: bold;
  }

  .temp1-container-cls p {
    color: #000000 !important;
  }

  .header {
    display: flex;
    justify-content: space-between;
    padding-bottom: 10px;
    position: relative;
  }

  .company-info {
    text-align: right;
  }

  .company-info p {
    margin: 0;
    max-width: 200px;
  }

  .invoice-title {
    text-align: right;
    font-size: 24px;
  }

  .invoice-title h2 {
    margin: 0;
  }

  .bill-ship {
    display: flex;
    justify-content: space-between;
    margin-top: 30px;
  }

  .bill-ship p {
    margin: 8px 0;
    max-width: 270px;
  }

  .items {
    width: 100%;
    margin-top: 30px;
    border-collapse: collapse;
  }

  .items th,
  .items td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: right;
  }

  .items th {
    background-color: #f4f4f4 !important;
    text-align: center;
  }

  .items td:first-child {
    text-align: center;
  }

  .items .item-cls {
    text-align: left;
    max-width: 150px;
  }

  .total {
    text-align: right;
    margin-top: 20px;
  }

  .sub-total,
  .grand-total {
    margin: 10px 0;
  }

  .bank-details-container {
    margin-top: 20px;
  }

  .sub-bank-details-container {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 7px;
  }

  .sub-bank-details-title {
    width: 165px;
  }

  .footer-cls {
    margin-top: 40px;
    text-align: right;
  }

  .invoice-logo {
    width: 100px;
    height: 100px;
    object-fit: contain;
    position: absolute;
    top: 0;
    right: 0;
  }
</style>

</head>
<body>
  <div class="temp1-container-cls">
    <!-- Header Section -->
    <div class="header">
      <div class="invoice-title">
        <h2>INVOICE</h2>
      </div>
      ${
        invoiceData["Logo"]
          ? `<div style="margin-bottom: 80px;">
          <img
                src=${invoiceData["Logo"]}
                alt="Business Logo"
                class="invoice-logo"
            /> </div>`
          : `<div class="company-info">

      ${
        invoiceData["Sender's Zipcode"] ||
        invoiceData["Sender's Address"] ||
        invoiceData["Sender's City"] ||
        invoiceData["Sender's Contact No"]
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
              ${
                invoiceData["Sender's City"]
                  ? `${invoiceData["Sender's City"]}, `
                  : ""
              }
              ${
                invoiceData["Sender's Contact No"]
                  ? `${invoiceData["Sender's Contact No"]}`
                  : ""
              }
          </p>`
          : ""
      }
      </div>`
      }
      
    </div>
    
    <div class="bill-ship">
      <div class="bill">
        <h2>Bill To</h2>
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
      <div class="ship">
        <h2>Ship To</h2>
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
        <h2>Invoice Details</h2>
        <p><strong>Invoice No.:</strong> ${invoiceData["Invoice No."]}</p>
        <p><strong>Date:</strong> ${invoiceData["Invoice Issue Date"]}</p>
        ${
          invoiceData["Invoice Due Date"]
            ? `<p><strong>Due Date:</strong> ${invoiceData["Invoice Due Date"]}</p>`
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
                      <p><strong>${item["fieldName"]}:</strong> ${item["fieldValue"]}</p>
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

    <table class="items">
      <thead>
        <tr>
          <th>QTY</th>
          <th>NAME</th>
          ${isDescriptionAvailable ? `<th>DESCRIPTION</th>` : ""}
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
          <td class="item-cls">${item["name"]}</td>
          ${
            isDescriptionAvailable
              ? `<td class="item-cls">${item["description"]}</td>`
              : ""
          }
          <td>${currencySymbol(invoiceData["Currency"])}${item["price"]}</td>
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
            <td colspan="${
              isDescriptionAvailable ? "7" : "6"
            }" style="text-align:right; border: none;">Subtotal</td>
            <td style="text-align:right">${currencySymbol(
              invoiceData["Currency"]
            )}${subAmount.toFixed(1)}</td>
          </tr>
          ${
            invoiceData["Sender's Tax Type"] === "IGST"
              ? `
          <tr>
            <td colspan="${
              isDescriptionAvailable ? "7" : "6"
            }" style="text-align:right; border: none;">${
                  invoiceData["Sender's Tax Type"]
                } (${taxPercentage.toFixed(1)}%)</td>
            <td style="text-align:right">${currencySymbol(
              invoiceData["Currency"]
            )}${taxAmount.toFixed(1)}</td>
          </tr>
              `
              : `
          <tr>
            <td colspan="${
              isDescriptionAvailable ? "7" : "6"
            }" style="text-align:right; border: none;">CGST (${(
                  taxPercentage / 2
                ).toFixed(1)}%)</td>
            <td style="text-align:right">${currencySymbol(
              invoiceData["Currency"]
            )}${(taxAmount / 2).toFixed(1)}</td>
          </tr>
          <tr>
            <td colspan="${
              isDescriptionAvailable ? "7" : "6"
            }" style="text-align:right; border: none;">SGST (${(
                  taxPercentage / 2
                ).toFixed(1)}%)</td>
            <td style="text-align:right">${currencySymbol(
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
          }" style="text-align:right; border: none; font-weight: bold;">TOTAL</td>
          <td style="background-color: #f4f4f4; font-weight: bold; text-align:right">${currencySymbol(
            invoiceData["Currency"]
          )}${totalAmount.toFixed(1)}</td>
        </tr>
      </tbody>
    </table>
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
    ${remarksUI}
  </div>
</body>
</html>

    `;
}
