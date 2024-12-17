export default function generateHTMLTPL002(invoiceData) {
  let isDescriptionAvailable = false;

  // Calculate the sub-amount by summing item prices
  invoiceData?.Items?.forEach((item) => {
    if (item["description"]) {
      isDescriptionAvailable = true;
    }
  });

  const rupeeIcon = (w = 15, h = 15) => {
    return `
      <svg fill="#000000" width="${w}px" height="${h}px" viewBox="0 0 256 256" id="Flat" xmlns="http://www.w3.org/2000/svg">
        <path d="M204,80a4.0002,4.0002,0,0,1-4,4H163.41943A55.96,55.96,0,0,1,108,148H82.34668l80.34375,73.04a4,4,0,1,1-5.38086,5.91992l-88-80A4.0002,4.0002,0,0,1,72,140h36a47.95728,47.95728,0,0,0,47.3208-56H72a4,4,0,0,1,0-8h81.24805A48.07552,48.07552,0,0,0,108,44H72a4,4,0,0,1,0-8H200a4,4,0,0,1,0,8H136.81006a56.24292,56.24292,0,0,1,24.84863,32H200A4.0002,4.0002,0,0,1,204,80Z"
        stroke-width="1"
        stroke="#000000"
        />
      </svg>
    `;
  };

  const currencySymbol = "₹";

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
              <span class="currency-icon-cls">${currencySymbol}
              ${Number(invoiceData["Paid Amount"]).toFixed(2)}</span>
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
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;700&display=swap" rel="stylesheet" ></link>
  <title>Invoice Template</title>
  <style>
  body {
    margin: 0;
    padding: 0;
    font-family: "Noto Sans", sans-serif;
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

  .currency-icon-cls {
    display: flex; 
    justify-content: flex-end;
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
              ? `<th style="min-width:75px">GST %</th>
              `
              : ""
          }
          ${
            invoiceData.itemData["taxPercentage"] > 0 &&
            invoiceData.itemData["discount"] <= 0
              ? `
              <th><span>GST ${currencySymbol}</span></th>
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
            <td><span class="currency-icon-cls">${currencySymbol}${
            item["price"]
          }</span></td>
            <td>${item["quantity"]}</td>
            ${
              (invoiceData.itemData["taxPercentage"] <= 0 &&
                invoiceData.itemData["discount"] > 0) ||
              (invoiceData.itemData["taxPercentage"] > 0 &&
                invoiceData.itemData["discount"] <= 0)
                ? `
                <td><span class="currency-icon-cls">${currencySymbol}${item["amount"]}</span>
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
              <td><span class="currency-icon-cls">${currencySymbol}${item["afterDiscount"]}</span>
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
              <td><span class="currency-icon-cls">${currencySymbol}${item["taxAmount"]}</span></td>
              `
              : ""
          }
          <td><span class="currency-icon-cls">${currencySymbol}${
            item["total"]
          }</span>
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
            <td style="text-align:right"><span class="currency-icon-cls">${currencySymbol}${
                invoiceData.itemData["subTotal"]
              }</span></td>
          </tr>
          ${
            invoiceData.itemData["discount"] > 0
              ? `
                  <tr>
                    <td colspan=${calculateColumnSpan(
                      invoiceData.itemData
                    )} style="text-align:right; border: none;">Discount</td>
                    <td style="text-align:right"><span class="currency-icon-cls">${currencySymbol}${
                  invoiceData.itemData["discount"]
                }</span></td>
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
              <td><span class="currency-icon-cls">${currencySymbol}${
                  invoiceData.itemData["afterDiscountAmount"]
                }</span></td>
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
                      <td style="text-align:right"><span class="currency-icon-cls">${currencySymbol}${
                        invoiceData.itemData["taxAmount"]
                      }</span></td>
                    </tr>
                        `
                    : `
                    <tr>
                      <td colspan=${calculateColumnSpan(
                        invoiceData.itemData
                      )} style="text-align:right; border: none;">CGST</td>
                      <td style="text-align:right"><span class="currency-icon-cls">${currencySymbol}${
                        invoiceData.itemData["taxAmount"] / 2
                      }<span></td>
                    </tr>
                    <tr>
                      <td colspan=${calculateColumnSpan(
                        invoiceData.itemData
                      )} style="text-align:right; border: none;">SGST</td>
                      <td style="text-align:right"><span class="currency-icon-cls">${currencySymbol}${
                        invoiceData.itemData["taxAmount"] / 2
                      }</span></td>
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
          )} style="text-align:right; border: none; font-weight: bold;">TOTAL</td>
          <td style="background-color: #f4f4f4; font-weight: bold; text-align:right; display: flex; justify-content: flex-end;"><span class="currency-icon-cls">${currencySymbol}${
    invoiceData.itemData["total"]
  }</span></td>
        </tr>
      </tbody>
    </table>
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
