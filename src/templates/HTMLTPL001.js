export default function generateHTMLTPL001(invoiceData) {
  // Initialize the sub-amount
  let subAmount = 0;

  // Calculate the sub-amount by summing item prices
  invoiceData.Items.forEach((item) => {
    // Convert item price to a number
    subAmount += parseFloat(item["price"]) * item["quantity"] || 0;
  });

  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = `0${d.getMonth() + 1}`.slice(-2); // Adding leading zero
    const day = `0${d.getDate()}`.slice(-2); // Adding leading zero
    return `${month}-${day}-${year}`;
  };

  invoiceData['Invoice Issue Date'] = formatDate(invoiceData['Invoice Issue Date']);
  invoiceData['Invoice Due Date'] = formatDate(invoiceData['Invoice Due Date']);

  // Retrieve tax percentage from invoice data
  const taxPercentage = parseFloat(invoiceData["Tax percentage"]) || 0;

  // Calculate tax amount
  const taxAmount = (subAmount * taxPercentage) / 100;

  // Calculate the total amount
  const totalAmount = subAmount + taxAmount;

  const remarksUI = invoiceData["Remarks"] ? `<div class="sec6-container">
            <p>Notes:</p>
            <p>${invoiceData["Remarks"]}</p>
        </div>` : "";

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
            margin-bottom: 40px;
            box-sizing: border-box;
        }
        .sec3-container {
            display: flex;
            justify-content: space-between;
            width: 100%;
            margin-bottom: 40px;
            box-sizing: border-box;
        }
        .sec4-container {
            display: flex;
            width: 100%;
            justify-content: space-between;
            margin-bottom: 20px;
            box-sizing: border-box;
            .sub-sec4-container{
                width: 100%;
                min-width: 400px;
                .sub-sec4-header {
                    display: flex;
                    justify-content: space-between;
                }
                .sub-sec4-item {
                    display: flex;
                    justify-content: space-between;
                }
            }
        }
        .sec5-container {
            display: flex;
            width: 100%;
            justify-content: flex-end;
            margin-bottom: 40px;
            box-sizing: border-box;
            .sub-sec5-container {
                display: flex;
                align-items: center;
                gap: 60px;
                .sub-sec5-title {
                    margin: 0;
                    width: 110px;
                }
            }
        }
        .sec6-container {
            width: 100%;
            margin-bottom: 20px;
            box-sizing: border-box;
        }
        .sec7-container {
            width: 100%;
            background-color: rgb(240, 80, 80);
            display: flex;
            align-items: center;
            justify-content: center;
            box-sizing: border-box;
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
                <p>${invoiceData["Sender's Address"]}, ${invoiceData["Sender's City"]}</p>
                <p>${invoiceData["Sender's State"]}</p>
                <p>${invoiceData["Sender's Contact No"]}</p>
                <p>${invoiceData["Sender's Email"]}</p>
            </div>
            <div>
                <h2>To</h2>
                <p>${invoiceData["Receiver's Name"]}</p>
                <p>${invoiceData["Receiver's Address"]}, ${invoiceData["Receiver's City"]}</p>
                <p>${invoiceData["Receiver's State"]}</p>
                <p>${invoiceData["Receiver's Contact No"]}</p>
                <p>${invoiceData["Receiver's email"]}</p>
            </div>
        </div>
        <div class="sec4-container">
            <div class="sub-sec4-container">
                 <div class="sub-sec4-header">
                    <h2>Item Name</h2>
                    <h2>Item Quantity</h2>
                    <h2>Item Price</h2>
                </div>
                ${invoiceData["Items"]
                  .map(
                    (item) => `
                    <div class="sub-sec4-item">
                        <p>${item["name"]}</p>
                        <p>${item["quantity"]}</p>
                        <p>${item["price"]}</p>
                    </div>
                `
                  )
                  .join("")}
                
            </div>
        </div>
        <div class="sec5-container">
            <div>
                <div class="sub-sec5-container">
                    <h2 class="sub-sec5-title">Total</h2><span>${totalAmount}</span>
                </div>
            </div>
        </div>
        ${remarksUI}
    </div>
</body>
</html>
    `;
}
