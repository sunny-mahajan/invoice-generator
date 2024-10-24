// const convertHTMLToPDF = require("pdf-puppeteer");
// export default async function handler(req, res) {
//   console.log(req.body, "req.body");
//   if (req.method === "POST") {
//     // Check if the method is POST
//     try {
//       const { HTMLTemplate1 } = req.body;

//       convertHTMLToPDF(
//         HTMLTemplate1,
//         (pdf) => {
//           res.setHeader("Content-Type", "application/pdf");
//           res.send(pdf);
//         },
//         { printBackground: true },
//         null,
//         true
//       );
//       console.log("-----------------");
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: JSON.stringify(error) });
//     }
//   } else {
//     // Return 405 if the method is not POST
//     res.status(405).json({ error: "Method not allowed" });
//   }
// }

const puppeteer = require("puppeteer");

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { HTMLTemplate1 } = req.body;
  if (!HTMLTemplate1) {
    return res.status(400).json({ error: "HTMLTemplate2 is required" });
  }

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setContent(HTMLTemplate1, { waitUntil: "load" });

    const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="generated.pdf"'
    );
    return res.status(200).send(Buffer.from(pdfBuffer));
  } catch (error) {
    console.error("Error generating PDF:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while generating the PDF" });
  } finally {
    if (browser) await browser.close();
  }
}
