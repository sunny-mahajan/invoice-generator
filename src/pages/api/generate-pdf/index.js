const convertHTMLToPDF = require("pdf-puppeteer");
export default async function handler(req, res) {
  if (req.method === "POST") {
    // Check if the method is POST
    try {
      const { HTMLTemplate } = req.body;

      convertHTMLToPDF(
        HTMLTemplate,
        (pdf) => {
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
