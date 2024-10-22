const convertHTMLToPDF = require("pdf-puppeteer");
export default async function handler(req, res) {
  console.log(req.body, "req.body");
  if (req.method === "POST") {
    // Check if the method is POST
    try {
      const { HTMLTemplate1 } = req.body;

      convertHTMLToPDF(
        HTMLTemplate1,
        (pdf) => {
          res.setHeader("Content-Type", "application/pdf");
          res.send(pdf);
        },
        { printBackground: true },
        null,
        true
      );
      console.log("-----------------");
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: JSON.stringify(error) });
    }
  } else {
    // Return 405 if the method is not POST
    res.status(405).json({ error: "Method not allowed" });
  }
}
