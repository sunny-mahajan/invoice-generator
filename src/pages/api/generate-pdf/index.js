// const convertHTMLToPDF = require("pdf-puppeteer");

// export default async function handler(req, res) {
//   try {
//     const { HTMLTemplate } = req.body;

//     convertHTMLToPDF(
//       HTMLTemplate,
//       (pdf) => {
//         res.setHeader("Content-Type", "application/pdf");
//         res.send(pdf);
//       },
//       { printBackground: true },
//       null,
//       true
//     );
//   } catch (error) {
//     console.error(error);
//     res
//       .status(500)
//       .json({ error: "An error occurred while generating the PDF" });
//   }
// }

const convertHTMLToPDF = require("pdf-puppeteer");

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
  try {
    const { HTMLTemplate } = req.body;
    console.log(req.method, "method------------------");
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

    // res.send(`Hello, World! ${req.method}`);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while generating the PDF" });
  }
}
