export default function generateHTMLTPL007(invoiceData) {
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
    return `${day}-${month}-${year}`;
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
      background-color: #fff !important;
    }
      
    .invoice-container {
      font-family: "Bebas Neue", sans-serif !important;
      font-weight: 400;
      font-style: normal;
    }

    p{
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

    .invoice-container img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
    
    .invoice-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      position: relative;
      background: white; 
      color: white !important;
      z-index: 1;
      padding: 2em 4em;
      height: 270px;
    }

    .invoice-header::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: #004a7e;
      z-index: -1; 
      clip-path: polygon(0 0, 100% 0, 100% 60%, 0% 100%);
    }

    .invoice-header::after {
      content: '';
      position: absolute;
      bottom: 10px;
      left: 0;
      width: 100%;
      height: 100%;
      background: #fff;
      z-index: -1; 
      clip-path: polygon(0 96%, 100% 56%, 100% 60%, 0% 100%);
    }

    .invoice-header h1 {
      font-size: 6rem;
      line-height: unset;
      letter-spacing: unset;
      margin: 0;
      color: #fff !important;
    }

    .invoice-header figure {
      margin: 0;
      padding: 0;
      height: 100px;
    }

    .invoice-header span{
      display: block;
      color: #fff !important;
    }

    .details {
      display: flex;
      justify-content: space-between;
      padding: 0 4em;
      gap:10px;
      margin-top: 20px;
    }

    .details div span {
      display: block;
    }

    .details-title{
      font-size: 24px;
      font-weight: 500;
      color: #5983af !important;
      line-height: unset;
      letter-spacing: unset;
    }

    .details-data{
      font-family: "Urbanist", sans-serif;
      font-optical-sizing: auto;
      font-weight: 400;
      font-style: normal;
      font-size: 18px;
      color: #000 !important;
      line-height: unset;
      letter-spacing: unset;
    }

    .custom-field{
      display: unset !important;
      font-weight: 600;
    }

    .custom-field-value{
      display: unset !important;
    }
    
    .invoice-number .grid-container {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      align-items: center;
    } 

    .table-container{
      padding: 0 4em;
    }

    .table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }

    .table th {
      font-size: 24px;
      font-weight: 500;
      color: #fff !important;
      padding: 0 0.4em;
      background: #5983af;
    }

    .table td {
      font-family: "Urbanist", sans-serif;
      font-optical-sizing: auto;
      font-weight: 400;
      font-style: normal;
      font-size: 18px;
      color: #000 !important;
      padding: 10px;
    }

    .table td .description {
      color: #555555 !important;
      font-size: 16px;  
    }

    .totals {
      width: 100%;
      margin-bottom: 5px;
      text-align: right;
    }
    
    .totals .grid-container {
      display: grid;
      grid-template-columns: 4fr 1fr;
      margin: 0 4em;
      align-items: center;
    }
    
    .totals span {
      padding: 10px;
    }

    .totals .result {
      font-size: 2em;
      margin-top: 0.5em; 
      color: #5983af !important;
    }

    .terms {
      position: relative;
      z-index: 0;
      padding: 2em 4em; 
      margin-top: 40px;
      font-size: 12px;
      text-align: end;
      min-height: 270px;
    }

    .terms::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: #004a7e;
      z-index: -1; 
      clip-path: polygon(0 60%, 100% 0, 100% 100%, 0% 100%);
    }

    .terms::after {
      content: '';
      position: absolute;
      top: 10px;
      left: 0;
      width: 100%;
      height: 100%;
      background: #fff;
      z-index: -1; 
      clip-path: polygon(0 60%, 100% 0, 100% 3%, 0 63%);
    }

    .terms .grid-container {
      display: grid;
      grid-template-columns: 4fr 1fr;
      gap: 10px;
      align-items: center;
    }

    .terms h3 {
      margin-top: 1.2em;
      margin-bottom: 10px;
      color: #fff !important;
    }

    .terms p {
      color: #fff !important;
    }

    @media print {
      .invoice-header{
        height: 180px;
      }
      .invoice-header h1 {
        font-size: 4.5em;
      }
      .table th {
        font-size: 18px
      }
     
      .table td {
        font-size: 14px
      }

     .table td .description {
        font-size: 12px;  
      }

      .details{
        line-height: 20px;
      }

      .details-title{
        font-size: 18px;
      }

      .details-data{
        font-size: 14px;
      }

      .terms{
        min-height: 200px;
        page-break-inside: avoid;
      }

      .terms .grid-container {
        grid-template-columns: 3fr 1fr;
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
      <figure>
         ${
           invoiceData["Logo"]
             ? `<img src=${invoiceData["Logo"]} alt="Company Logo">`
             : ""
         }
      </figure>
      <h1>INVOICE</h1>
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
            ? `<span class="details-data">+91-${invoiceData["Sender's Contact No"]}</span>`
            : ""
        }
        ${
          invoiceData["Sender's Email"]
            ? `<span class="details-data">${invoiceData["Sender's Email"]}</span>`
            : ""
        }
        ${
          invoiceData["Sender's Tax No"]
            ? `<span class="details-data">GST No: ${invoiceData["Sender's Tax No"]}</span>`
            : ""
        }
        ${
          invoiceData["Sender's PAN No"]
            ? `<span class="details-data">PAN No: ${invoiceData["Sender's PAN No"]}</span>`
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
            ? `<span class="details-data">+91-${invoiceData["Receiver's Contact No"]}</span>`
            : ""
        }
        ${
          invoiceData["Receiver's Email"]
            ? `<span class="details-data">${invoiceData["Receiver's Email"]}</span>`
            : ""
        }
        ${
          invoiceData["Receiver's Tax No"]
            ? `<span class="details-data">GST No: ${invoiceData["Receiver's Tax No"]}</span>`
            : ""
        }
        ${
          invoiceData["Receiver's PAN No"]
            ? `<span class="details-data">PAN No: ${invoiceData["Receiver's PAN No"]}</span>`
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
            <span class="details-title align-left" >INVOICE # </span>
            <span class="details-data align-right">${
              invoiceData["Invoice No."]
            }</span>
            <span class="details-title align-left">INVOICE DATE</span>
            <span class="details-data align-right">${
              invoiceData["Invoice Issue Date"]
            }</span>
            ${
              invoiceData["Invoice Due Date"]
                ? `<span class="details-title align-left">DUE DATE </span>
                  <span class="details-data align-right">${invoiceData["Invoice Due Date"]}</span>`
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
                      <span class="details-title align-left">${item["fieldName"]}:</span>
                      <span class="details-data align-right">${item["fieldValue"]}</span>
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
    <div class="table-container">
    <table class="table">
      <thead>
        <tr>
          <th class="align-left w-10px">No.</th>
          <th class="align-left w-25">Item Name</th>
          <th class="align-left">Price</th>
          <th class="align-right">QTY</th>
          <th class="align-right">Amount</th>
          <th class="align-right">Tax %</th>
          <th class="align-right">Tax ${currencySymbol(
            invoiceData["Currency"]
          )}</th>
          <th class="align-right">Total</th>
        </tr>
      </thead>
      <tbody>
         ${invoiceData["Items"]
           .map(
             (item, index) => `
        <tr>
          <td class="align-left v-align-top">${index + 1}</td>
          <td class="align-left">
            ${item["name"]}
            </br>
            ${
              isDescriptionAvailable && item["description"]
                ? `<span class="description">${item["description"]} </span>`
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
            ${(
              item["price"] *
              item["quantity"] *
              (item["taxPercentage"] / 100)
            ).toFixed(1)}
          </td>
          <td class="align-right">
            ${currencySymbol(invoiceData["Currency"])}
            ${
              item["price"] * item["quantity"] +
              item["price"] * item["quantity"] * (item["taxPercentage"] / 100)
            }
          </td>
        </tr>
        `
           )
           .join("")}
      </tbody>
    </table>
    </div>
    <div class="totals">
      <div class="grid-container">
            ${
              taxPercentage > 0
                ? `
              <span class="details-data">Subtotal</span>
              <span class="details-data">${currencySymbol(
                invoiceData["Currency"]
              )}${subAmount.toFixed(1)}</span>
              ${
                invoiceData["Sender's Tax Type"] === "IGST"
                  ? `
              <span class="details-data">${
                invoiceData["Sender's Tax Type"]
              } (${taxPercentage.toFixed(1)}%)</span>
              <span class="details-data">${currencySymbol(
                invoiceData["Currency"]
              )}${taxAmount.toFixed(1)}</span>
              `
                  : `
              <span class="details-data">CGST(${(taxPercentage / 2).toFixed(
                1
              )}%)</span>
              <span class="details-data">${currencySymbol(
                invoiceData["Currency"]
              )}${(taxAmount / 2).toFixed(1)}</span>
              <span class="details-data">SGST(${(taxPercentage / 2).toFixed(
                1
              )}%)</span>
              <span class="details-data">${currencySymbol(
                invoiceData["Currency"]
              )}${(taxAmount / 2).toFixed(1)}</span>
              `
              } `
                : ""
            }
              <span class="details-title result">TOTAL</span>
              <span class="details-title result">${currencySymbol(
                invoiceData["Currency"]
              )}${totalAmount.toFixed(1)}</span>
      </div>
    </div>
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
                    <p class="details-data">${invoiceData["Bank Name"]}</p>
              `
              : ""
          }
              ${
                invoiceData["Account No"]
                  ? `
                    <p class="details-data">A/c No:</p>
                    <p class="details-data">${invoiceData["Account No"]}</p>
              `
                  : ""
              }
              ${
                invoiceData["Account Holder Name"]
                  ? `
                    <p class="details-data">A/c Holder Name:</p>
                    <p class="details-data">${invoiceData["Account Holder Name"]}</p>
              `
                  : ""
              }
              ${
                invoiceData["IFSC Code"]
                  ? `
                    <p class="details-data">IFSC Code:</p>
                    <p class="details-data">${invoiceData["IFSC Code"]}</p>
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
                    <p class="details-data">${invoiceData["Bank Address"]}</p>
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
