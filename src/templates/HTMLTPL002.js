export default function generateHTMLTPL002(invoiceData) {
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

  const calculateColumnSpan = (itemData) => {
    const { discount, taxPercentage } = itemData;
    if ((discount > 0 && taxPercentage > 0) || taxPercentage > 0) return "7";
    return discount > 0 ? "6" : "4";
  };

  invoiceData["Invoice Issue Date"] = formatDate(
    invoiceData["Invoice Issue Date"]
  );
  invoiceData["Invoice Due Date"] = invoiceData["Invoice Due Date"]
    ? formatDate(invoiceData["Invoice Due Date"])
    : "";

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

  .header-cls {
    display: flex;
    justify-content: space-between;
    padding-bottom: 10px;
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
    gap: 10px;
  }

  .bill-ship .invoice-info {
    width: 240px;
  }

  .bill-ship p {
    margin: 8px 0;
    max-width: 270px;
    word-break: break-word;
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

  .items td {
    word-break: break-all;
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

  .items .item-cls p{
    color: #555555 !important;
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
     max-width: 500px;
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
  .sub-bank-details-value {
    width: 330px;
    word-break: break-word;
  }

  .footer-cls {
    margin-top: 40px;
    text-align: right;
  }

  .invoice-logo {
    width: 100px;
    height: auto;
    max-height: 80px;
    object-fit: contain;
  }
</style>

</head>
<body>
  <div class="temp1-container-cls">
    <!-- Header Section -->
    <div class="header-cls">
      <div class="invoice-title">
        <h2>INVOICE</h2>
      </div>
      ${
        invoiceData["Logo"] &&
        `<div>
            <img
              src=${invoiceData["Logo"]}
              alt="Business Logo"
              class="invoice-logo"
            />
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
                    <p style="margin: 0">${item["fieldName"]}:</p><p style="margin: 0"> ${item["fieldValue"]}</p>
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
          <th>No.</th>
          <th>NAME</th>
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
          (item, index) => `
          <tr style="page-break-inside: avoid;">
            <td >${index + 1}</td>
            <td class="item-cls">${item["name"]}
            ${isDescriptionAvailable ? `<p>${item["description"]}</p>` : ""}
            </td>
            <td>${currencySymbol(invoiceData["Currency"])}${item["price"]}</td>
            <td>${item["quantity"]}</td>
            ${
              (invoiceData.itemData["taxPercentage"] <= 0 &&
                invoiceData.itemData["discount"] > 0) ||
              (invoiceData.itemData["taxPercentage"] > 0 &&
                invoiceData.itemData["discount"] <= 0)
                ? `
                <td>${currencySymbol(invoiceData["Currency"])}${item["amount"]}
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
        ${
          invoiceData.itemData["taxPercentage"] > 0 ||
          invoiceData.itemData["discount"] > 0
            ? `
          <tr>
            <td colspan=${calculateColumnSpan(
              invoiceData.itemData
            )} style="text-align:right; border: none;">Subtotal</td>
            <td style="text-align:right">${currencySymbol(
              invoiceData["Currency"]
            )}${invoiceData.itemData["subTotal"]}</td>
          </tr>
          ${
            invoiceData.itemData["discount"] > 0
              ? `
                  <tr>
                    <td colspan=${calculateColumnSpan(
                      invoiceData.itemData
                    )} style="text-align:right; border: none;">Discount</td>
                    <td style="text-align:right">${currencySymbol(
                      invoiceData["Currency"]
                    )}${invoiceData.itemData["discount"]}</td>
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
              <td>${currencySymbol(invoiceData["Currency"])}${
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
                      )} style="text-align:right; border: none;">${
                        invoiceData["Sender's Tax Type"]
                      }</td>
                      <td style="text-align:right">${currencySymbol(
                        invoiceData["Currency"]
                      )}${invoiceData.itemData["taxAmount"]}</td>
                    </tr>
                        `
                    : `
                    <tr>
                      <td colspan=${calculateColumnSpan(
                        invoiceData.itemData
                      )} style="text-align:right; border: none;">CGST</td>
                      <td style="text-align:right">${currencySymbol(
                        invoiceData["Currency"]
                      )}${invoiceData.itemData["taxAmount"] / 2}</td>
                    </tr>
                    <tr>
                      <td colspan=${calculateColumnSpan(
                        invoiceData.itemData
                      )} style="text-align:right; border: none;">SGST</td>
                      <td style="text-align:right">${currencySymbol(
                        invoiceData["Currency"]
                      )}${invoiceData.itemData["taxAmount"] / 2}</td>
                    </tr>
                  `
                }
                `
                : ""
            }
          `
            : ""
        }
        
        
        <tr>
          <td colspan=${calculateColumnSpan(
            invoiceData.itemData
          )} style="text-align:right; border: none; font-weight: bold;">TOTAL</td>
          <td style="background-color: #f4f4f4; font-weight: bold; text-align:right">${currencySymbol(
            invoiceData["Currency"]
          )}${invoiceData.itemData["total"]}</td>
        </tr>
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
</body>
</html>

    `;
}
