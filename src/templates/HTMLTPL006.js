export default function generateHTMLTPL006(invoiceData) {
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
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Urbanist:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">
  <title>Invoice</title> 
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #fff;
    }
    .d-flex{
      display: flex;
    }
    
    .align-left{
      text-align: left;
    } 

    .align-right{
      text-align: right;
    }

    .border-left{
      border-left: 3px solid #013264;
    }

    .border-right{
      border-right: 3px solid #013264;
    }

    .v-align-top{
      vertical-align: top;
    }
    
    .w-50{
      width: 50%;
    }
    
    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
    
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 10px;
    }

    .header h1 {
      font-size: 10rem;
      color: #013264;
      margin: 0;
    }

    .header figure {
      margin: 0;
      padding: 0;
      height: 100px;
    }

    .details-title{
      font-size: 28px;
      font-weight: 500;
      color: #013264;
    }

    .details-data{
      font-family: "Urbanist", sans-serif;
      font-optical-sizing: auto;
      font-size: 22px;
      font-weight: 400;
      font-style: normal;
      color: #777777;
    }

    .details {
      margin-top: 20px;
      display: flex;
      justify-content: space-between;
    }

    .details {
      margin-top: 20px;
      display: flex;
      justify-content: space-between;
    }

    .details div span {
      display: block;
    }

    .custom-field{
      display: unset !important;
      font-weight: 600;
    }

    .custom-field-value{
      display: unset !important;
    }

    .invoice-container {
      font-family: "Bebas Neue", sans-serif !important;
      font-weight: 400;
      font-style: normal;
      border-left: 2.5em solid #003366;
      padding: 0 4em 0 2.5em;
    }

    .invoice-number .grid-container {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      align-items: start;
    } 

    .invoice-number div span {
      display: block;
    }
    
    .invoice-number .grid-container .data {
      display: flex;
      flex-direction: column;
      height: 100%;
      justify-content: space-between;
      align-items: flex-start;
    }

    .table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }

    .table th {
      font-size: 2em;
      font-weight: 500;
      color: #013264;
      padding: 0 0.5em;
    }

    .table td {
      font-family: "Urbanist", sans-serif;
      font-optical-sizing: auto;
      font-weight: 400;
      font-style: normal;
      font-size: 1.4em;
      font-weight: 400;
      color: #777777;
      padding: 16px;
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
      align-items: start;
    } 

    .totals span {
      display: block;
    }

    .total-details {
      display: flex;
      flex-direction: column;
    }

    .total-details span{
      padding: 16px;
    }
    
    .totals .result {
      margin-top: 1em;  
      color: #cc3c3a;
      font-size: 2em;
    }

    .signature {
      margin-top: 40px;
      text-align: right;
      font-family: cursive;
      font-size: 18px;
    }

    .terms {
      margin-top: 40px;
      font-size: 12px;
    }
  
    .terms .grid-container {
      display: grid;
      grid-template-columns: 1fr 6fr;
      gap: 10px;
      align-items: start;
    }

    .terms h3 {
      margin-bottom: 10px;
    }
  </style>
