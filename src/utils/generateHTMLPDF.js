import generateHTMLTPL001 from "../templates/HTMLTPL001";

export async function generateHTMLPDF(invoiceData) {
  try {
    let HTMLTemplate = "";
    const templateId = invoiceData["Template Id"];
    switch (templateId) {
      case "TPL001":
        HTMLTemplate = generateHTMLTPL001(invoiceData);

      //   case "TPL002":
      //     HTMLTemplate = generateHTMLTPL002(invoiceData);
      //   case "TPL003":
      //     HTMLTemplate = generateHTMLTPL003(invoiceData);
    }

    const response = await fetch("/api/generate-pdf2", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ HTMLTemplate }),
    });

    if (!response.ok) {
      throw new Error("Failed to generate PDF");
    }
    return await response.blob();
  } catch (error) {
    console.error(`Could generatePDF\n${error.stack}`);
  }
}
