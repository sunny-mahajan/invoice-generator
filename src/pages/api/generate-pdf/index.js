// const convertHTMLToPDF = require("pdf-puppeteer");
// export default async function handler(req, res) {
//   if (req.method === "POST") {
//     // Check if the method is POST
//     try {
//       const { HTMLTemplate } = req.body;

//       convertHTMLToPDF(
//         HTMLTemplate,
//         (pdf) => {
//           res.setHeader("Content-Type", "application/pdf");
//           res.send(pdf);
//         },
//         { printBackground: true },
//         null,
//         true
//       );
//     } catch (error) {
//       console.error(error);
//       res
//         .status(500)
//         .json({ error: "An error occurred while generating the PDF" });
//     }
//   } else {
//     // Return 405 if the method is not POST
//     res.status(405).json({ error: "Method not allowed" });
//   }
// }

import { join } from "path";
import { promises as fs } from "fs";

export default async function handler(req, res) {
  // Set CORS headers to allow cross-origin requests
  res.setHeader("Access-Control-Allow-Origin", "*"); // Allow requests from any origin
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS"); // Allow only POST and OPTIONS methods
  res.setHeader("Access-Control-Allow-Headers", "Content-Type"); // Allow Content-Type headers

  // Handle OPTIONS preflight request
  if (req.method === "OPTIONS") {
    return res.status(200).end(); // End the preflight request
  }

  if (req.method === "POST") {
    try {
      const { HTMLTemplate } = req.body;

      // (If you want to use the convertHTMLToPDF logic here, uncomment this block)
      // convertHTMLToPDF(
      //   HTMLTemplate,
      //   (pdf) => {
      //     console.log("PDF generated successfully");
      //     res.setHeader("Content-Type", "application/pdf");
      //     res.send(pdf);
      //   },
      //   { printBackground: true },
      //   null,
      //   true
      // );

      // Define the path to the PDF file
      const filePath = join(
        process.cwd(),
        "public",
        "assets",
        "docs",
        "INV002.pdf"
      );

      // Read the PDF file
      const fileContent = await fs.readFile(filePath);

      // Set response headers and send the file
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `inline; filename="INV002.pdf"`);
      res.send(fileContent);
    } catch (error) {
      console.error("Error while serving PDF:", error);
      res
        .status(500)
        .json({ error: "An error occurred while serving the PDF" });
    }
  } else {
    // Return 405 if the method is not POST
    res.status(405).json({ error: "Method not allowed" });
  }
}
