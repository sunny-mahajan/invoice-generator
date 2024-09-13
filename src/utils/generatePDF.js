import generateTPL001 from "../templates/TPL001";
import generateTPL002 from "../templates/TPL002";
import generateTPL003 from "../templates/TPL003";

const generatePDF = (invoiceData) => {
  try {
    const templateId = invoiceData["Template Id"];
    switch (templateId) {
      case "TPL001":
        return generateTPL001(invoiceData);
      case "TPL002":
        return generateTPL002(invoiceData);
      case "TPL003":
        return generateTPL003(invoiceData);
      default:
        throw new Error("Invalid template ID");
    }
  } catch (error) {
    console.error(`Could generatePDF\n${error.stack}`);
  }
};

export default generatePDF;
