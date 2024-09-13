const puppeteer = require("puppeteer");

export default async function handler(req, res) {
  try {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = (await browser.pages())[0]
  
    const htmlContent = `
    <html>
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

    // Set the static HTML content
    await page.setContent(htmlContent);
  
    await page.waitForSelector("body")
  
    const pdfBuffer = await page.pdf({ format: 'A4' })
    await browser.close();
    console.log(`pdfBuffer: `, pdfBuffer);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'attachment; filename="generated-pdf.pdf"');
    res.status(200).send(pdfBuffer);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while generating the PDF" });
  }
}
