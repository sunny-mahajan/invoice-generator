export const currencyOptions = [
  { label: "USD - US Dollar", value: "USD" },
  { label: "EUR - Euro", value: "EUR" },
  { label: "GBP - British Pound", value: "GBP" },
  { label: "JPY - Japanese Yen", value: "JPY" },
  { label: "AUD - Australian Dollar", value: "AUD" },
  { label: "CAD - Canadian Dollar", value: "CAD" },
  { label: "INR - Indian Rupee", value: "INR" },
  { label: "CNY - Chinese Yuan", value: "CNY" },
];

export const allowedKeys = [
  "Backspace",
  "Tab",
  "Enter",
  "ArrowLeft",
  "ArrowRight",
  "ArrowUp",
  "ArrowDown",
  "+",
  "End",
  "Home",
  "Numpad0",
  "Numpad1",
  "Numpad2",
  "Numpad3",
  "Numpad4",
  "Numpad5",
  "Numpad6",
  "Numpad7",
  "Numpad8",
  "Numpad9",
];

export const taxTypeOptions = [
  { label: "Sales Tax", value: "Sales Tax" }, // USA
  { label: "VAT", value: "VAT" }, // Europe, UK, China
  { label: "Consumption Tax", value: "Consumption Tax" }, // Japan
  { label: "GST", value: "GST" }, // Australia, India
  { label: "GST/HST", value: "GST/HST" }, // Canada
];

export const currencySymbols = {
  USD: "$", // US Dollar
  EUR: "€", // Euro
  GBP: "£", // British Pound
  JPY: "¥", // Japanese Yen
  AUD: "A$", // Australian Dollar
  CAD: "C$", // Canadian Dollar
  INR: "₹", // Indian Rupee
  CNY: "¥", // Chinese Yuan
};

export const indianPhoneRegex = /^(?:\+91|0)?[6-9]\d{9}$/;

export const bankAccountTypeOptions = [
  { label: "Savings", value: "Savings" },
  { label: "Current", value: "Current" },
];

export const previewInvoiceData = {
  "Invoice No.": "INV-1",
  "Template Id": "TPL001",
  "Invoice Issue Date": "08-27-2024",
  "Invoice Due Date": "08-30-2024",
  "Sender's Name": "John Doe",
  "Sender's Address": "123 Elm St",
  "Sender's City": "New York",
  "Sender's State": "NY",
  "Sender's PAN No": "PAN1234567",
  "Sender's Zipcode": "10001",
  "Sender's Contact No": "1234567890",
  "Sender's Email": "john.doe@abccorp.com",
  "Sender's Tax Type": "IGST",
  "Sender's Tax No": "ABCGST1234",
  "Receiver's Name": "Jane Smith",
  "Receiver's Address": "456 Oak St",
  "Receiver's City": "Los Angeles",
  "Receiver's State": "CA",
  "Receiver's PAN No": "PAN1234567",
  "Receiver's Zipcode": "90001",
  "Receiver's Contact No": "9876543210",
  "Receiver's Email": "jane.smith@xyzllc.com",
  "Receiver's Tax Type": "GST",
  "Receiver's Tax No": "XYZGST5678",
  "Bank Name": "Bank of America",
  "Account No": "12345678",
  "Account Holder Name": "John Doe",
  "IFSC Code": "BOFAUS3N",
  "Account Type": "Savings",
  "Bank Address": "New York, NY, USA",
  Logo: "https://img.freepik.com/premium-vector/minimalist-…orporate-brand-business-company_1253202-77511.jpg",
  Currency: "INR",
  Items: [
    {
      name: "Product A",
      description: "High-quality widget1",
      quantity: "2",
      price: "100",
      amount: 200,
      taxAmount: 10,
      taxPercentage: "5",
      total: 210,
    },
    {
      name: "Product B",
      description: "High-quality widget2",
      quantity: "3",
      price: "300",
      amount: 900,
      taxAmount: 198,
      taxPercentage: "22",
      total: 1098,
    },
    {
      name: "Product C",
      description: "High-quality widget3",
      quantity: "4",
      price: "399",
      amount: 1596,
      taxAmount: 159.60000000000002,
      taxPercentage: "10",
      total: 1755.6,
    },
    {
      name: "Product D",
      description: "High-quality widget4",
      quantity: "5",
      price: "19",
      amount: 95,
      taxAmount: 4.75,
      taxPercentage: "5",
      total: 99.75,
    },
  ],
};
