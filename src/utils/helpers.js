export const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const formatDate = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = `0${d.getMonth() + 1}`.slice(-2); // Adding leading zero
  const day = `0${d.getDate()}`.slice(-2); // Adding leading zero
  return `${day}-${month}-${year}`;
};

export const formatDateToISO = (date) => {
  return date.toISOString().split("T")[0];
};

export const validateField = (value, fieldName, errorMsg, errorsObj) => {
  if (!value) {
    errorsObj[fieldName] = errorMsg;
  }
};

export const validateEmail = (email, fieldName, errorsObj) => {
  if (email && !/\S+@\S+\.\S+/.test(email)) {
    errorsObj[fieldName] = "Invalid Email";
  }
};

export const mapSenderDetails = (senderDetails) => ({
  "Sender's Name": senderDetails.name,
  "Sender's Address": senderDetails.street,
  "Sender's City": senderDetails.city,
  "Sender's State": senderDetails.state,
  "Sender's Country": senderDetails.country,
  "Sender's Contact No": senderDetails.contactNo,
  "Sender's Email": senderDetails.email,
  "Sender's Zipcode": senderDetails.postCode,
  "Sender's Tax No": senderDetails.taxNo,
  "Sender's Tax Type": senderDetails.taxType,
  "Sender's PAN No": senderDetails.panNo,
  "Sender's Discount": senderDetails.discount,
  "Paid Amount": senderDetails.advancedAmount,
  "Remarks": senderDetails.remarks,
});

export const mapReceiverDetails = (clientDetails) => ({
  "Receiver's Name": clientDetails.name,
  "Receiver's Address": clientDetails.street,
  "Receiver's City": clientDetails.city,
  "Receiver's State": clientDetails.state,
  "Receiver's Contact No": clientDetails.contactNo,
  "Receiver's Email": clientDetails.email,
  "Receiver's Tax No": clientDetails.taxNo,
  "Receiver's Zipcode": clientDetails.postCode,
  "Receiver's Country": clientDetails.country,
  "Receiver's Tax Type": clientDetails.taxType,
  "Receiver's PAN No": clientDetails.panNo,
});

export const mapBankDetails = (bankDetails) => ({
  "Bank Name": bankDetails.bankName,
  "IFSC Code": bankDetails.ifscCode,
  "Account No": bankDetails.accountNumber,
  "Account Holder Name": bankDetails.accountHolderName,
  "Account Type": bankDetails.bankAccountType,
  "Bank Address": bankDetails.bankAddress,
});

export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

//handle Generate PDF
// export const handleGeneratePDF = async () => {
//   try {
//     const pdfBlob = await generateHTMLPDF(invoiceData, userData);
//     if (pdfBlob) {
//       const blobURL = URL.createObjectURL(pdfBlob);
//       // window.open(blobURL, "_blank");
//       const link = document.createElement("a");
//       link.href = blobURL;
//       link.download = "invoice.pdf";
//       link.click();
//       setTimeout(() => URL.revokeObjectURL(blobURL), 100);
//     }
//   } catch (error) {
//     toast.error("Error generating invoice PDF: " + error.message);
//   }
// };
