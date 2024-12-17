export default function generateHTMLTPL001(invoiceData) {
  console.log("invoiceData: ", invoiceData);
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

  const currencySymbol = "₹";

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

  const escapeHTML = (text) => {
    const div = document.createElement("div");
    div.innerText = text;
    return div.innerHTML;
  };

  const remarksUI = invoiceData["Remarks"]
    ? `<div class="sec7-container" style="page-break-inside: avoid;">
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
      ? `<div class="sub-sec5-item">
            <p class="sub-sec5-title">Paid Amount</p>
              <span class="">
              <span>${invoiceData["isPdfPreview"] ? currencySymbol : "₹"}</span>
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
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name='viewport', content='width=device-width, initial-scale=1.0'>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;700&display=swap" rel="stylesheet" ></link>
    <style>
    body {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-family: "Noto Sans", sans-serif;
    }

    .main-container-cls p {
        color: #000000;
        font-size: 15px;
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
        padding: 15px;
        text-transform: uppercase;
        letter-spacing: 7px;
        font-size: 25px;
        line-height: 30px;
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
        max-width: 200px;
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
        width: 90px;
        text-align: right;
        margin: 0;
        padding: 5px 0;
        box-sizing: border-box;
        word-wrap: break-word;  
    }

    .sub-sec4-item-amount {
        width: 115px !important;
    }

    .sub-sec4-item-total {
        width: 115px !important;
    }

    .sub-sec4-item-discount {
        width: 100px !important;
    }

    .sub-sec4-item-description {
        width: 140px !important;
        text-align: left !important;
        word-wrap: break-word;
        padding: 0 !important;
        margin: 0 !important;
        color: #555555 !important;
    }

    .sub-sec4-item-quantity {
        width: 60px !important;
     }
    .sub-sec4-item-no {
        width: 35px !important;
        text-align: center !important;
    }
    .sub-sec4-item-name {
        text-align: center !important;
        width: 140px !important;
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
        max-width: 500px;
    }

    .sec7-container .sub-sec7-container .sub-sec7-title {
        width: 130px;
    }

    .sub-sec7-value {
      max-width: 360px;
      word-break: break-word;
    }

    .main-container-cls {
        padding: 0 20px;
        margin: 0 auto;
    }

    .main-container-cls h2 {
        font-size: 15px;
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

    . {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-end;
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

<div class="sub-sec3-container">
  <h2>To</h2>
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
          ? `${invoiceData["Receiver's Zipcode"]} `
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
        </div>
        <div class="sec4-container">
            <div class="sub-sec4-container">
                 <div class="sub-sec4-header">
                    <h2 class="sub-sec4-item-no">No.</h2>
                    <h2 class="sub-sec4-item-name">Name</h2>
                    <h2 class="sub-sec4-item-price">Price</h2>
                    <h2 class="sub-sec4-item-quantity">Qty</h2>
                    ${
                      (invoiceData.itemData["taxPercentage"] <= 0 &&
                        invoiceData.itemData["discount"] > 0) ||
                      (invoiceData.itemData["taxPercentage"] > 0 &&
                        invoiceData.itemData["discount"] <= 0)
                        ? `
                      <h2 class="sub-sec4-item-amount">Amount</h2>
                      `
                        : ""
                    }
                    ${
                      invoiceData.itemData["discount"] > 0
                        ? `<h2 class="sub-sec4-item-discount">Discount</h2>`
                        : ""
                    }
                    ${
                      invoiceData.itemData["taxPercentage"] > 0 &&
                      invoiceData.itemData["discount"] > 0
                        ? `
                      <h2 class="sub-sec4-item-amount">Net Price</h2>
                      `
                        : ""
                    }

                    ${
                      invoiceData.itemData["taxPercentage"] > 0
                        ? `<h2 class="sub-sec4-item-tax">GST %</h2>
                          
                        `
                        : ""
                    }
                    ${
                      invoiceData.itemData["taxPercentage"] > 0 &&
                      invoiceData.itemData["discount"] <= 0
                        ? `
                        <h2 class="sub-sec4-item-tax-amount">GST <span>${
                          invoiceData["isPdfPreview"] ? currencySymbol : "₹"
                        }</span></h2>
                      `
                        : ""
                    }              
                    <h2 class="sub-sec4-item-total">Total</h2>
                </div>
                ${invoiceData["Items"]
                  .map(
                    (item, index) => `
                    <div class="sub-sec4-item" style="page-break-inside: avoid;">
                      <p class="sub-sec4-item-no">${index + 1}</p>
                      <div>
                          <p class="sub-sec4-item-name">${item["name"]}</p>
                          ${
                            isDescriptionAvailable && item["description"]
                              ? `<p class="sub-sec4-item-description">${item["description"]}</p>`
                              : ""
                          }
                      </div>
                      <p class="sub-sec4-item-price "><span>${
                        invoiceData["isPdfPreview"] ? currencySymbol : "₹"
                      }</span>${item["price"]}</p>
                      <p class="sub-sec4-item-quantity">${item["quantity"]}</p>
                      ${
                        (invoiceData.itemData["taxPercentage"] <= 0 &&
                          invoiceData.itemData["discount"] > 0) ||
                        (invoiceData.itemData["taxPercentage"] > 0 &&
                          invoiceData.itemData["discount"] <= 0)
                          ? `
                         <p class="sub-sec4-item-amount "><span>${
                           invoiceData["isPdfPreview"] ? currencySymbol : "₹"
                         }</span>${item["amount"]}
                        </p>
                        `
                          : ""
                      }
                      ${
                        invoiceData.itemData["discount"] > 0 > 0
                          ? `
                          <p class="sub-sec4-item-discount">${
                            item["discountPercentage"] || 0
                          }%</p>
                          `
                          : ""
                      }
                        ${
                          invoiceData.itemData["taxPercentage"] > 0 &&
                          invoiceData.itemData["discount"] > 0
                            ? `
                          <p class="sub-sec4-item-amount "><span>${
                            invoiceData["isPdfPreview"] ? currencySymbol : "₹"
                          }</span>${item["afterDiscount"]}
                          </p>
                        `
                            : ""
                        }
                      ${
                        invoiceData.itemData["taxPercentage"] > 0
                          ? `
                        <p class="sub-sec4-item-tax">${
                          item["taxPercentage"] || 0
                        }%</p>
                        
                        `
                          : ""
                      }
                      ${
                        invoiceData.itemData["taxPercentage"] > 0 &&
                        invoiceData.itemData["discount"] <= 0
                          ? `
                          <p class="sub-sec4-item-tax-amount "><span>${
                            invoiceData["isPdfPreview"] ? currencySymbol : "₹"
                          }</span>${item["taxAmount"]}</p>
                          `
                          : ""
                      }
                      <p class="sub-sec4-item-total "><span>${
                        invoiceData["isPdfPreview"] ? currencySymbol : "₹"
                      }</span>${item["total"]}</p>
                    </div>
                `
                  )
                  .join("")}
                
            </div>
        </div>

        <div class="sec5-container" style="page-break-inside: avoid;">
          <div>
            <div class="sub-sec5-container">
              ${
                invoiceData.itemData["taxPercentage"] > 0 ||
                invoiceData.itemData["discount"] > 0
                  ? `
                <div class="sub-sec5-item">
                  <p class="sub-sec5-title">Subtotal</p>
                  <span class=""><span>${
                    invoiceData["isPdfPreview"] ? currencySymbol : "₹"
                  }</span>${invoiceData.itemData["subTotal"]}</span>
                </div>
                ${
                  invoiceData.itemData["discount"] > 0
                    ? `
                  <div class="sub-sec5-item">
                    <p class="sub-sec5-title">Discount</p>
                    <span class=""><span>${
                      invoiceData["isPdfPreview"] ? currencySymbol : "₹"
                    }</span>${invoiceData.itemData["discount"]}</span>
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
                    <span class=""><span>${
                      invoiceData["isPdfPreview"] ? currencySymbol : "₹"
                    }</span>${
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
                    <p class="sub-sec5-title">
                      ${invoiceData["Sender's Tax Type"]}
                    </p>
                    <span class=""><span>${
                      invoiceData["isPdfPreview"] ? currencySymbol : "₹"
                    }</span>${invoiceData.itemData["taxAmount"]}</span>
                    `
                        : `
                    <div style="display: flex; flex-direction: column; gap: 10px;">
                      <div style="display: flex; align-items: center;">
                        <p class="sub-sec5-title">CGST</p>
                        <span class=""><span>${
                          invoiceData["isPdfPreview"] ? currencySymbol : "₹"
                        }</span>${invoiceData.itemData["taxAmount"] / 2}</span>
                      </div>
                      <div style="display: flex; align-items: center;">
                        <p class="sub-sec5-title">SGST</p>
                        <span class=""><span>${
                          invoiceData["isPdfPreview"] ? currencySymbol : "₹"
                        }</span>${invoiceData.itemData["taxAmount"] / 2}</span>
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
                <h2 class="sub-sec5-title">Total</h2>
                <span class=""><span>${
                  invoiceData["isPdfPreview"] ? currencySymbol : "₹"
                }</span>${invoiceData.itemData["total"]}</span>
              </div>
            </div>
          </div>
        </div>

        ${remarksUI}
        ${
          bankDetailsAvailable
            ? `<div class="sec7-container" style="page-break-inside: avoid;">
          <h2>Bank Details</h2>
          ${
            invoiceData["Bank Name"]
              ? `
          <div class="sub-sec7-container">
              <span class="sub-sec7-title">Bank Name:</span><span class="sub-sec7-value">${invoiceData["Bank Name"]}</span>
          </div>`
              : ""
          }
          ${
            invoiceData["Account No"]
              ? `
          <div class="sub-sec7-container">
              <span class="sub-sec7-title">A/c No:</span><span class="sub-sec7-value">${invoiceData["Account No"]}</span>
          </div>`
              : ""
          }
          ${
            invoiceData["Account Holder Name"]
              ? `
          <div class="sub-sec7-container">
              <span class="sub-sec7-title">A/c Holder Name:</span><span class="sub-sec7-value">${invoiceData["Account Holder Name"]}</span>
          </div>`
              : ""
          }
          ${
            invoiceData["IFSC Code"]
              ? `
          <div class="sub-sec7-container">
              <span class="sub-sec7-title">IFSC Code:</span><span class="sub-sec7-value">${invoiceData["IFSC Code"]}</span>
          </div>`
              : ""
          }
          ${
            invoiceData["Account Type"]
              ? `
          <div class="sub-sec7-container">
              <span class="sub-sec7-title">A/c Type:</span><span class="sub-sec7-value">${invoiceData["Account Type"]}</span>
          </div>`
              : ""
          }
          ${
            invoiceData["Bank Address"]
              ? `
            <div class="sub-sec7-container">
                <span class="sub-sec7-title">Bank Address:</span><span class="sub-sec7-value">${invoiceData["Bank Address"]}</span>
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
