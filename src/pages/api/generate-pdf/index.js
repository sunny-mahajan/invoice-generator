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
      // Define the path to the original PDF
      const originalFilePath = join(
        process.cwd(),
        "public",
        "assets",
        "docs",
        "INV002.pdf"
      );

      // Read the original PDF file
      const fileContent = await fs.readFile(originalFilePath);

      // Define the directory path to save the new PDF file
      const outputDir = join(process.cwd(), "public", "generated-pdfs");
      // Ensure the directory exists (create if not)
      await fs.mkdir(outputDir, { recursive: true });

      // Define the new file name and full path
      const newFileName = `invoice_${Date.now()}.pdf`; // unique filename using timestamp
      const savePath = join(outputDir, newFileName);
      res.send("success");
      // Write the PDF content to the new location
      await fs.writeFile(savePath, fileContent);

      // Set headers and send the saved PDF file in the response
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `inline; filename="${newFileName}"`);

      // Read and send the saved file
      const savedFileContent = await fs.readFile(savePath);
      res.send(savedFileContent);
    } catch (error) {
      console.error("Error while serving PDF:", error);
      res.status(500).json({ error: error });
    }
  } else {
    // Return 405 if the method is not POST
    res.status(405).json({ error: "Method not allowed" });
  }
}
