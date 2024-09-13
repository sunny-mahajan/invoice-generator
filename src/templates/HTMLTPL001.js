export default function generateHTMLTPL001(invoiceData) {
  return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
        <style>
            .header {
                color: #FD7037;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                gap: 20px;
            }
            .heading {
                font-size: 50px;
            }
            .company-name {
                font-size: 30px;
            }
        </style>
    </head>
    <body>
        <div class="header">
            <div class="heading">INVOICE</div>
            <div class="company-name">HANSON & BROS CONSTRUCTION</div>
        </div>
    </body>
  </html>
  `;
}
