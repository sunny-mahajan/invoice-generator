export default function generateHTMLTPL001(invoiceData) {
  // Initialize the sub-amount
  let subAmount = 0;
  let totalAmount = 0;
  let taxAmount = 0;

  // Calculate the sub-amount by summing item prices
  invoiceData.Items.forEach((item) => {
    // Convert item price to a number
    subAmount += +item.amount || 0;
    totalAmount += +item.total || 0;
    taxAmount += +item.taxAmount || 0;
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
  const bankDetailsAvailable =
    invoiceData["Bank Name"] ||
    invoiceData["Account No"] ||
    invoiceData["Account Holder Name"] ||
    invoiceData["IFSC Code"] ||
    invoiceData["Account Type"] ||
    invoiceData["Bank Address"];

  invoiceData["Invoice Issue Date"] = formatDate(
    invoiceData["Invoice Issue Date"]
  );
  invoiceData["Invoice Due Date"] = invoiceData["Invoice Due Date"]
    ? formatDate(invoiceData["Invoice Due Date"])
    : "";

  // Retrieve tax percentage from invoice data
const taxPercentage = (taxAmount / subAmount) * 100 || 0;
  const remarksUI = invoiceData["Remarks"]
    ? `<div class="sec6-container">
            <p>Notes:</p>
            <p>${invoiceData["Remarks"]}</p>
        </div>`
    : "";

  return `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name='viewport', content='width=device-width, initial-scale=0.5, maximum-scale=1.0'>
    <style>
        body {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        .main-container-cls {
            padding: 0 70px;
        }
        .title-container-cls {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            margin-bottom: 20px;
            box-sizing: border-box;
        }
        .title-container-cls h1 {
            border: 1px solid rgb(240, 80, 80);
            padding: 3px 8px;
            text-transform: uppercase;
            letter-spacing: 7px;
            font-size: 40px;
            font-family: sans-serif;
            font-weight: 600;
            
        }
        .sec2-container {
            justify-content: center;
            width: 100%;
            margin-bottom: 30px;
            box-sizing: border-box;
            display: grid;
            column-gap: 10px;
            grid-template-columns: max-content auto;
            .sub-sec2-container {
                display: contents;
                align-items: center;
                justify-content: center;
                .sub-sec2-title {
                  text-align: left;
                }
                .sub-sec2-title-value {
                  text-align: left;
                }
            }
        }
        .sec3-container {
            display: flex;
            justify-content: space-between;
            width: 100%;
            margin-bottom: 30px;
            box-sizing: border-box;
        }
             .sec4-container {
        display: flex;
        flex-direction: column;
        width: 100%;
        margin-bottom: 20px;
        box-sizing: border-box;
      }
      .sub-sec4-container {
        width: 100%;
      }
      .sub-sec4-header,
      .sub-sec4-item {
        display: flex;
        justify-content: space-between;
        padding: 5px 0;
        border-bottom: 1px solid #ddd;
      }
      .sub-sec4-header h2,
      .sub-sec4-item p {
        width: 18%;
        text-align: left;
        margin: 0;
        padding: 5px 0;
        box-sizing: border-box;
      }
      .sub-sec4-header h2:nth-child(2),
      .sub-sec4-item p:nth-child(2) {
        width: 30%;
        max-width: 30%;
        word-wrap: break-word;
        padding-left: 15px
      }
        .sub-sec4-header h2:nth-child(3),
      .sub-sec4-item p:nth-child(3) {
        text-align: center;
      }
      .sub-sec4-header h2:nth-child(4),
      .sub-sec4-header h2:nth-child(5),
      .sub-sec4-item p:nth-child(4),
      .sub-sec4-item p:nth-child(5) {
        text-align: right;
      }
        
        .sec5-container {
            display: flex;
            width: 100%;
            justify-content: flex-end;
            margin-bottom: 30px;
            box-sizing: border-box;
            .sub-sec5-container {
                display: flex;
                flex-direction: column;
                gap: 10px;
                .sub-sec5-item{
                    display: flex;
                    justify-content: space-between;
                    align-items: center;}
                .sub-sec5-title {
                    margin: 0;
                    width: 150px;
                }
            }
        }
        .sec6-container {
            width: 100%;
            margin-bottom: 30px;
            box-sizing: border-box;
            text-align: right;
        }
        .sec7-container {
            .sub-sec7-container {
              display: flex;
              align-items: center;
              gap: 10px;
              margin-bottom: 7px;
              .sub-sec7-title {
                width: 130px;
              }
            }
        }
        .main-container-cls {
            margin: 0 auto;
            font-family: Helvetica;
        }
        .invoice-logo {
          width: 100px;
          height: 100px;
          object-fit: contain;
          position: absolute;
          top: 10px;
          right: 10px;
        }
        h2{ 
            font-size: 21px;
        }
        p, h2 {
            margin: 0;
            margin-bottom: 10px;
        }
    </style>
</head>
<body>
    <div class="main-container-cls">
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
        <div class="title-container-cls">
            <h1>Invoice</h1>
        </div>
        <div class="sec2-container">
          <div class="sub-sec2-container">
            <span class="sub-sec2-title">Invoice No:</span><span> ${
              invoiceData["Invoice No."]
            }</span>
          </div>
          <div class="sub-sec2-container">
            <span class="sub-sec2-title">Invoice Date:</span><span> ${
              invoiceData["Invoice Issue Date"]
            }</span>
          </div>
          ${
            invoiceData["Invoice Due Date"]
              ? `<div class="sub-sec2-container">
            <span class="sub-sec2-title">Due Date:</span><span> ${invoiceData["Invoice Due Date"]}</span>
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
                    <div class="sub-sec2-container">
                        <span class="sub-sec2-title">${item["fieldName"]}:</span><span> ${item["fieldValue"]}</span>
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
        <div class="sec3-container">
          <div>
  <h2>From</h2>
  ${
    invoiceData["Sender's Name"] ? `<p>${invoiceData["Sender's Name"]}</p>` : ""
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
    invoiceData["Sender's State"] || invoiceData["Sender's Country"]
      ? `<p>
      ${
        invoiceData["Sender's State"]
          ? `${invoiceData["Sender's State"]}, `
          : ""
      }
      ${invoiceData["Sender's Country"] || ""}
    </p>`
      : ""
  }
  
  ${
    invoiceData["Sender's Contact No"]
      ? `<p>+91${invoiceData["Sender's Contact No"]}</p>`
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

<div>
  <h2>To</h2>
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
    invoiceData["Receiver's State"] || invoiceData["Receiver's Country"]
      ? `<p>
      ${
        invoiceData["Receiver's State"]
          ? `${invoiceData["Receiver's State"]}, `
          : ""
      }
      ${invoiceData["Receiver's Country"] || ""}
    </p>`
      : ""
  }

  ${
    invoiceData["Receiver's Contact No"]
      ? `<p>+91${invoiceData["Receiver's Contact No"]}</p>`
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
        </div>
        <div class="sec4-container">
            <div class="sub-sec4-container">
                 <div class="sub-sec4-header">
                    <h2>Item Name</h2>
                    <h2>Description</h2>
                    <h2>Qty</h2>
                    <h2>Price</h2>
                    <h2>Total</h2>
                </div>
                ${invoiceData["Items"]
                  .map(
                    (item) => `
                    <div class="sub-sec4-item">
                        <p>${item["name"]}</p>
                        <p>${item["description"] ?? ""}</p>
                        <p>${item["quantity"]}</p>
                        <p>${currencySymbol(invoiceData["Currency"])}${
                      item["price"]
                    }</p>
                        <p>${currencySymbol(invoiceData["Currency"])}${
                      item["price"] * item["quantity"]
                    }</p>
                    </div>
                `
                  )
                  .join("")}
                
            </div>
        </div>
        <div class="sec5-container">
            <div>
                <div class="sub-sec5-container">
                 ${
                  taxPercentage > 0
                     ? `
                  <div class="sub-sec5-item">
                        <p class="sub-sec5-title">Subtotal</p><span>${currencySymbol(
                          invoiceData["Currency"]
                        )}${subAmount}</span>
                    </div>
                    <div class="sub-sec5-item">
                        <p class="sub-sec5-title">${
                          invoiceData["Sender's Tax Type"]
                        } ${
                         taxPercentage.toFixed(2)
                       }%</p><span>${currencySymbol(
                         invoiceData["Currency"]
                       )}${taxAmount}</span>
                    </div>`
                     : ""
                 }
                    
                     <div class="sub-sec5-item">
                        <h2 class="sub-sec5-title">Total</h2><span>${currencySymbol(
                          invoiceData["Currency"]
                        )}${totalAmount}</span>
                     </div>
                </div>
            </div>
        </div>
        ${
          bankDetailsAvailable
            ? `<div class="sec7-container">
          <h2>Bank Details</h2>
          ${
            invoiceData["Bank Name"]
              ? `
          <div class="sub-sec7-container">
              <span class="sub-sec7-title">Bank Name:</span><span>${invoiceData["Bank Name"]}</span>
          </div>`
              : ""
          }
          ${
            invoiceData["Account No"]
              ? `
          <div class="sub-sec7-container">
              <span class="sub-sec7-title">A/c No:</span><span>${invoiceData["Account No"]}</span>
          </div>`
              : ""
          }
          ${
            invoiceData["Account Holder Name"]
              ? `
          <div class="sub-sec7-container">
              <span class="sub-sec7-title">A/c Holder Name:</span><span>${invoiceData["Account Holder Name"]}</span>
          </div>`
              : ""
          }
          ${
            invoiceData["IFSC Code"]
              ? `
          <div class="sub-sec7-container">
              <span class="sub-sec7-title">IFSC Code:</span><span>${invoiceData["IFSC Code"]}</span>
          </div>`
              : ""
          }
          ${
            invoiceData["Account Type"]
              ? `
          <div class="sub-sec7-container">
              <span class="sub-sec7-title">A/c Type:</span><span>${invoiceData["Account Type"]}</span>
          </div>`
              : ""
          }
          ${
            invoiceData["Bank Address"]
              ? `
            <div class="sub-sec7-container">
                <span class="sub-sec7-title">Bank Address:</span><span>${invoiceData["Bank Address"]}</span>
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
