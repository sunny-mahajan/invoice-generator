export default function generateHTMLTPL001(invoiceData) {
  // Initialize the sub-amount
  let subAmount = 0;

  // Calculate the sub-amount by summing item prices
  invoiceData.Items.forEach((item) => {
    // Convert item price to a number
    subAmount += parseFloat(item["price"]) * parseFloat(item["quantity"]) || 0;
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
    invoiceData["Sender's Bank"] ||
    invoiceData["Sender's Account no"] ||
    invoiceData["Sender's Account Holder Name"] ||
    invoiceData["Sender's IFSC Code"] ||
    invoiceData["Sender's Account Type"];

  invoiceData["Invoice Issue Date"] = formatDate(
    invoiceData["Invoice Issue Date"]
  );
  invoiceData["Invoice Due Date"] = formatDate(invoiceData["Invoice Due Date"]);

  // Retrieve tax percentage from invoice data
  const taxPercentage = parseFloat(invoiceData["Tax percentage"]) || 0;
  // Calculate tax amount
  const taxAmount = (subAmount * taxPercentage) / 100;

  // Calculate the total amount
  const totalAmount = subAmount + taxAmount;

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
            text-align: center;
            width: 100%;
            margin-bottom: 30px;
            box-sizing: border-box;
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
                    width: 110px;
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
        <div class="title-container-cls">
            <h1>Invoice</h1>
        </div>
        <div class="sec2-container">
            <p>Invoice No.<span> ${invoiceData["Invoice No."]}</span></p>
            <p>Invoice Date:<span> ${
              invoiceData["Invoice Issue Date"]
            }</span></p>
            <p>Due Date:<span> ${invoiceData["Invoice Due Date"]}</span></p>
        </div>
        <div class="sec3-container">
            <div>
                <h2>From</h2>
                <p>${invoiceData["Sender's Name"]}</p>
                <p>${invoiceData["Sender's Zipcode"]},${
    invoiceData["Sender's Address"]
  }, ${invoiceData["Sender's City"]}</p>
                <p>${invoiceData["Sender's State"]}, ${
    invoiceData["Sender's Country"]
  }</p>
                <p>${invoiceData["Sender's Contact No"]}</p>
                <p>${invoiceData["Sender's Email"]}</p>
                <p>${invoiceData["Sender's GST"]}</p>
                <p>${invoiceData["Sender's PAN"]}</p>
            </div>
            <div>
                <h2>To</h2>
                <p>${invoiceData["Receiver's Name"]}</p>
                <p>${invoiceData["Receiver's Zipcode"]},${
    invoiceData["Receiver's Address"]
  },${invoiceData["Receiver's City"]}</p>
                <p>${invoiceData["Receiver's State"]}, ${
    invoiceData["Receiver's Country"]
  }</p>
                <p>${invoiceData["Receiver's Contact No"]}</p>
                <p>${invoiceData["Receiver's email"]}</p>
                <p>${invoiceData["Receiver's GST"]}</p>
                <p>${invoiceData["Receiver's PAN"]}</p>
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
                   invoiceData["Tax percentage"] > 0
                     ? `
                  <div class="sub-sec5-item">
                        <p class="sub-sec5-title">Subtotal</p><span>${currencySymbol(
                          invoiceData["Currency"]
                        )}${subAmount}</span>
                    </div>
                    <div class="sub-sec5-item">
                        <p class="sub-sec5-title">${invoiceData["Tax Type"]} ${
                         invoiceData["Tax percentage"]
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
            invoiceData["Sender's Bank"]
              ? `
          <div class="sub-sec7-container">
              <span class="sub-sec7-title">Bank Name:</span><span>${invoiceData["Sender's Bank"]}</span>
          </div>`
              : ""
          }
          ${
            invoiceData["Sender's Account no"]
              ? `
          <div class="sub-sec7-container">
              <span class="sub-sec7-title">A/c No:</span><span>${invoiceData["Sender's Account no"]}</span>
          </div>`
              : ""
          }
          ${
            invoiceData["Sender's Account Holder Name"]
              ? `
          <div class="sub-sec7-container">
              <span class="sub-sec7-title">A/c Holder Name:</span><span>${invoiceData["Sender's Account Holder Name"]}</span>
          </div>`
              : ""
          }
          ${
            invoiceData["Sender's IFSC Code"]
              ? `
          <div class="sub-sec7-container">
              <span class="sub-sec7-title">IFSC Code:</span><span>${invoiceData["Sender's IFSC Code"]}</span>
          </div>`
              : ""
          }
          ${
            invoiceData["Sender's Account Type"]
              ? `
          <div class="sub-sec7-container">
              <span class="sub-sec7-title">A/c Type:</span><span>${invoiceData["Sender's Account Type"]}</span>
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
