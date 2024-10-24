const production = process.env.VERCEL_ENV === "production";
const chrome = production ? require("@sparticuz/chromium") : null;
const puppeteer = production ? require("puppeteer-core") : require("puppeteer");

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  const { HTMLTemplate } = req.body;

  if (!HTMLTemplate) {
    return res.status(400).json({ error: "HTMLTemplate2 is required" });
  }

  let browser;
  try {
    if (production) {
      browser = await puppeteer.launch({
        args: chrome.args,
        defaultViewport: chrome.defaultViewport,
        executablePath: await chrome.executablePath(),
        headless: "new",
        ignoreHTTPSErrors: true,
      });
    } else {
      browser = await puppeteer.launch({ headless: true });
    }

    const page = await browser.newPage();
    await page.setContent(HTMLTemplate, { waitUntil: "load" });

    // Generate PDF from the HTML content
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
    });

    // Set headers and send the PDF as a response
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="generated.pdf"'
    );
    return res.status(200).send(Buffer.from(pdfBuffer));
  } catch (error) {
    return res.status(500).json({
      error: "An error occurred while generating the PDF",
      details: error.message,
    });
  } finally {
    // Ensure the browser is closed to avoid memory leaks
    if (browser) {
      await browser.close();
    }
  }
}
