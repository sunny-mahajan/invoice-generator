import generateHTMLTPL001 from "../templates/HTMLTPL001";
import generateHTMLTPL002 from "../templates/HTMLTPL002";
import generateHTMLTPL003 from "../templates/HTMLTPL003";
import generateHTMLTPL004 from "../templates/HTMLTPL004";
import generateHTMLTPL005 from "../templates/HTMLTPL005";

export async function generateHTMLPDF(invoiceData, userData) {
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

      case "TPL005":
        HTMLTemplate = generateHTMLTPL005(invoiceData);
        break; // Stops execution here after generating TPL005
      default:
        throw new Error(`Unsupported template ID: ${templateId}`);
    }

    let response;
    response = await fetch("/api/generate-pdf", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        HTMLTemplate: HTMLTemplate,
        userData: userData,
        templateId: templateId,
      }),
    });

    // Return the PDF blob from the response
    return await response.blob();
  } catch (error) {
    console.error(`Error in generateHTMLPDF:\n${error.stack}`);
  }
}
