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
  return `${month}-${day}-${year}`;
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
});

export const mapBankDetails = (bankDetails) => ({
  "Bank Name": bankDetails.bankName,
  "IFSC Code": bankDetails.ifscCode,
  "Account no": bankDetails.accountNumber,
  "Account Holder Name": bankDetails.accounHolderName,
  "Account Type": bankDetails.bankAccountType,
});
