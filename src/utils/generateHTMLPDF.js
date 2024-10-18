import generateHTMLTPL001 from "../templates/HTMLTPL001";
import generateHTMLTPL002 from "../templates/HTMLTPL002";
import generateHTMLTPL003 from "../templates/HTMLTPL003";
import generateHTMLTPL004 from "../templates/HTMLTPL004";

export async function generateHTMLPDF(invoiceData) {
  try {
    let HTMLTemplate = "";
    const templateId = invoiceData["Template Id"];

    // Choose the correct template based on the templateId
    switch (templateId) {
      case "TPL001":
        HTMLTemplate = generateHTMLTPL001(invoiceData);
        break; // Stops execution here after generating TPL001

      case "TPL002":
        HTMLTemplate = generateHTMLTPL002(invoiceData);
        break; // Stops execution here after generating TPL002

      case "TPL003":
        HTMLTemplate = generateHTMLTPL003(invoiceData);
        break; // Stops execution here after generating TPL003

      case "TPL004":
        HTMLTemplate = generateHTMLTPL004(invoiceData);
        break; // Stops execution here after generating TPL004
      default:
        throw new Error(`Unsupported template ID: ${templateId}`);
    }

    // Sending the HTML template to the server for PDF generation
    const response = await fetch(
      "https://invoice-generator-iota-rose.vercel.app/api/generate-pdf",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ HTMLTemplate }),
      }
    );

    // Check if the response is okay
    if (!response.ok) {
      throw new Error("Failed to generate PDF");
    }

    // Return the PDF blob from the response
    return await response.blob();
  } catch (error) {
    console.error(`Error in generateHTMLPDF:\n${error.stack}`);
  }
}
