const chrome = require("@sparticuz/chromium");
const puppeteer = require("puppeteer-core");
const production = process.env.NODE_ENV === "production";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  if (production) {
    const browser = await puppeteer.launch({
      args: chrome.args,
      defaultViewport: chrome.defaultViewport,
      executablePath: await chrome.executablePath(),
      headless: "new",
      ignoreHTTPSErrors: true,
    });
  }
  res.send("browser");
  const page = await browser.newPage();
}
