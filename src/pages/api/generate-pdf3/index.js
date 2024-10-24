// const isProduction = process.env.AWS_LAMBDA_FUNCTION_VERSION;
// const chromium = isProduction ? require("chrome-aws-lambda") : null;
// const puppeteer = isProduction
//   ? require("puppeteer-core")
//   : require("puppeteer");

// export default async function handler(req, res) {
//   if (req.method === "POST") {
//     try {
//       const { HTMLTemplate2 } = req.body;

//       let browser;
//       if (isProduction) {
//         browser = await puppeteer.launch({
//           args: chromium.args,
//           defaultViewport: chromium.defaultViewport,
//           executablePath: await chromium.executablePath,
//           headless: chromium.headless,
//           ignoreHTTPSErrors: true,
//         });
//       } else {
//         browser = await puppeteer.launch({
//           headless: true,
//         });
//       }

//       const page = await browser.newPage();
//       await page.setContent(HTMLTemplate2, { waitUntil: "load" });

//       // Generate PDF from the HTML
//       const pdfBuffer = await page.pdf({
//         format: "A4",
//         printBackground: true,
//       });

//       await browser.close();

//       // Set headers and send the generated PDF
//       res.setHeader("Content-Type", "application/pdf");
//       res.setHeader(
//         "Content-Disposition",
//         'attachment; filename="generated.pdf"'
//       );
//       res.status(200).send(Buffer.from(pdfBuffer)); // Ensure to send the PDF buffer as a Buffer
//     } catch (error) {
//       console.error("Error generating PDF:", error.message);
//       res.status(500).json({
//         error: "An error occurred while generating the PDF",
//         details: error.message,
//       });
//     }
//   } else {
//     res.status(405).json({ error: "Method not allowed" });
//   }
// }

const isProduction = process.env.AWS_LAMBDA_FUNCTION_VERSION;
const chromium = isProduction ? require("chrome-aws-lambda") : null;
const puppeteer = isProduction
  ? require("puppeteer-core")
  : require("puppeteer");

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { HTMLTemplate2 } = req.body;

  // Check if HTMLTemplate2 is provided
  if (!HTMLTemplate2) {
    return res.status(400).json({ error: "HTMLTemplate2 is required" });
  }

  let browser;
  try {
    // Launch Puppeteer based on the environment
    if (isProduction) {
      browser = await puppeteer.launch({
        args: chromium.args,
        executablePath:
          (await chromium.executablePath) || "/usr/bin/chromium-browser", // Fallback in case chrome-aws-lambda doesn't work
        headless: chromium.headless,
        ignoreHTTPSErrors: true, // Ensure HTTPS errors are ignored
      });
    } else {
      browser = await puppeteer.launch({ headless: true });
    }

    const page = await browser.newPage();
    await page.setContent(HTMLTemplate2, { waitUntil: "load" });

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
    console.error("Error generating PDF:", error);
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
