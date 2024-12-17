export default function generateHTMLTPL006(invoiceData) {
  let isDescriptionAvailable = false;

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
    ? `<div class="notes">
                <p class="align-left details-title">Notes:</p>
                <p class="align-left details-data">${escapeHTML(
                  invoiceData["Remarks"]
                )}</p>
            </div>`
    : "";

  const AdvancePaidAmount =
    invoiceData["Paid Amount"] && invoiceData.itemData["total"] !== "0.0"
      ? `<p class="details-data">Paid Amount</p>
          <p class="details-data data-limit">
          ${currencySymbol} ${Number(invoiceData["Paid Amount"]).toFixed(
          2
        )}</p>`
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
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;700&display=swap" rel="stylesheet" ></link>
  <title>Invoice</title> 
  <style type="text/css">
    body {
      margin: 0;
      padding: 0;
      background-color: #fff;
      font-family: "Noto Sans", sans-serif;
    }
    
    .invoice-container p{
      margin: 0;
      padding: 0;
    }
    
    .align-left{
      text-align: left;
    } 

    .align-right{
      text-align: right;
    }

    .v-align-top{
      vertical-align: top;
    }

    .w-10px{
      width: 10px;
    }
    
    .w-25{
      width: 25%;
    }

    .w-50{
      width: 50%;
    }

    .invoice-container img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
    
    .invoice-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 10px;
      height: 120px;
    }

    .invoice-header h1 {
      font-size: 8em;
      color: #013264;
      margin: 0;
      padding: 0;
      line-height: unset;
      letter-spacing: unset;
    }

    .invoice-header figure {
      margin: 0;
      padding: 0;
      height: 100px;
    }

    .details-title{
      font-size: 24px;
      font-style: normal;
      font-weight: 500;
      color: #013264;
    }

    .details-data{
      font-optical-sizing: auto;
      font-size: 16px;
      font-weight: 400;
      font-style: normal;
      color: #363636;
    }

    .details {
      margin-top: 20px;
      display: flex;
      justify-content: space-between;
    }

    .details {
      display: flex;
      justify-content: space-between;
      gap:10px;
      margin-top: 20px;
    }

    .data-limit{
      max-width: 230px;
      word-wrap: break-word;
    }

    .table-data-limit{
      max-width: 100px;
      word-wrap: break-word;
    }

    .custom-field{
      font-weight: 600;
    }

    .invoice-container {
      font-weight: 400;
      font-style: normal;
      border-left: 2.5em solid #003366;
      padding: 0 4em 0 2.5em;
    }

    .invoice-number .grid-container {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      align-items: center;
    }

    .table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }

    .table th {
      font-size: 24px;
      font-style: normal;
      font-weight: 500;
      color: #013264;
      padding: 6px 10px;
      background-color: #f5f5f5;
      border: 1px solid #939393;
    }

    .table td {
      font-optical-sizing: auto;
      font-weight: 400;
      font-style: normal;
      font-size: 18px;
      color: #363636;
      padding: 10px;
      border: 1px solid #939393;
    }

    .table td .description {
      color: #555555 !important;
      font-size: 16px;  
    }
 
    .totals {
      display: flex;
      justify-content: flex-end;
      text-align: right;
      margin-top: 20px;
      width: 100%;
      margin-bottom: 5px;
    }
    
    .totals .grid-container {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      align-items: center;
    } 

    .totals p {
      display: block;
    }

    .total-details {
      display: flex;
      flex-direction: column;
    }

    .total-details p{
      padding: 16px;
    }
    
    .totals .result {
      margin-top: 20px;  
      color: #cc3c3a;
      font-size: 2em;
    }

    .terms {
      margin-top: 40px;
    }
  
    .terms .grid-container {
      display: grid;
      grid-template-columns: 1fr 4fr;
      gap: 10px;
      align-items: center;
    }

    .terms h3 {
      margin-bottom: 10px;
    }

    @media print {

      .invoice-container {
        border-left: 2em solid #003366;
        padding: 0 4em 0 2.5em;
      }
      .invoice-header h1 {
        font-size: 6em;
      }

      .table th {
        font-size: 22px
      }
     
      .table td {
        font-size: 14px
      }

      .details{
        line-height: 20px;
      }

     .table td .description {
        font-size: 12px;  
      }
      .details-title{
        font-size: 22px;
      }

      .details-data{
        font-size: 14px;
      }

      .terms .grid-container {
        grid-template-columns: 1fr 3fr;
        gap: 8px;
      }

      @page {
          margin: 0.5cm;
      }
    }
  </style>
