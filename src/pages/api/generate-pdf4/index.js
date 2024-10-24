const chrome = require("@sparticuz/chromium");
const puppeteer = require("puppeteer-core");
const production = process.env.VERCEL_ENV === "production";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  const { HTMLTemplate3 } = req.body;
  let browser;
  if (production) {
    browser = await puppeteer.launch({
      args: chrome.args,
      defaultViewport: chrome.defaultViewport,
      executablePath: await chrome.executablePath(),
      headless: "new",
      ignoreHTTPSErrors: true,
    });
  }

  const page = await browser.newPage();
  await page.setContent(HTMLTemplate3, { waitUntil: "load" });

  // Generate PDF from the HTML content
  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
  });

  // Set headers and send the PDF as a response
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", 'attachment; filename="generated.pdf"');
  return res.status(200).send(Buffer.from(pdfBuffer));
}
