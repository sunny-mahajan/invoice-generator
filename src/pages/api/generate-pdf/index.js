const production = process.env.VERCEL_ENV === "production";
const chrome = production ? require("@sparticuz/chromium") : null;
const puppeteer = production ? require("puppeteer-core") : require("puppeteer");
import { db } from "../../../../firebaseConfig";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  arrayUnion,
  doc,
} from "firebase/firestore";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { HTMLTemplate, userData, templateId } = req.body;

  if (!HTMLTemplate) {
    return res.status(400).json({ error: "HTMLTemplate is required" });
  }

  try {
    const usersCollection = collection(db, "users");
    const userQuery = query(
      usersCollection,
      where("email", "==", userData.email)
    );
    const querySnapshot = await getDocs(userQuery);

    if (querySnapshot.empty) {
      return res.status(404).json({ error: "User not found" });
    }

    const userDoc = querySnapshot.docs[0];
    const userDocRef = doc(db, "users", userDoc.id);

    // Check if user has invoice data and increment download count, otherwise initialize it
    const userInvoiceData = userDoc.data() || {};
    const downloadedInvoiceCount = userInvoiceData.downloadedInvoiceCount || 0;

    const newInvoiceRecord = {
      downloadedAt: new Date(),
      invoiceTemplateId: templateId,
    };

    // Update the user's invoice data in Firestore
    await updateDoc(userDocRef, {
      invoiceData: arrayUnion(newInvoiceRecord),
      downloadedInvoiceCount: downloadedInvoiceCount + 1,
    });

    let browser;
    if (production) {
      browser = await puppeteer.launch({
        args: [...chrome.args, "--font-render-hinting=none", "--no-sandbox"],
        defaultViewport: chrome.defaultViewport,
        executablePath: await chrome.executablePath(),
        headless: true,
        ignoreHTTPSErrors: true,
      });
    } else {
      browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });
    }

    const page = await browser.newPage();
    // await page.addStyleTag({
    //   content:
    //     '@import url("https://fonts.googleapis.com/css2?family=Bebas+Neue:wght@100..900&display=swap");',
    // });
    // await page.addStyleTag({
    //   content:
    //     '@import url("https://fonts.googleapis.com/css2?family=Spartan:wght@100..900&display=swap");',
    // });
    await page.addStyleTag({
      content: `
        @import url("https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;700&display=swap");`,
    });
    await page.setContent(HTMLTemplate, { waitUntil: "load" });

    // Generate PDF from the HTML content
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
    });

    // Set headers and send the PDF as a response
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="generated.pdf"'
    );
    return res.status(200).send(Buffer.from(pdfBuffer));
  } catch (error) {
    return res.status(500).json({
      error: "An error occurred while generating the PDF",
      details: error.message,
    });
  } finally {
    // Ensure the browser is closed to avoid memory leaks
    if (browser) {
      await browser.close();
    }
  }
}
