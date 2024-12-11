// import generateHTMLTPL001 from "../templates/HTMLTPL001";
// import generateHTMLTPL002 from "../templates/HTMLTPL002";
// import generateHTMLTPL003 from "../templates/HTMLTPL003";
// import generateHTMLTPL004 from "../templates/HTMLTPL004";
// import generateHTMLTPL005 from "../templates/HTMLTPL005";
// import generateHTMLTPL006 from "../templates/HTMLTPL006";
// import generateHTMLTPL007 from "../templates/HTMLTPL007";
// import generateHTMLTPL008 from "../templates/HTMLTPL008";
// import generateHTMLTPL009 from "../templates/HTMLTPL009";
// import generateHTMLTPL0010 from "../templates/HTMLTPL0010";

// export async function generateHTMLPDF(invoiceData, userData) {
//   try {
//     let HTMLTemplate = "";
//     const templateId = invoiceData["Template Id"];
//     // Choose the correct template based on the templateId
//     switch (templateId) {
//       case "TPL001":
//         HTMLTemplate = generateHTMLTPL001(invoiceData);
//         break; // Stops execution here after generating TPL001

//       case "TPL002":
//         HTMLTemplate = generateHTMLTPL002(invoiceData);
//         break; // Stops execution here after generating TPL002

//       case "TPL003":
//         HTMLTemplate = generateHTMLTPL003(invoiceData);
//         break; // Stops execution here after generating TPL003

//       case "TPL004":
//         HTMLTemplate = generateHTMLTPL004(invoiceData);
//         break; // Stops execution here after generating TPL004

//       case "TPL006":
//         HTMLTemplate = generateHTMLTPL006(invoiceData);
//         break; // Stops execution here after generating TPL005

//       case "TPL007":
//         HTMLTemplate = generateHTMLTPL007(invoiceData);
//         break; // Stops execution here after generating TPL004

//       case "TPL005":
//         HTMLTemplate = generateHTMLTPL005(invoiceData);
//         break; // Stops execution here after generating TPL005

//       case "TPL008":
//         HTMLTemplate = generateHTMLTPL008(invoiceData);
//         break; // Stops execution here after generating TPL008

//       case "TPL009":
//         HTMLTemplate = generateHTMLTPL009(invoiceData);
//         break; // Stops execution here after generating TPL009

//       case "TPL0010":
//         HTMLTemplate = generateHTMLTPL0010(invoiceData);
//         break; // Stops execution here after generating TPL009

//       default:
//         throw new Error(`Unsupported template ID: ${templateId}`);
//     }

//     const response = await fetch("/api/generate-pdf", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         HTMLTemplate,
//         userData,
//         templateId,
//         userEmail: invoiceData["User Email"],
//       }),
//     });

//     if (!response.ok) {
//       throw new Error(`Server error: ${response?.statusText}`);
//     }

//     return await response.json();
//   } catch (error) {
//     console.error("Error in generateHTMLPDF:", error);
//     throw error;
//   }
// }

import generateHTMLTPL001 from "../templates/HTMLTPL001";
import generateHTMLTPL002 from "../templates/HTMLTPL002";
import generateHTMLTPL003 from "../templates/HTMLTPL003";
import generateHTMLTPL004 from "../templates/HTMLTPL004";
import generateHTMLTPL005 from "../templates/HTMLTPL005";
import generateHTMLTPL006 from "../templates/HTMLTPL006";
import generateHTMLTPL007 from "../templates/HTMLTPL007";
import generateHTMLTPL008 from "../templates/HTMLTPL008";
import generateHTMLTPL009 from "../templates/HTMLTPL009";
import generateHTMLTPL0010 from "../templates/HTMLTPL0010";

export async function generateHTMLPDF(invoiceData, userData, userEmail) {
  try {
    const templates = [];

    invoiceData.forEach((element) => {
      let HTMLTemplate = "";
      const templateId = element["Template Id"];

      // Choose the correct template based on the templateId
      switch (templateId) {
        case "TPL001":
          HTMLTemplate = generateHTMLTPL001(element);
          break;
        case "TPL002":
          HTMLTemplate = generateHTMLTPL002(element);
          break;
        case "TPL003":
          HTMLTemplate = generateHTMLTPL003(element);
          break;
        case "TPL004":
          HTMLTemplate = generateHTMLTPL004(element);
          break;
        case "TPL005":
          HTMLTemplate = generateHTMLTPL005(element);
          break;
        case "TPL006":
          HTMLTemplate = generateHTMLTPL006(element);
          break;
        case "TPL007":
          HTMLTemplate = generateHTMLTPL007(element);
          break;
        case "TPL008":
          HTMLTemplate = generateHTMLTPL008(element);
          break;
        case "TPL009":
          HTMLTemplate = generateHTMLTPL009(element);
          break;
        case "TPL0010":
          HTMLTemplate = generateHTMLTPL0010(element);
          break;
        default:
          throw new Error(`Unsupported template ID: ${templateId}`);
      }

      templates.push({
        HTMLTemplate,
        templateId,
      });
    });

    const response = await fetch("/api/generate-pdf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ templates, userData, userEmail: userEmail }),
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response?.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error in generateHTMLPDF:", error);
    throw error;
  }
}