</head>
<body>
  <div class="invoice-container">
    <div class="invoice-header">
      <h1>INVOICE</h1>
      <figure>
        ${
          invoiceData["Logo"]
            ? `<img src=${invoiceData["Logo"]} alt="Company Logo">`
            : ""
        }
      </figure>
    </div>
    <div class="details">
      <div class="data-limit">
        <p class="details-title">FROM</p>
        ${
          invoiceData["Sender's Name"]
            ? `<p class="details-data">${invoiceData["Sender's Name"]}</p>`
            : ""
        }
        ${
          invoiceData["Sender's Address"] || invoiceData["Sender's City"]
            ? `<p class="details-data">
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
            ? `<p class="details-data">
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
            ? `<p class="details-data">+91-${invoiceData["Sender's Contact No"]}</p>`
            : ""
        }
        ${
          invoiceData["Sender's Email"]
            ? `<p class="details-data">${invoiceData["Sender's Email"]}</p>`
            : ""
        }
        ${
          invoiceData["Sender's Tax No"]
            ? `<p class="details-data">GST No: ${invoiceData["Sender's Tax No"]}</p>`
            : ""
        }
        ${
          invoiceData["Sender's PAN No"]
            ? `<p class="details-data">PAN No: ${invoiceData["Sender's PAN No"]}</p>`
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
                      <p class="details-data custom-field w-50">${item["fieldName"]}:</p>
                      <p class="details-data w-50"> ${item["fieldValue"]}</p>
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
      <div class="data-limit">
        <p class="details-title">TO</p>
        ${
          invoiceData["Receiver's Name"]
            ? `<p class="details-data">${invoiceData["Receiver's Name"]}</p>`
            : ""
        }
        
        ${
          invoiceData["Receiver's Address"] || invoiceData["Receiver's City"]
            ? `<p class="details-data">
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
            ? `<p class="details-data">
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
            ? `<p class="details-data">+91-${invoiceData["Receiver's Contact No"]}</p>`
            : ""
        }
        ${
          invoiceData["Receiver's Email"]
            ? `<p class="details-data">${invoiceData["Receiver's Email"]}</p>`
            : ""
        }
        ${
          invoiceData["Receiver's Tax No"]
            ? `<p class="details-data">GST No: ${invoiceData["Receiver's Tax No"]}</p>`
            : ""
        }
        ${
          invoiceData["Receiver's PAN No"]
            ? `<p class="details-data">PAN No: ${invoiceData["Receiver's PAN No"]}</p>`
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
                      <p class="details-data custom-field w-50">${item["fieldName"]}:</p>
                      <p class="details-data w-50"> ${item["fieldValue"]}</p>
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
      <div class="invoice-number data-limit">
        <div class="grid-container">
            <p class="details-title" >INVOICE # </p>
            <p class="details-data table-data-limit">${
              invoiceData["Invoice No."]
            }</p>
            <p class="details-title">INVOICE DATE</p>
            <p class="details-data">${invoiceData["Invoice Issue Date"]}</p>
            ${
              invoiceData["Invoice Due Date"]
                ? `<p class="details-title">DUE DATE </p>
                  <p class="details-data">${invoiceData["Invoice Due Date"]}</p>`
                : ""
            }
            ${
              invoiceData["newFields"]?.length > 0
                ? `
                ${invoiceData["newFields"]
                  .map(
                    (item) =>
                      `${
                        item["fieldName"] && item["fieldValue"]
                          ? `
                      <p class="details-title table-data-limit">${item["fieldName"]}:</p>
                      <p class="details-data table-data-limit">${item["fieldValue"]}</p>
                      `
                          : ""
                      } `
                  )
                  .join("")}
                `
                : ""
            }
          </div>
      </div>
    </div>
    <table class="table">
      <thead>
        <tr>
          <th class="align-left  w-10px">No.</th>
          <th class="align-left  w-25">Item Name</th>
          <th class="align-right ">Price</th>
          <th class="align-right">QTY</th>
          ${
            (invoiceData.itemData["taxPercentage"] <= 0 &&
              invoiceData.itemData["discount"] > 0) ||
            (invoiceData.itemData["taxPercentage"] > 0 &&
              !invoiceData.itemData["discount"] > 0)
              ? `<th class="align-right">Amount</th>`
              : ""
          }
          ${
            invoiceData.itemData["discount"] > 0
              ? `<th class="align-right">Discount</th>`
              : ""
          }
          ${
            invoiceData.itemData["taxPercentage"] > 0 &&
            invoiceData.itemData["discount"] > 0
              ? `<th class="align-right">Net Price</th>
              `
              : ""
          }
          ${
            invoiceData.itemData["taxPercentage"] > 0
              ? `<th class="align-right">GST %</th>`
              : ""
          }
          ${
            invoiceData.itemData["taxPercentage"] > 0 &&
            invoiceData.itemData["discount"] <= 0
              ? `<th class="align-right"><div>
              GST ${currencySymbol}</div>
            </th>
            `
              : ""
          }  
          <th class="align-right">Total</th>
        </tr>
      </thead>
      <tbody>
      ${invoiceData["Items"]
        .map(
          (item, index) => `
        <tr>
          <td class="align-left v-align-top">${index + 1}</td>
          <td class="align-left data-limit">
            ${item["name"]}
            <br>
            ${
              isDescriptionAvailable && item["description"]
                ? `<p class="description">${item["description"]}</p>`
                : ""
            }
          </td>
          <td class="align-right table-data-limit">
              <div>${currencySymbol}
              ${item["price"]}</div>
          </td>
          <td class="align-right table-data-limit">${item["quantity"]}</td>
          ${
            (invoiceData.itemData["taxPercentage"] <= 0 &&
              invoiceData.itemData["discount"] > 0) ||
            (invoiceData.itemData["taxPercentage"] > 0 &&
              !invoiceData.itemData["discount"] > 0)
              ? `<td class="align-right table-data-limit">
              <div>${currencySymbol}
              ${item["amount"]}</div></td>`
              : ""
          }
          ${
            invoiceData.itemData["discount"] > 0
              ? `<td class="align-right table-data-limit">
            ${item["discountPercentage"] || 0}%
          </td>`
              : ""
          }
          ${
            invoiceData.itemData["taxPercentage"] > 0 &&
            invoiceData.itemData["discount"] > 0
              ? `<td class="align-right table-data-limit">
              <div>${currencySymbol}
              ${item["afterDiscount"]}</div>
            </td>`
              : ""
          }
          ${
            invoiceData.itemData["taxPercentage"] > 0
              ? `<td class="align-right table-data-limit">
              ${item["taxPercentage"] || 0}%</th>`
              : ""
          }
          ${
            invoiceData.itemData["taxPercentage"] > 0 &&
            invoiceData.itemData["discount"] <= 0
              ? `<td class="align-right table-data-limit">
              <div>${currencySymbol}
              ${item["taxAmount"]}</div>
            </td>`
              : ""
          }
          <td class="align-right table-data-limit">
            <div>${currencySymbol}
            ${item["total"]}</div>
          </td>
        </tr>
        `
        )
        .join("")}
      </tbody>
    </table>
    <div class="totals">
        <div class="grid-container">
              ${
                invoiceData.itemData["taxPercentage"] > 0 ||
                invoiceData.itemData["discount"] > 0
                  ? `
              <p class="details-data">Subtotal</p>
              <p class="details-data data-limit ">
                ${currencySymbol}
                ${invoiceData.itemData["subTotal"]}
              </p>
              ${
                invoiceData.itemData["discount"] > 0
                  ? `
                  <p class="details-data">Discount</p>
                  <p class="details-data data-limit">
                    ${currencySymbol}
                    ${invoiceData.itemData["discount"]}
                  </p> `
                  : ""
              }
              ${
                invoiceData.itemData["discount"] > 0 &&
                invoiceData.itemData["taxPercentage"] > 0
                  ? `<p class="details-data">Net Prize</p>
                <p class="details-data data-limit">
                  ${currencySymbol}
                  ${invoiceData.itemData["afterDiscountAmount"]}
                </p> `
                  : ""
              }
              ${
                invoiceData.itemData["taxPercentage"] > 0
                  ? invoiceData["Sender's Tax Type"] === "IGST"
                    ? `<p class="details-data">
                  ${invoiceData["Sender's Tax Type"]}
              </p>
              <p class="details-data data-limit ">
                ${currencySymbol}
                ${invoiceData.itemData["taxAmount"]}
              </p>`
                    : `
              <p class="details-data">CGST</p>
              <p class="details-data data-limit ">
                ${currencySymbol}
                ${invoiceData.itemData["taxAmount"] / 2}
              </p>
              <p class="details-data">SGST</p>
              <p class="details-data data-limit ">
              ${currencySymbol}
              ${invoiceData.itemData["taxAmount"] / 2}</p>`
                  : ""
              }`
                  : ""
              }
              ${AdvancePaidAmount}
              <p class="details-title result">TOTAL</p>
              <p class="details-title result ">
              ${currencySymbol}
                ${invoiceData.itemData["total"]}
              </p>
      </div>
    </div>
    ${remarksUI}
    <div class="terms">
    ${
      bankDetailsAvailable
        ? `
      <h3 class="details-title">Bank Details</h3>
      <div class="grid-container">
              ${
                invoiceData["Bank Name"]
                  ? `
                    <p class="details-data">Bank Name:</p>
                    <p class="details-data data-limit">${invoiceData["Bank Name"]}</p>
              `
                  : ""
              }
              ${
                invoiceData["Account No"]
                  ? `
                    <p class="details-data">A/c No:</p>
                    <p class="details-data data-limit">${invoiceData["Account No"]}</p>
              `
                  : ""
              }
              ${
                invoiceData["Account Holder Name"]
                  ? `
                    <p class="details-data">A/c Holder Name:</p>
                    <p class="details-data data-limit">${invoiceData["Account Holder Name"]}</p>
              `
                  : ""
              }
              ${
                invoiceData["IFSC Code"]
                  ? `
                    <p class="details-data">IFSC Code:</p>
                    <p class="details-data data-limit">${invoiceData["IFSC Code"]}</p>
              `
                  : ""
              }
              ${
                invoiceData["Account Type"]
                  ? `
                    <p class="details-data">A/c Type:</p>
                    <p class="details-data">${invoiceData["Account Type"]}</p>
              `
                  : ""
              }
              ${
                invoiceData["Bank Address"]
                  ? `
                    <p class="details-data">Bank Address:</p>
                    <p class="details-data data-limit">${invoiceData["Bank Address"]}</p>
              `
                  : ""
              }
        </div>
        `
        : ""
    }
      </div>
  </div>
</body>
</html>
        `;
}
