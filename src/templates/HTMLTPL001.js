export default function generateHTMLTPL001(invoiceData) {
  // Initialize the sub-amount
  let subAmount = 0;
  let totalAmount = 0;
  let taxAmount = 0;
  let isDescriptionAvailable = false;

  // Calculate the sub-amount by summing item prices
  invoiceData?.Items?.forEach((item) => {
    // Convert item price to a number
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
  const bankDetailsAvailable =
    invoiceData["Bank Name"] ||
    invoiceData["Account No"] ||
    invoiceData["Account Holder Name"] ||
    invoiceData["IFSC Code"] ||
    invoiceData["Bank Address"];

  invoiceData["Invoice Issue Date"] = formatDate(
    invoiceData["Invoice Issue Date"]
  );
  invoiceData["Invoice Due Date"] = invoiceData["Invoice Due Date"]
    ? formatDate(invoiceData["Invoice Due Date"])
    : "";

  // Retrieve tax percentage from invoice data
  const taxPercentage = (taxAmount / subAmount) * 100 || 0;

  return `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name='viewport', content='width=device-width, initial-scale=0.5, maximum-scale=1.0'>
    <link href="https://fonts.googleapis.com/css2?family=Spartan:wght@100..900&display=swap" rel="stylesheet" ></link>
    <style>
    body {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-family: "Spartan", sans-serif;
    }

    .main-container-cls p {
        color: #000000 !important;
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
        font-size: 30px;
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
    }

    .sec2-container .sub-sec2-container {
        display: contents;
        align-items: center;
        justify-content: center;
    }

    .sec2-container .sub-sec2-container .sub-sec2-title,
    .sec2-container .sub-sec2-container .sub-sec2-title-value {
        text-align: left;
    }

    .sec3-container {
        display: flex;
        justify-content: space-between;
        width: 100%;
        margin-bottom: 30px;
        box-sizing: border-box;
        gap: 20px;
    }
    .sub-sec3-container {
      max-width: 350px;
      word-break: break-word;
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
        width: 80px;
        text-align: right;
        margin: 0;
        padding: 5px 0;
        box-sizing: border-box;
    }

    .sub-sec4-item-amount {
        width: 100px !important;
    }

    .sub-sec4-item-description {
        width: 150px !important;
        text-align: left !important;
        word-wrap: break-word;
        padding: 0 !important;
        margin: 0 !important;
    }

    .sub-sec4-item-quantity {
        width: 50px;
        text-align: center !important;
    }

    .sub-sec4-item-name {
        text-align: left !important;
        width: 150px !important;
        word-wrap: break-word;
    }

    .sec5-container {
        display: flex;
        width: 100%;
        justify-content: flex-end;
        margin-bottom: 30px;
        box-sizing: border-box;
    }

    .sec5-container .sub-sec5-container {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .sec5-container .sub-sec5-container .sub-sec5-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .sec5-container .sub-sec5-container .sub-sec5-title {
        margin: 0;
        width: 150px;
    }

    .sec6-container {
        width: 100%;
        margin-bottom: 30px;
        box-sizing: border-box;
        text-align: right;
    }

    .sec7-container .sub-sec7-container {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 7px;
    }

    .sec7-container .sub-sec7-container .sub-sec7-title {
        width: 130px;
    }

    .main-container-cls {
        padding: 0 70px;
        margin: 0 auto;
    }

    .main-container-cls h2 {
        font-size: 21px;
        font-weight: bold;
        margin: 0;
        margin-bottom: 7px;
    }

    .main-container-cls p {
        margin: 0;
        margin-bottom: 7px;

    }

    .invoice-logo {
        width: 100px;
        height: auto;
        max-height: 100px;
        object-fit: contain;
        position: absolute;
        top: 10px;
        right: 10px;
    }
</style>

</head>
<body>
    <div class="main-container-cls">
        <div style="position: relative;">
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
          <div class="sub-sec3-container">
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

<div class="sub-sec3-container">
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
        </div>
        <div class="sec4-container">
            <div class="sub-sec4-container">
                 <div class="sub-sec4-header">
                    <h2 class="sub-sec4-item-name">Item Name</h2>
                    <h2 class="sub-sec4-item-quantity">Qty</h2>
                    <h2 class="sub-sec4-item-price">Price</h2>
                    <h2 class="sub-sec4-item-amount">Amount</h2>
                    <h2 class="sub-sec4-item-tax">Tax %</h2>
                    <h2 class="sub-sec4-item-tax-amount">Tax ${currencySymbol(
                      invoiceData["Currency"]
                    )}</h2>
                    <h2 class="sub-sec4-item-total">Total</h2>
                </div>
                ${invoiceData["Items"]
                  .map(
                    (item) => `
                    <div class="sub-sec4-item">
                      <div>
                          <p class="sub-sec4-item-name">${item["name"]}</p>
                          ${
                            isDescriptionAvailable && item["description"]
                              ? `<p class="sub-sec4-item-description">${item["description"]}</p>`
                              : ""
                          }
                          
                      </div>
                        <p class="sub-sec4-item-quantity">${
                          item["quantity"]
                        }</p>
                        <p class="sub-sec4-item-price">${currencySymbol(
                          invoiceData["Currency"]
                        )}${item["price"]}</p>
                    <p class="sub-sec4-item-amount">${currencySymbol(
                      invoiceData["Currency"]
                    )}${item["price"] * item["quantity"]}</p>
                    <p class="sub-sec4-item-tax">${item["taxPercentage"]}%</p>
                    <p class="sub-sec4-item-tax-amount">${currencySymbol(
                      invoiceData["Currency"]
                    )}${(
                      item["price"] *
                      item["quantity"] *
                      (item["taxPercentage"] / 100)
                    ).toFixed(1)}</p>
                    <p class="sub-sec4-item-total">${currencySymbol(
                      invoiceData["Currency"]
                    )}${
                      item["price"] * item["quantity"] +
                      item["price"] *
                        item["quantity"] *
                        (item["taxPercentage"] / 100)
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
                        )}${subAmount.toFixed(1)}</span>
                    </div>
                    <div class="sub-sec5-item">
                    ${
                      invoiceData["Sender's Tax Type"] === "IGST"
                        ? `
                    <p class="sub-sec5-title">${
                      invoiceData["Sender's Tax Type"]
                    } (${taxPercentage.toFixed(1)}%)</p><span>${currencySymbol(
                            invoiceData["Currency"]
                          )}${taxAmount.toFixed(1)}</span>
                    `
                        : `
                        <div style="display: flex; align-items: center; flex-direction: column; gap: 10px;">
                          <div style="display: flex; align-items: center;">
                            <p class="sub-sec5-title">CGST (${(
                              taxPercentage / 2
                            ).toFixed(1)}%)</p><span>${currencySymbol(
                            invoiceData["Currency"]
                          )}${(taxAmount / 2).toFixed(1)}</span>
                          </div>
                          <div style="display: flex; align-items: center;">
                            <p class="sub-sec5-title">SGST (${(
                              taxPercentage / 2
                            ).toFixed(1)}%)</p><span>${currencySymbol(
                            invoiceData["Currency"]
                          )}${(taxAmount / 2).toFixed(1)}</span>
                          </div>
                        </div>
                    `
                    }
                        
                    </div>`
                     : ""
                 }
                    
                     <div class="sub-sec5-item">
                        <h2 class="sub-sec5-title">Total</h2><span>${currencySymbol(
                          invoiceData["Currency"]
                        )}${totalAmount.toFixed(1)}</span>
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
    </div>
</body>
</html>
    `;
}
