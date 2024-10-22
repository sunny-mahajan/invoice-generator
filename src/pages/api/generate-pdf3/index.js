const isProduction = process.env.AWS_LAMBDA_FUNCTION_VERSION;
const chromium = isProduction ? require("chrome-aws-lambda") : null;
const puppeteer = isProduction
  ? require("puppeteer-core")
  : require("puppeteer");

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { HTMLTemplate2 } = req.body;

      let browser;
      if (isProduction) {
        browser = await puppeteer.launch({
          args: chromium.args,
          defaultViewport: chromium.defaultViewport,
          executablePath: await chromium.executablePath,
          headless: chromium.headless,
          ignoreHTTPSErrors: true,
        });
      } else {
        browser = await puppeteer.launch({
          headless: true,
        });
      }

      const page = await browser.newPage();
      await page.setContent(HTMLTemplate2, { waitUntil: "load" });

      // Generate PDF from the HTML
      const pdfBuffer = await page.pdf({
        format: "A4",
        printBackground: true,
      });

      await browser.close();

      // Set headers and send the generated PDF
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        'attachment; filename="generated.pdf"'
      );
      res.status(200).send(Buffer.from(pdfBuffer)); // Ensure to send the PDF buffer as a Buffer
    } catch (error) {
      console.error("Error generating PDF:", error.message);
      res.status(500).json({
        error: "An error occurred while generating the PDF",
        details: error.message,
      });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
