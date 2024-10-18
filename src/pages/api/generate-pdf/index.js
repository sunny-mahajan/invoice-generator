const convertHTMLToPDF = require("pdf-puppeteer");

export async function POST(req, res) {
  // Set CORS headers to allow cross-origin requests
  res.setHeader("Access-Control-Allow-Origin", "*"); // Allow requests from any origin
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS"); // Allow only POST and OPTIONS methods
  res.setHeader("Access-Control-Allow-Headers", "Content-Type"); // Allow Content-Type headers

  // Handle OPTIONS preflight request
  if (req.method === "OPTIONS") {
    // End the preflight request here (No further action needed for OPTIONS request)
    return res.status(200).end();
  }

  if (req.method === "POST") {
    try {
      const { HTMLTemplate } = req.body;

      convertHTMLToPDF(
        HTMLTemplate,
        (pdf) => {
          console.log("PDF generated successfully");
          res.setHeader("Content-Type", "application/pdf");
          res.send(pdf);
        },
        { printBackground: true },
        null,
        true
      );
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "An error occurred while generating the PDF" });
    }
  } else {
    // Return 405 if the method is not POST
    res.status(405).json({ error: "Method not allowed" });
  }
}
