// const production = process.env.VERCEL_ENV === "production";
// const chrome = production ? require("@sparticuz/chromium") : null;
// const puppeteer = production ? require("puppeteer-core") : require("puppeteer");
// import nodemailer from "nodemailer";
// import { db } from "../../../../firebaseConfig";
// import {
//   collection,
//   query,
//   where,
//   getDocs,
//   updateDoc,
//   arrayUnion,
//   getDoc,
//   doc,
// } from "firebase/firestore";

// export default async function handler(req, res) {
//   if (req.method !== "POST") {
//     return res.status(405).json({ error: "Method not allowed" });
//   }

//   const { HTMLTemplate, userData, templateId, userEmail } = req.body;

//   if (!HTMLTemplate) {
//     return res.status(400).json({ error: "HTMLTemplate is required" });
//   }

//   try {
//     const userDocRef = await fetchUserDoc(userData.email);
//     await updateInvoiceData(userDocRef, templateId);

//     const browser = await launchBrowser();
//     const pdfBuffer = await generatePDF(browser, HTMLTemplate);

//     await sendEmailWithAttachment(userEmail, pdfBuffer);

//     return res
//       .status(200)
//       .json({ message: "PDF sent successfully to the user's email" });
//   } catch (error) {
//     console.error("Error:", error);
//     return res
//       .status(500)
//       .json({ error: "An error occurred", details: error.message });
//   }
// }

// // Fetch user document from Firestore
// async function fetchUserDoc(email) {
//   const usersCollection = collection(db, "users");
//   const userQuery = query(usersCollection, where("email", "==", email));
//   const querySnapshot = await getDocs(userQuery);

//   if (querySnapshot.empty) {
//     throw new Error("User not found");
//   }

//   return doc(db, "users", querySnapshot.docs[0].id);
// }

// // Update invoice data in Firestore
// async function updateInvoiceData(userDocRef, templateId) {
//   const userDocSnapshot = await getDoc(userDocRef);

//   if (!userDocSnapshot.exists()) {
//     throw new Error("User document does not exist");
//   }

//   const newInvoiceRecord = {
//     downloadedAt: new Date(),
//     invoiceTemplateId: templateId,
//   };

//   await updateDoc(userDocRef, {
//     invoiceData: arrayUnion(newInvoiceRecord),
//     downloadedInvoiceCount:
//       userDocSnapshot.data().downloadedInvoiceCount + 1 || 1,
//   });
// }

// // Launch Puppeteer browser
// async function launchBrowser() {
//   const options = production
//     ? {
//         args: chrome.args,
//         defaultViewport: chrome.defaultViewport,
//         executablePath: await chrome.executablePath(),
//         headless: "new",
//         ignoreHTTPSErrors: true,
//       }
//     : {
//         headless: true,
//         args: ["--no-sandbox", "--disable-setuid-sandbox"],
//       };

//   return await puppeteer.launch(options);
// }

// // Generate PDF from HTML template
// async function generatePDF(browser, HTMLTemplate) {
//   let page;
//   try {
//     page = await browser.newPage();
//     await page.addStyleTag({
//       content:
//         '@import url("https://fonts.googleapis.com/css2?family=Spartan:wght@100..900&display=swap");',
//     });
//     await page.setContent(HTMLTemplate, { waitUntil: "load" });

//     return await page.pdf({ format: "A4", printBackground: true });
//   } finally {
//     if (browser) await browser.close();
//   }
// }

// // Send email with PDF attachment
// async function sendEmailWithAttachment(userEmail, pdfBuffer) {
//   const transporter = nodemailer.createTransport({
//     host: "smtp.gmail.com",
//     port: 465,
//     secure: true,
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASS,
//     },
//   });

//   const mailOptions = {
//     from: process.env.EMAIL_USER,
//     to: userEmail,
//     subject: "Your Invoice PDF",
//     text: "Please find attached your generated invoice PDF.",
//     attachments: [
//       {
//         filename: "invoice.pdf",
//         content: pdfBuffer,
//         contentType: "application/pdf",
//       },
//     ],
//   };

//   await transporter.sendMail(mailOptions);
// }

import nodemailer from "nodemailer";
import { db } from "../../../../firebaseConfig";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  arrayUnion,
  getDoc,
  doc,
} from "firebase/firestore";
import JSZip from "jszip";
import { v4 as uuidv4 } from "uuid";

const production = process.env.VERCEL_ENV === "production";
const chrome = production ? require("@sparticuz/chromium") : null;
const puppeteer = production ? require("puppeteer-core") : require("puppeteer");

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { templates, userData, userEmail } = req.body;

  if (!templates || !templates.length) {
    return res.status(400).json({ error: "Templates are required" });
  }

  try {
    const browser = await launchBrowser();
    const zip = new JSZip();

    for (const { HTMLTemplate, templateId } of templates) {
      const userDocRef = await fetchUserDoc(userData.email);
      await updateInvoiceData(userDocRef, templateId);

      const pdfBuffer = await generatePDF(browser, HTMLTemplate);

      zip.file(`invoice_${templateId}_${uuidv4()}.pdf`, pdfBuffer);
    }

    const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });
    await sendEmailWithAttachment(userEmail, zipBuffer);

    return res
      .status(200)
      .json({ message: "ZIP sent successfully to the user's email" });
  } catch (error) {
    console.error("Error:", error);
    return res
      .status(500)
      .json({ error: "An error occurred", details: error.message });
  }
}

// Fetch user document from Firestore
async function fetchUserDoc(email) {
  const usersCollection = collection(db, "users");
  const userQuery = query(usersCollection, where("email", "==", email));
  const querySnapshot = await getDocs(userQuery);

  if (querySnapshot.empty) {
    throw new Error("User not found");
  }

  return doc(db, "users", querySnapshot.docs[0].id);
}

// Update invoice data in Firestore
async function updateInvoiceData(userDocRef, templateId) {
  const userDocSnapshot = await getDoc(userDocRef);

  if (!userDocSnapshot.exists()) {
    throw new Error("User document does not exist");
  }

  const newInvoiceRecord = {
    downloadedAt: new Date(),
    invoiceTemplateId: templateId,
  };

  await updateDoc(userDocRef, {
    invoiceData: arrayUnion(newInvoiceRecord),
    downloadedInvoiceCount:
      userDocSnapshot.data().downloadedInvoiceCount + 1 || 1,
  });
}

// Launch Puppeteer browser
async function launchBrowser() {
  const options = production
    ? {
        args: chrome.args,
        defaultViewport: chrome.defaultViewport,
        executablePath: await chrome.executablePath(),
        headless: "new",
        ignoreHTTPSErrors: true,
      }
    : {
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      };

  return await puppeteer.launch(options);
}

// Generate PDF from HTML template
async function generatePDF(browser, HTMLTemplate) {
  let page;
  try {
    page = await browser.newPage();
    await page.addStyleTag({
      content:
        '@import url("https://fonts.googleapis.com/css2?family=Spartan:wght@100..900&display=swap");',
    });
    await page.setContent(HTMLTemplate, { waitUntil: "load" });

    return await page.pdf({ format: "A4", printBackground: true });
  } finally {
    if (page) await page.close();
  }
}

// Send email with ZIP attachment
async function sendEmailWithAttachment(userEmail, zipBuffer) {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: "Your Invoices ZIP",
    text: "Please find attached your generated invoices ZIP file.",
    attachments: [
      {
        filename: "invoices.zip",
        content: zipBuffer,
        contentType: "application/zip",
      },
    ],
  };

  await transporter.sendMail(mailOptions);
}
