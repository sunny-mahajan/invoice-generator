import generateHTMLTPL001 from "../templates/HTMLTPL001";
import generateHTMLTPL002 from "../templates/HTMLTPL002";
import generateHTMLTPL003 from "../templates/HTMLTPL003";
import generateHTMLTPL004 from "../templates/HTMLTPL004";

export async function generateHTMLPDF(invoiceData) {
  try {
    let HTMLTemplate = "";
    let HTMLTemplate1 = "";
    let HTMLTemplate2 = "";
    const templateId = invoiceData["Template Id"];

    // Choose the correct template based on the templateId
    switch (templateId) {
      case "TPL001":
        HTMLTemplate = generateHTMLTPL001(invoiceData);
        break; // Stops execution here after generating TPL001

      case "TPL002":
        HTMLTemplate1 = generateHTMLTPL002(invoiceData);
        break; // Stops execution here after generating TPL002

      case "TPL003":
        HTMLTemplate2 = generateHTMLTPL003(invoiceData);
        break; // Stops execution here after generating TPL003

      case "TPL004":
        HTMLTemplate = generateHTMLTPL004(invoiceData);
        break; // Stops execution here after generating TPL004
      default:
        throw new Error(`Unsupported template ID: ${templateId}`);
    }

    let response;

    // Sending the HTML template to the server for PDF generation
    if (templateId === "TPL001") {
      response = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ HTMLTemplate }),
      });
    } else if (templateId === "TPL002") {
      response = await fetch("/api/generate-pdf2", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ HTMLTemplate1 }),
      });
    } else if (templateId === "TPL003") {
      response = await fetch("/api/generate-pdf3", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ HTMLTemplate2 }),
      });
    }

    // Check if the response is okay
    console.log(response, "res---------------------");
    if (!response.ok) {
      throw new Error("Failed to generate PDF");
    }

    // Return the PDF blob from the response
    return await response.blob();
  } catch (error) {
    console.error(`Error in generateHTMLPDF:\n${error.stack}`);
  }
}