</head>
<body>
  <div class="invoice-container">
    <div class="header">
      <h1>INVOICE</h1>
      <figure>
        ${invoiceData["Logo"] ? `<img src=${invoiceData["Logo"]} alt="Company Logo">` : ""}
      </figure>
    </div>
    <div class="details">
      <div>
        <span class="details-title">FROM</span>
        ${
          invoiceData["Sender's Name"]
            ? `<span class="details-data">${invoiceData["Sender's Name"]}</span>`
            : ""
        }
        ${
          invoiceData["Sender's Zipcode"] ||
          invoiceData["Sender's Address"] ||
          invoiceData["Sender's City"]
            ? `<span class="details-data">
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
          </span>`
            : ""
        }
        ${
          invoiceData["Sender's State"]
            ? `<span class="details-data">
          ${
            invoiceData["Sender's State"]
              ? `${invoiceData["Sender's State"]}, `
              : ""
          }
          </span>`
            : ""
        }
        ${
          invoiceData["Sender's Contact No"]
            ? `<span class="details-data">+91${invoiceData["Sender's Contact No"]}</span>`
            : ""
        }
        ${
          invoiceData["Sender's Email"]
            ? `<span class="details-data">${invoiceData["Sender's Email"]}</span>`
            : ""
        }
        ${
          invoiceData["Sender's Tax No"]
            ? `<span class="details-data">${invoiceData["Sender's Tax No"]}</span>`
            : ""
        }
        ${
          invoiceData["Sender's PAN No"]
            ? `<span class="details-data">${invoiceData["Sender's PAN No"]}</span>`
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
                      <span class="details-data custom-field">${item["fieldName"]}:</span><span class="details-data custom-field-value"> ${item["fieldValue"]}</span><br>
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
        <span class="details-title">TO</span>
        ${
          invoiceData["Receiver's Name"]
            ? `<span class="details-data">${invoiceData["Receiver's Name"]}</span>`
            : ""
        }
        
        ${
          invoiceData["Receiver's Zipcode"] ||
          invoiceData["Receiver's Address"] ||
          invoiceData["Receiver's City"]
            ? `<span class="details-data">
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
          </span>`
            : ""
        }
        
        ${
          invoiceData["Receiver's State"]
            ? `<span class="details-data">
            ${
              invoiceData["Receiver's State"]
                ? `${invoiceData["Receiver's State"]}, `
                : ""
            }
          </span>`
            : ""
        }
      
        ${
          invoiceData["Receiver's Contact No"]
            ? `<span class="details-data">+91${invoiceData["Receiver's Contact No"]}</span>`
            : ""
        }
        ${
          invoiceData["Receiver's Email"]
            ? `<span class="details-data">${invoiceData["Receiver's Email"]}</span>`
            : ""
        }
        ${
          invoiceData["Receiver's Tax No"]
            ? `<span class="details-data">${invoiceData["Receiver's Tax No"]}</span>`
            : ""
        }
        ${
          invoiceData["Receiver's PAN No"]
            ? `<span class="details-data">${invoiceData["Receiver's PAN No"]}</span>`
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
                      <span class="details-data custom-field">${item["fieldName"]}:</span><span class="details-data custom-field-value"> ${item["fieldValue"]}</span><br>
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
      <div class="invoice-number">
      <div class="grid-container">
          <div class="title">
          <span class="details-title align-left" >INVOICE # </span>
          <span class="details-title align-left">INVOICE DATE</span>
          ${
            invoiceData["Invoice Due Date"]
              ? `<span class="details-title align-left">DUE DATE </span>`
              : ""
          }
          ${ invoiceData["newFields"]?.length > 0 ? `
              ${invoiceData["newFields"].map((item) =>
                    `${
                      item["fieldName"] && item["fieldValue"] ? `
                    <span class="details-title align-left">${item["fieldName"]}:
                    ` : "" } ` ).join("")}
              ` : ""
          }
          </div>
          <div class="data">
            <span class="details-data align-right">${invoiceData["Invoice No."]}</span>
            <span class="details-data align-right">${invoiceData["Invoice Issue Date"]}</span>
            ${invoiceData["Invoice Due Date"] ? 
              `<span class="details-data align-right">${invoiceData["Invoice Due Date"]}</span>`
              : "" }
            ${ invoiceData["newFields"]?.length > 0 ? `
                ${invoiceData["newFields"].map((item) =>
                      `${item["fieldName"] && item["fieldValue"] ? `
                      </span><span class="details-data align-right">${item["fieldValue"]}</span>
                      ` : "" }` ).join("")}
                  ` : ""
            }
          </div>
        </div>
      </div>
    </div>
    <table class="table">
      <thead>
        <tr>
          <th class="align-left border-left">No.</th>
          <th class="align-left border-left">Item Name</th>
          <th class="align-left border-left">Price</th>
          <th class="align-right border-right">QTY</th>
          <th class="align-right border-right">Amount</th>
          <th class="align-right border-right">Tax %</th>
          <th class="align-right border-right">Tax ${currencySymbol(
            invoiceData["Currency"]
          )}</th>
          <th class="align-right border-right">Total</th>
        </tr>
      </thead>
      <tbody>
      ${invoiceData["Items"]
        .map((item, index) => `
        <tr>
          <td class="align-left v-align-top">${index + 1}</td>
          <td class="align-left">
            ${item["name"]}
            </br>
            ${isDescriptionAvailable && item["description"]
                  ? `${item["description"]}`
                  : ""
            }
          </td>
          <td class="align-left">
              ${currencySymbol(invoiceData["Currency"])}
              ${item["price"]}
          </td>
          <td class="align-right">${item["quantity"]}</td>
          <td class="align-right">
            ${currencySymbol(invoiceData["Currency"])}
            ${item["price"] * item["quantity"]}
          </td>
          <td class="align-right">
            ${item["taxPercentage"]}%
          </td>
          <td class="align-right">
            ${currencySymbol(invoiceData["Currency"])}
            ${(item["price"] * item["quantity"] * (item["taxPercentage"] / 100)).toFixed(1)}
          </td>
          <td class="align-right">
            ${currencySymbol(invoiceData["Currency"])}
            ${item["price"] * item["quantity"] + item["price"] * item["quantity"] * (item["taxPercentage"] / 100)}
          </td>
        </tr>
        `
        )
        .join("")}
      </tbody>
    </table>
    <div class="totals">
        <div class="grid-container">
          <div class="title">
            ${taxPercentage > 0 ? `
              <span class="details-data">Subtotal</span>
              ${invoiceData["Sender's Tax Type"] === "IGST" ? `
              <span class="details-data">${invoiceData["Sender's Tax Type"]} (${taxPercentage.toFixed(1)}%)</span> 
              ` : `
              <span class="details-data">CGST(${(taxPercentage / 2 ).toFixed(1)}%)</span>
              <span class="details-data">SGST(${(taxPercentage / 2 ).toFixed(1)}%)</span>
              ` } ` : ""}
              <span class="details-title result">TOTAL</span>
          </div>
          <div class="data">
              ${taxPercentage > 0 ? `
                <span class="details-data">
                  ${currencySymbol(invoiceData["Currency"])}
                  ${subAmount.toFixed(1)}
                </span> 
                ${invoiceData["Sender's Tax Type"] === "IGST" ? `
                 <span class="details-data">
                  ${currencySymbol(invoiceData["Currency"])}
                  ${(taxAmount).toFixed(1)}
                </span> ` : `
               <span class="details-data">
                  ${currencySymbol(invoiceData["Currency"])}
                  ${(taxAmount / 2).toFixed(1)}
              </span>
              <span class="details-data">
                  ${currencySymbol(invoiceData["Currency"])}
                  ${(taxAmount / 2).toFixed(1)}
              </span>
                ` } ` : ""}
              <span class="details-title result">
                ${currencySymbol(invoiceData["Currency"])}
                ${totalAmount.toFixed(1)}
              </span>
          </div>
      </div>
    </div>
    <div class="terms">
    ${bankDetailsAvailable ? `
      <h3 class="details-title">Bank Details</h3>
      <div class="grid-container">
          <div class="title">
                  ${invoiceData["Bank Name"] ? `
                    <p class="details-data">Bank Name:</p>
              ` : ""
              }
              ${invoiceData["Account No"] ? `
                    <p class="details-data">A/c No:</p>
              ` : ""
              }
              ${invoiceData["Account Holder Name"] ? `
                    <p class="details-data">A/c Holder Name:</p>
              ` : ""
              }
              ${invoiceData["IFSC Code"] ? `
                    <p class="details-data">IFSC Code:</p>
              ` : ""
              }
              ${invoiceData["Account Type"] ? `
                    <p class="details-data">A/c Type:</p>
              ` : ""
              }
              ${invoiceData["Bank Address"] ? `
                    <p class="details-data">Bank Address:</p>
              ` : ""
              }
          </div>
          <div class="data">
            ${invoiceData["Bank Name"] ? `
                  <p class="details-data">${invoiceData["Bank Name"]}</p>
            ` : ""
            }
            ${invoiceData["Account No"] ? `
                  <p class="details-data">${invoiceData["Account No"]}</p>
            ` : ""
            }
            ${invoiceData["Account Holder Name"] ? `
                  <p class="details-data">${invoiceData["Account Holder Name"]}</p>
            ` : ""
            }
            ${invoiceData["IFSC Code"] ? `
                  <p class="details-data">${invoiceData["IFSC Code"]}</p>
            ` : ""
            }
            ${invoiceData["Account Type"] ? `
                  <p class="details-data">${invoiceData["Account Type"]}</p>
            ` : ""
            }
            ${invoiceData["Bank Address"] ? `
                  <p class="details-data">${invoiceData["Bank Address"]}</p>
            ` : ""
            }
          </div>
        </div>
        ` : ""}
      </div>
  </div>
</body>
</html>
        `;
}