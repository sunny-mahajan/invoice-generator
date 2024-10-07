import Layout from "../components/Layout";
import React, { useEffect, useRef, useState } from "react";
import CustomButton from "../components/Button";
import CustomInput from "../components/Input";
import FormCustomDropdown from "../components/FormDropdown";
import { DeleteIcon, PlusIcon } from "../components/icons";
import CustomDatePicker from "../components/DatePicker";
import { toast } from "react-toastify";
import Link from "next/link";
import "./style.css";
import ProtectedPage from "./protected";
import { generateHTMLPDF } from "../utils/generateHTMLPDF";
import { addDays, formatDate } from "../utils/helpers";
import InvoiceTemplates from './components/InvoiceTemplates';
import useClickOutside from '../hooks/useClickOutside';

const InvoiceForm = ({ templates }) => {
  const [user, setUser] = useState(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);
  const [downloadInvoiceIsDisabled, setDownloadInvoiceIsDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isDueDatePickerOpen, setIsDueDatePickerOpen] = useState(false);

  const customDatePickerRef = useRef(null);
  const datePickerInputRef = useRef(null);
  const dueDatePickerInputRef = useRef(null);
  const dueCustomDatePickerRef = useRef(null);
  useClickOutside([customDatePickerRef, datePickerInputRef], () => setIsDatePickerOpen(false));
  useClickOutside([dueCustomDatePickerRef, dueDatePickerInputRef], () => setIsDueDatePickerOpen(false));

  const handleDatePickerInputClick = () => {
    setIsDatePickerOpen((prevState) => !prevState);
  }
  const handleDueDatePickerInputClick = () => {
    setIsDueDatePickerOpen((prevState) => !prevState);
  }
  const handleKeyDown = (event) => {
    const allowedKeys = [
      'Backspace', 'Tab', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', '+', 'End', 'Home'
    ];

    if (
      allowedKeys.includes(event.key) ||
      (event.key >= '0' && event.key <= '9') ||
      (event.key === 'Numpad0' || event.key === 'Numpad1' || event.key === 'Numpad2' || 
       event.key === 'Numpad3' || event.key === 'Numpad4' || event.key === 'Numpad5' || 
       event.key === 'Numpad6' || event.key === 'Numpad7' || event.key === 'Numpad8' || 
       event.key === 'Numpad9')
    ) {
      return;
    }

    event.preventDefault();
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const formatDateToISO = (date) => {
    return date.toISOString().split("T")[0];
  };
  const formDataInitialValues = {
    createdAt: formatDateToISO(new Date()),
    dueDate: formatDateToISO(addDays(new Date(), 30)),
    clientName: "",
    clientEmail: "",
    status: "draft",
    senderAddress: {
      street: "",
      city: "",
      postCode: "",
      country: "",
      taxType:"GST",
      taxPercentage: 0,
      gstin: "",
      panCardNo: "",
    },
    clientAddress: {
      street: "",
      city: "",
      postCode: "",
      country: "",
      taxType:"GST",
      taxPercentage: 0,
      gstin: "",
      panCardNo: "",
    },
    items: [
      {
        name: "",
        description: "",
        quantity: "",
        price: "",
      },
    ],
    bankDetails: {
      bankName: "",
      accountNumber: "",
      confirmAccountNumber: "",
      ifscCode: "",
      accounHolderName: "",
      bankAccountType: "",
    },
    total: 0,
    currency: "INR",
  };

  const [formData, setFormData] = useState(formDataInitialValues);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    if (Object.keys(errors).length !== 0) {
      validateForm();
    }
    if (e?.target) {
      const { name, value } = e.target;
      if (name.includes(".")) {
        const [parent, child] = name.split(".");
        setFormData((prev) => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: value,
          },
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }));
      }
    } else if (e?.name) {
      if (e?.name.includes(".")) {
        const [parent, child] = e?.name.split(".");
        setFormData((prev) => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: e?.value,
          },
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          [e?.name]: e?.value,
        }));
      }
    }
  };

  const handleItemChange = (index, e) => {
    if (Object.keys(errors).length !== 0) {
      validateForm();
    }
    const { name, value } = e.target;
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [name]: value };
    // Calculate total if both quantity and price are not empty or null
    const quantity = newItems[index].quantity;
    const price = newItems[index].price;

    if (quantity && price) {
      const total = parseFloat(quantity) * parseFloat(price);
      newItems[index].total = total.toFixed(2); // Store total with 2 decimal places
    } else {
      newItems[index].total = 0.0; // Clear the total if quantity or price is invalid
    }

    // Update the form data
    setFormData((prev) => ({
      ...prev,
      items: newItems,
    }));
  };

  const handleAddItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { name: "", description: "", quantity: "", price: "" }],
    }));
  };

  const handleRemoveItem = (index) => {
    if (formData.items.length <= 1) {
      return;
    }
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData((prev) => ({
      ...prev,
      items: newItems,
    }));
  };

  const handleSelectTemplate = (templateId) => {
    setSelectedTemplateId(templateId);
    setDownloadInvoiceIsDisabled(false);  // Enable the download button
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.invoiceNo) newErrors.invoiceNo = "Required field";
    if (!formData.sender?.name) newErrors.senderName = "Required field";
    if (!formData.sender?.contactNo) newErrors.senderContactNo = "Required field";
    if (!formData.sender?.email) newErrors.senderEmail = "Required field";
    if (!formData.senderAddress?.state) newErrors.clientState = "Required field";
    if (!formData.clientContactNo) newErrors.clientContactNo = "Required field";
    if (!formData.clientAddress?.state) newErrors.invoiceState = "Required field";
    if (!formData.clientName) newErrors.clientName = "Required field";
    if (!formData.sender?.email || !/\S+@\S+\.\S+/.test(formData.sender?.email))
      newErrors.senderEmail = "Invalid Email";
    if (!formData.clientEmail || !/\S+@\S+\.\S+/.test(formData.clientEmail))
      newErrors.clientEmail = "Invalid Email";
    if (!formData.senderAddress?.street)
      newErrors.clientStreetAddress = "Required field";
    

    if (!formData.senderAddress?.city) newErrors.clientCity = "Required field";
    if (!formData.senderAddress?.postCode)
      newErrors.clientPostalCode = "Required field";
    if (!formData.senderAddress?.country)
      newErrors.clientCountry = "Required field";
    // if(!formData.senderAddress.gstin)
    //   newErrors.senderGstin = "Required field";
    // if(!formData.senderAddress.panCardNo)
    //   newErrors.SenderPancard = "Required field";
    if (!formData.clientAddress?.street)
      newErrors.invoiceStreetAddress = "Required field";
    if (!formData.clientAddress?.city) newErrors.invoiceCity = "Required field";
    if (!formData.clientAddress?.postCode)
      newErrors.invoicePostcode = "Required field";
    if (!formData.clientAddress?.country)
      newErrors.invoiceCountry = "Required field";
    // if(!formData.clientAddress.gstin) 
    //   newErrors.ClientGstin = "Required field";
    // if(!formData.clientAddress.panCardNo)
    //   newErrors.ClientPancard = "Required field";
    if (!formData.createdAt) newErrors.issueDate = "Required field";
    // if (!formData.dueDate) newErrors.dueDate = "Required field";
    // if (!formData.paymentTerms) newErrors.paymentTerm = "Required field";
    if(!formData.currency) newErrors.currency = "Required field";
    if (formData.bankDetails.accountNumber && 
      formData.bankDetails.accountNumber !== formData.bankDetails.confirmAccountNumber) {
    newErrors.confirmAccountNumber = "Account number and confirm account number should be the same.";
  }
    if (
      formData.items.some((item) => !item.name || !item.description || !item.quantity || !item.price)
    )
      newErrors.items = "Required fields";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e, saveAsDraft) => {
    
    e.preventDefault();
    if (!saveAsDraft && !validateForm()) return;
    setLoading(true);
    formData["Invoice No."] = formData.invoiceNo;
    formData["Template Id"] = selectedTemplateId;
    formData["Items"] = formData.items;
    formData["Sender's Name"] = formData.sender.name;
    formData["Sender's Address"] = formData.senderAddress.street;
    formData["Sender's City"] = formData.senderAddress.city;
    formData["Sender's State"] = formData.senderAddress.state;
    formData["Sender's Country"] = formData.senderAddress.country;
    formData["Sender's Contact No"] = formData.sender.contactNo;
    formData["Sender's Email"] = formData.sender.email;
    formData["Sender's Zipcode"] = formData.senderAddress.postCode;
    formData["Sender's Bank"] = formData.bankDetails.bankName;
    formData["Sender's IFSC Code"] = formData.bankDetails.ifscCode;
    formData["Sender's Account no"] = formData.bankDetails.accountNumber;
    formData["Sender's Account Holder Name"] = formData.bankDetails.accounHolderName;
    formData["Sender's Account Type"] = formData.bankDetails.bankAccountType;
    formData["Sender's PAN"] = formData.senderAddress.panCardNo;
    formData["Sender's GST"] = formData.senderAddress.gstin;
    formData["Tax Type"] = formData.senderAddress.taxType;
    formData["Tax percentage"] = formData.senderAddress.taxPercentage;
  
    // formData["Sender's Company Name"] = formData.;
    formData["Receiver's Name"] = formData.clientName;
    formData["Receiver's Address"] = formData.clientAddress.street;
    formData["Receiver's City"] = formData.clientAddress.city;
    formData["Receiver's State"] = formData.clientAddress.state;
    formData["Receiver's Contact No"] = formData.clientContactNo;
    formData["Receiver's email"] = formData.clientEmail;
    formData["Receiver's PAN"] = formData.clientAddress.panCardNo;
    formData["Receiver's GST"] = formData.clientAddress.gstin;
    formData["Receiver' Type"] = formData.clientAddress.taxType;
    formData["Receiver' Percentage"] = formData.clientAddress.taxPercentage;

    formData["Receiver's Zipcode"] =formData?.clientAddress?.postCode;
    formData["Receiver's Country"] = formData.clientAddress.country;
    // formData["Remarks"] = formData.;

    //add currency
    formData["Currency"] = formData.currency;
    // add invoice issue date
    formData["Invoice Issue Date"] = formData.createdAt;

    // add invoice due date
    // const paymentDueDate = addDays(formData["Invoice Issue Date"], formData.paymentTerms);
    formData["Invoice Due Date"] = formData.dueDate;


    const pdfBlob = await generateHTMLPDF(formData);

    if (pdfBlob) {
      setLoading(false);
      
      // Create a temporary URL for the blob
      const blobURL = URL.createObjectURL(pdfBlob);

      // Open the PDF in a new tab
      window.open(blobURL, '_blank');

      // Clean up: revoke the object URL to free memory after a short delay
      setTimeout(() => {
        URL.revokeObjectURL(blobURL);
      }, 100); // Adjust time as needed
    }
    
    // try {
    //   if (!user || !user.token) {
    //     throw new Error("User is not authenticated");
    //   }

    //   const response = await fetch(
    //     `http://localhost:5000/api/invoices/${
    //       invoiceFormId === -1 ? "create" : "update"
    //     }`,
    //     {
    //       method: "POST",
    //       headers: {
    //         Authorization: `Bearer ${user.token}`,
    //         "Content-Type": "application/json",
    //       },
    //       body: JSON.stringify({
    //         invoiceData: {
    //           ...formData,
    //           status: saveAsDraft
    //             ? "draft"
    //             : invoiceFormId === -1
    //             ? "pending"
    //             : "pending",
    //         },
    //       }),
    //     }
    //   );
    //   if (response.status === 400) {
    //     const data = await response.json();
    //     if (data.errors) {
    //       setErrors(data.errors);
    //     }
    //   } else if (response.status === 401) {
    //     const data = await response.json();
    //     if (data.message === "Token Expired") {
    //       // Clear user data from localStorage
    //       localStorage.removeItem("user");
    //       // Redirect to login page if token expired
    //       window.location.href = "/";
    //       return; // Exit early after redirecting
    //     }
    //   }

    //   if (!response.ok) {
    //     const errorData = await response.json();
    //     throw new Error(errorData.message || "Network response was not ok");
    //   }

    //   fetchDataBasedId();
    //   toast.success(
    //     invoiceFormId === -1
    //       ? "Invoice created successfully!"
    //       : "Invoice updated successfully!"
    //   );
    //   setFormData(initalValues);
    // } catch (error) {
    //   toast.error("Error Creating Invoice: ");
    // } finally {
    //   setReFetch(1);
    // }
  };

  return (
    <ProtectedPage>
      <Layout>
        <div className="content d-flex flex-direction-column">
          <div
          // style={{
          //   maxWidth: "600px",
          //   maxHeight: "100vh",
          //   height: "100%",
          //   position: "absolute",
          //   // display: invoiceFormId === null ? "none" : "flex",
          //   flexDirection: "column",
          //   borderRadius: "8px",
          //   zIndex: "1",
          //   backgroundColor: "#141625",
          // }}
          >
            <h2 style={styles.title}>New Invoice</h2>
            <div style={styles.mainSection}>
              <div
                style={{
                  display: "flex",
                  gap: "20px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    marginBottom: "20px",
                    width: "25%",
                    flexDirection: "column",
                  }}
                >
                  <CustomInput
                    type="text"
                    name="invoiceNo"
                    title="Invoice No."
                    value={formData?.invoiceNo}
                    onChange={handleChange}
                    style={styles.input}
                  required={true}
                  />
                  {errors?.invoiceNo && (
                    <p style={styles.error}>{errors.invoiceNo}</p>
                  )}
                </div>

                <div
                  style={{
                    display: "flex",
                    width: "25%",
                    flexDirection: "column",
                  }}
                  ref={datePickerInputRef}
                  onClick={handleDatePickerInputClick}
                >
                  <CustomDatePicker
                    name="createdAt"
                    title="Invoice Date"
                    value={formData.createdAt}
                    onChange={handleChange}
                    isDatePickerOpen={isDatePickerOpen}
                    customDatePickerRef={customDatePickerRef}
                  />

                  {errors?.issueDate && (
                    <p style={styles.error}>{errors.issueDate}</p>
                  )}
                </div>

                <div
                    style={{
                      display: "flex",
                      width: "25%",
                      marginBottom: "20px",
                      flexDirection: "column",
                    }}
                    ref={dueDatePickerInputRef}
                    onClick={handleDueDatePickerInputClick}
                  >
                    <CustomDatePicker
                      name="dueDate"
                      title="Invoice Due Date"
                      value={formData.dueDate}
                      onChange={handleChange}
                      isDatePickerOpen={isDueDatePickerOpen}
                      customDatePickerRef={dueCustomDatePickerRef}
                    />

                    {errors?.dueDate && (
                      <p style={styles.error}>{errors.dueDate}</p>
                    )}
                  </div>
              </div>
              <div className="parties-details-container flex justify-between gap-12">
                <div
                  className="bill-from-container w-3/6  p-4 rounded-lg"
                  style={styles.section}
                >
                  <h3 style={styles.titleText}>Bill From</h3>
                  <div
                    style={{
                      display: "flex",
                      gap: "20px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",

                        width: "100%",
                        flexDirection: "column",
                      }}
                    >
                      <CustomInput
                        type="text"
                        name="sender.name"
                        title="Name"
                        value={formData?.sender?.name}
                        onChange={handleChange}
                        style={styles.input}
                      required={true}
                      />
                      {errors?.senderName && (
                        <p style={styles.error}>{errors.senderName}</p>
                      )}
                    </div>

                    <div
                      style={{
                        display: "flex",

                        width: "100%",
                        flexDirection: "column",
                      }}
                    >
                      <CustomInput
                        type="text"
                        name="sender.contactNo"
                        title="Contact No."
                        value={formData?.sender?.contactNo}
                        onKeyDown={handleKeyDown}
                        onChange={handleChange}
                        style={styles.input}
                        required={true}
                      />
                      {errors?.senderContactNo && (
                        <p style={styles.error}>{errors.senderContactNo}</p>
                      )}
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "20px",
                      marginTop: "10px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",

                        width: "100%",
                        flexDirection: "column",
                      }}
                    >
                      <CustomInput
                        type="text"
                        name="sender.email"
                        title="Email"
                        value={formData?.sender?.email}
                        onChange={handleChange}
                        style={styles.input}
                      required={true}
                      />
                      {errors?.senderEmail && (
                        <p style={styles.error}>{errors.senderEmail}</p>
                      )}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        width: "100%",
                        flexDirection: "column",
                      }}
                    >
                      <CustomInput
                        type="text"
                        name="senderAddress.street"
                        title="Street Address"
                        value={formData?.senderAddress?.street}
                        onChange={handleChange}
                        style={styles.input}
                      required={true}
                      />
                      {errors?.clientStreetAddress && (
                        <p style={styles.error}>{errors.clientStreetAddress}</p>
                      )}
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: "20px",
                      marginTop: "10px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",

                        width: "100%",
                        flexDirection: "column",
                      }}
                    >
                      <CustomInput
                        type="text"
                        name="senderAddress.city"
                        title="City"
                        value={formData?.senderAddress?.city}
                        onChange={handleChange}
                        style={styles.input}
                        required={true}
                      />
                      {errors?.clientCity && (
                        <p style={styles.error}>{errors.clientCity}</p>
                      )}
                      {errors["senderAddress.city"] && (
                        <p style={styles.error}>
                          {errors["senderAddress.city"]}
                        </p>
                      )}
                    </div>

                    <div
                      style={{
                        display: "flex",

                        width: "100%",
                        flexDirection: "column",
                      }}
                    >
                      <CustomInput
                        type="text"
                        name="senderAddress.state"
                        title="State"
                        value={formData?.senderAddress?.state}
                        onChange={handleChange}
                        style={styles.input}
                        required={true}
                      />
                      {errors?.clientState && (
                        <p style={styles.error}>{errors.clientState}</p>
                      )}
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: "20px",
                      marginTop: "10px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",

                        width: "100%",
                        flexDirection: "column",
                      }}
                    >
                      <CustomInput
                        type="text"
                        name="senderAddress.postCode"
                        title="Post Code"
                        value={formData?.senderAddress?.postCode}
                        onChange={handleChange}
                        style={styles.input}
                        required={true}
                      />
                      {errors?.clientPostalCode && (
                        <p style={styles.error}>{errors.clientPostalCode}</p>
                      )}
                    </div>
                    <div
                      style={{
                        display: "flex",

                        width: "100%",
                        flexDirection: "column",
                      }}
                    >
                      <CustomInput
                        type="text"
                        name="senderAddress.country"
                        title="Country"
                        value={formData?.senderAddress?.country}
                        onChange={handleChange}
                        style={styles.input}
                        required={true}
                      />
                      {errors?.clientCountry && (
                        <p style={styles.error}>{errors.clientCountry}</p>
                      )}
                    </div>
                  </div>
 <div
                    style={{
                      display: "flex",
                      gap: "20px",
                      marginTop: "10px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",

                        width: "100%",
                        flexDirection: "column",
                      }}
                    >
                     <div
                      style={{
                        display: "flex",

                        width: "100%",
                        flexDirection: "column",
                      }}
                    >
                    <FormCustomDropdown
                      name="senderAddress.taxType"
                      title="Tax Type"
                      label={formData.senderAddress.taxType}
                      onSelect={handleChange}
                      style={styles.input}
                      options={[
                        { label: "Sales Tax", value: "Sales Tax" }, // USA
                        { label: "VAT", value: "VAT" }, // Europe, UK, China
                        { label: "Consumption Tax", value: "Consumption Tax" }, // Japan
                        { label: "GST", value: "GST" }, // Australia, India
                        { label: "GST/HST", value: "GST/HST" }, // Canada
                      ]}
                    />
                    </div>
                    </div>
                    <div
                      style={{
                        display: "flex",

                        width: "100%",
                        flexDirection: "column",
                      }}
                    >
                      <CustomInput
                        type="text"
                        name="senderAddress.taxPercentage"
                        title="Tax Percentage"
                        value={formData.senderAddress.taxPercentage}
                        onChange={handleChange}
                        style={styles.input}
                      />
                      {/* {errors?.SenderPancard && (
                        <p style={styles.error}>{errors.SenderPancard}</p>
                      )} */}
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "20px",
                      marginTop: "10px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",

                        width: "100%",
                        flexDirection: "column",
                      }}
                    >
                      <CustomInput
                        type="text"
                        name="senderAddress.gstin"
                        value={formData.senderAddress.gstin}
                        onChange={handleChange}
                        style={styles.input}
                        title={formData.senderAddress.taxType + " Number"}
                      />

                      {errors?.senderGstin && (
                        <p style={styles.error}>{errors.senderGstin}</p>
                      )}
                    </div>
                    { formData.senderAddress.taxType === "GST" && (
                      <div
                        style={{
                          display: "flex",

                          width: "100%",
                          flexDirection: "column",
                        }}
                      >
                        <CustomInput
                          type="text"
                          name="senderAddress.panCardNo"
                          title="PAN"
                          value={formData.senderAddress.panCardNo}
                          onChange={handleChange}
                          style={styles.input}
                        />
                        {errors?.SenderPancard && (
                          <p style={styles.error}>{errors.SenderPancard}</p>
                        )}
                    </div>
                    )}

                  </div>
                </div>

                <div className="bill-to-container w-3/6 p-4 rounded-lg" style={styles.section}>
                  <h3 style={styles.titleText}>Bill To</h3>
                  <div
                    style={{
                      display: "flex",
                      gap: "20px",
                      marginTop: "10px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        width: "100%",
                        flexDirection: "column",
                      }}
                    >
                      <CustomInput
                        type="text"
                        name="clientName"
                        title="Client's Name"
                        value={formData.clientName}
                        onChange={handleChange}
                        style={styles.input}
                        required={true}
                      />
                      {errors?.clientName ? (
                        <p style={styles.error}>{errors.clientName}</p>
                      ) : (
                        errors["clientName"] && (
                          <p style={styles.error}>{errors["clientName"]}</p>
                        )
                      )}
                    </div>

                    <div
                      style={{
                        display: "flex",
                        width: "100%",
                        flexDirection: "column",
                      }}
                    >
                      <CustomInput
                        type="text"
                        name="clientContactNo"
                        title="Client's Contact No."
                        value={formData.clientContactNo}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        style={styles.input}
                        required={true}
                      />
                      {errors?.clientContactNo ? (
                        <p style={styles.error}>{errors.clientContactNo}</p>
                      ) : (
                        errors["clientContactNo"] && (
                          <p style={styles.error}>{errors["clientContactNo"]}</p>
                        )
                      )}
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: "20px",
                      marginTop: "10px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",

                        width: "100%",
                        flexDirection: "column",
                      }}
                    >
                      <CustomInput
                        type="text"
                        name="clientEmail"
                        title="Client's Email"
                        // placeholder="e.g.email@example.com"
                        value={formData.clientEmail}
                        onChange={handleChange}
                        style={styles.input}
                        required={true}
                      />
                      {errors?.clientEmail ? (
                        <p style={styles.error}>{errors.clientEmail}</p>
                      ) : (
                        errors["clientEmail"] && (
                          <p style={styles.error}>{errors["clientEmail"]}</p>
                        )
                      )}
                    </div>
                    <div
                      style={{
                        display: "flex",

                        width: "100%",
                        flexDirection: "column",
                      }}
                    >
                      <CustomInput
                        type="text"
                        name="clientAddress.street"
                        value={formData?.clientAddress?.street}
                        onChange={handleChange}
                        title="Street Address"
                        style={styles.input}
                      />
                      {errors?.invoiceStreetAddress && (
                        <p style={styles.error}>
                          {errors.invoiceStreetAddress}
                        </p>
                      )}
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "20px",
                      marginTop: "10px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",

                        width: "100%",
                        flexDirection: "column",
                      }}
                    >
                      <CustomInput
                        type="text"
                        name="clientAddress.city"
                        value={formData?.clientAddress?.city}
                        onChange={handleChange}
                        title="City"
                        style={styles.input}
                        required={true}
                      />
                      {errors?.invoiceCity && (
                        <p style={styles.error}>{errors.invoiceCity}</p>
                      )}
                    </div>
                    <div
                      style={{
                        display: "flex",

                        width: "100%",
                        flexDirection: "column",
                      }}
                    >
                      <CustomInput
                        type="text"
                        name="clientAddress.state"
                        value={formData?.clientAddress?.state}
                        onChange={handleChange}
                        title="State"
                        style={styles.input}
                        required={true}
                      />
                      {errors?.invoiceState && (
                        <p style={styles.error}>{errors.invoiceState}</p>
                      )}
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: "20px",
                      marginTop: "10px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",

                        width: "100%",
                        flexDirection: "column",
                      }}
                    >
                      <CustomInput
                        type="text"
                        name="clientAddress.postCode"
                        value={formData?.clientAddress?.postCode}
                        onChange={handleChange}
                        title={"Post Code"}
                        style={styles.input}
                        required={true}
                      />
                      {errors?.invoicePostcode && (
                        <p style={styles.error}>{errors.invoicePostcode}</p>
                      )}
                    </div>
                    <div
                      style={{
                        display: "flex",

                        width: "100%",
                        flexDirection: "column",
                      }}
                    >
                      <CustomInput
                        type="text"
                        name="clientAddress.country"
                        value={formData?.clientAddress?.country}
                        onChange={handleChange}
                        title="Country"
                        style={styles.input}
                        required={true}
                      />
                      {errors?.invoiceCountry && (
                        <p style={styles.error}>{errors.invoiceCountry}</p>
                      )}
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "20px",
                      marginTop: "10px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",

                        width: "100%",
                        flexDirection: "column",
                      }}
                    >
                      <FormCustomDropdown
                        name="clientAddress.taxType"
                        title="Tax Type"
                        label={formData.clientAddress.taxType}
                        onSelect={handleChange}
                        style={styles.input}
                        options={[
                          { label: "Sales Tax", value: "Sales Tax" }, // USA
                          { label: "VAT", value: "VAT" }, // Europe, UK, China
                          { label: "Consumption Tax", value: "Consumption Tax" }, // Japan
                          { label: "GST", value: "GST" }, // Australia, India
                          { label: "GST/HST", value: "GST/HST" }, // Canada
                        ]}
                      />

                    </div>
                    {/* <div
                      style={{
                        display: "flex",

                        width: "100%",
                        flexDirection: "column",
                      }}
                    >
                      <CustomInput
                        type="text"
                        name="clientAddress.taxPercentage"
                        title="Tax Percentage"
                        value={formData.clientAddress.taxPercentage}
                        onChange={handleChange}
                        style={styles.input}
                      />
                    </div> */}
                    <div
                      style={{
                        display: "flex",

                        width: "100%",
                        flexDirection: "column",
                      }}
                    >
                      <CustomInput
                        type="text"
                        name="clientAddress.gstin"
                        value={formData.clientAddress.gstin}
                        onChange={handleChange}
                        style={styles.input}
                        title={formData.clientAddress.taxType + " Number"}
                      />

                      {errors?.ClientGstin && (
                        <p style={styles.error}>{errors.ClientGstin}</p>
                      )}
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "20px",
                      marginTop: "10px",
                    }}
                  >
                    {/* <div
                      style={{
                        display: "flex",

                        width: "100%",
                        flexDirection: "column",
                      }}
                    >
                      <CustomInput
                        type="text"
                        name="clientAddress.gstin"
                        value={formData.clientAddress.gstin}
                        onChange={handleChange}
                        style={styles.input}
                        title={formData.clientAddress.taxType + " Number"}
                      />

                      {errors?.ClientGstin && (
                        <p style={styles.error}>{errors.ClientGstin}</p>
                      )}
                    </div> */}
                    { formData.clientAddress.taxType === "GST" && 
                      <div
                      style={{
                        display: "flex",

                        width: "100%",
                        flexDirection: "column",
                      }}
                    >
                      <CustomInput
                        type="text"
                        name="clientAddress.panCardNo"
                        title="PAN Card Number"
                        value={formData.clientAddress.panCardNo}
                        onChange={handleChange}
                        style={styles.input}
                      />
                      {errors?.ClientPancard && (
                        <p style={styles.error}>{errors.ClientPancard}</p>
                      )}
                    </div>
                    }
                   
                  </div>
                  
                </div>
              </div>
              <div style={styles.section}>
                <div
                  style={{
                    display: "flex",
                    gap: "20px",
                    marginTop: "10px",
                  }}
                ></div>

                <div
                  style={{
                    display: "flex",
                    gap: "20px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      width: "25%",
                      marginTop: "10px",
                      flexDirection: "column",
                    }}
                  >
                    <FormCustomDropdown
                      name="currency"
                      title="Currency"
                      label={formData.currency}
                      onSelect={handleChange}
                      style={styles.input}
                      options={[
                        { label: "USD - US Dollar", value: "USD" },
                        { label: "EUR - Euro", value: "EUR" },
                        { label: "GBP - British Pound", value: "GBP" },
                        { label: "JPY - Japanese Yen", value: "JPY" },
                        { label: "AUD - Australian Dollar", value: "AUD" },
                        { label: "CAD - Canadian Dollar", value: "CAD" },
                        { label: "INR - Indian Rupee", value: "INR" },
                        { label: "CNY - Chinese Yuan", value: "CNY" },
                      ]}
                    />
                    {errors?.currency && (
                      <p style={styles.error}>{errors.currency}</p>
                    )}
                  </div>
                </div>
                <h3 style={styles.titleText}>Item List</h3>
                {formData.items &&
                  formData.items.map((item, index) => (
                    <div key={index} style={styles.itemContainer}>
                      <CustomInput
                        type="text"
                        name="name"
                        title="Item Name"
                        containerStyle={{ width: "fit-content" }}
                        value={item.name}
                        onChange={(e) => handleItemChange(index, e)}
                        inputStyle={{
                          flex: "2 1 auto", // Larger space for Item Name
                        }}
                        required={true}
                      />

                      <CustomInput
                        type="text"
                        name="description"
                        title="Item Description"
                        containerStyle={{ width: "fit-content" }}
                        value={item.description}
                        onChange={(e) => handleItemChange(index, e)}
                        inputStyle={{
                          flex: "2 1 auto", // Larger space for Item Name
                        }}
                        required={true}
                      />

                      <CustomInput
                        type="number"
                        name="quantity"
                        title="Qty/Hrs."
                        containerStyle={{ width: "fit-content" }}
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, e)}
                        inputStyle={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flex: "0.3 1 auto", // Smaller space for Quantity
                          maxWidth: "70px", // Ensure it doesn't get too large
                        }}
                        required={true}
                      />

                      <CustomInput
                        type="number"
                        name="price"
                        containerStyle={{ width: "fit-content" }}
                        title="Price"
                        value={item.price}
                        onChange={(e) => handleItemChange(index, e)}
                        inputStyle={{
                          flex: "1 1 auto", // Medium space for Price
                          maxWidth: "100px", // Control the size of the price input
                        }}
                        required={true}
                      />

                      <CustomInput
                        title={"Total"}
                        containerStyle={{ width: "fit-content" }}
                        isText={true}
                        value={(() => {
                          const currencySymbols = {
                            USD: "$",  // US Dollar
                            EUR: "€",  // Euro
                            GBP: "£",  // British Pound
                            JPY: "¥",  // Japanese Yen
                            AUD: "A$", // Australian Dollar
                            CAD: "C$", // Canadian Dollar
                            INR: "₹",  // Indian Rupee
                            CNY: "¥",  // Chinese Yuan
                          };
                        
                          const selectedCurrency = formData.currency;
                          const symbol = currencySymbols[selectedCurrency] || ''; // Default to empty if currency not found
                        
                          return selectedCurrency ? `${symbol} ${item.total || 0}` : item.total || 0;
                        })()}
                        inputStyle={{
                          flex: "1 1 auto", // Adjust size as needed for Total
                        }}
                      />

                      <div
                        onClick={() => handleRemoveItem(index)}
                        style={{
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          height: "100%",
                          flex: "0 1 auto",
                          paddingTop: "20px",
                        }}
                      >
                        <DeleteIcon />
                      </div>
                    </div>
                  ))}
                {errors?.items && <p style={styles.error}>{errors.items}</p>}
                {(errors[`items[0].name`] ||
                  errors[`items[0].price`] ||
                  errors[`items[0].description`] ||
                  errors[`items[0].quantity`]) && (
                  <p style={styles.error}>Required fields</p>
                )}
                <CustomButton
                  type="gray"
                  onClick={(e) => {
                    e.preventDefault();
                    handleAddItem();
                  }}
                  buttonStyle={{
                    width: "25%",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    float: "right",
                  }}
                >
                  <PlusIcon f={"#dfe3fa"} /> Add New Item
                </CustomButton>
              </div>
              <div className="mt-20 rounded-lg" style={styles.section}>
                  <h3 style={styles.titleText}>Bank Details</h3>
                  <div
                    style={{
                      display: "flex",
                      gap: "20px",
                      marginTop: "10px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        width: "100%",
                        flexDirection: "column",
                      }}
                    >
                      <CustomInput
                        type="text"
                        name="bankDetails.bankName"
                        title="Bank Name"
                        value={formData.bankDetails.bankName}
                        onChange={handleChange}
                        style={styles.input}
                      />
                    </div>

                    <div
                      style={{
                        display: "flex",
                        width: "100%",
                        flexDirection: "column",
                      }}
                    >
                      <CustomInput
                        type="text"
                        name="bankDetails.accountNumber"
                        title="Account No."
                        value={formData.bankDetails.accountNumber}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        style={styles.input}
                      />
                    </div>

                    <div
                      style={{
                        display: "flex",

                        width: "100%",
                        flexDirection: "column",
                      }}
                    >
                      <CustomInput
                        type="text"
                        name="bankDetails.confirmAccountNumber"
                        title="Confirm Account No."
                        placeholder=""
                        value={formData.bankDetails.confirmAccountNumber}
                        onChange={handleChange}
                        style={styles.input}
                      />
                      {errors?.confirmAccountNumber && (
                        <p style={styles.error}>{errors.confirmAccountNumber}</p>
                      )}
                    </div>

                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: "20px",
                      marginTop: "10px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",

                        width: "100%",
                        flexDirection: "column",
                      }}
                    >
                      <CustomInput
                        type="text"
                        name="bankDetails.ifscCode"
                        title="IFSC Code"
                        placeholder=""
                        value={formData.bankDetails.ifscCode}
                        onChange={handleChange}
                        style={styles.input}
                      />
                    </div>
                    <div
                      style={{
                        display: "flex",

                        width: "100%",
                        flexDirection: "column",
                      }}
                    >
                      <CustomInput
                        type="text"
                        name="bankDetails.accounHolderName"
                        value={formData?.bankDetails.accounHolderName}
                        onChange={handleChange}
                        title="Account Holder Name"
                        style={styles.input}
                      />
                    </div>
                    <div
                      style={{
                        display: "flex",

                        width: "100%",
                        flexDirection: "column",
                      }}
                    >
                      <CustomInput
                        type="text"
                        name="bankDetails.bankAccountType"
                        title="Account Type"
                        placeholder=""
                        value={formData.bankDetails.bankAccountType}
                        onChange={handleChange}
                        style={styles.input}
                      />
                    </div>
                    
                  </div>

                </div>
            </div>
            <div>
               <InvoiceTemplates handleSelectTemplates={handleSelectTemplate} selectable = {true}/>
            </div>
            <div style={styles.buttons}>
              <div style={{ display: "flex", gap: "5px" }}>
                <CustomButton
                  type="purple"
                  onClick={(e) => handleSubmit(e, false)}
                  buttonStyle={{ minWidth: "150px" }}
                  isLoading={loading}
                  disabled={downloadInvoiceIsDisabled ? true : false}
                >
                  Generate Invoice
                </CustomButton>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedPage>
  );
};

const styles = {
  title: {
    padding: "35px 0px",
  },
  titleText: {
    color: "#7C5DFA",
    fontSize: "15px",
    marginTop: "15px",
    marginBottom: "10px",
  },
  mainSection: {
    padding: "20px 0px",
    // maxWidth: "600px",
    height: "100%",
    overflow: "auto",
    backgroundColor: "#141625",
    /* Custom scrollbar styles */
    scrollbarWidth: "thin" /* For Firefox */,
    scrollbarColor:
      "#252945 transparent" /* For Firefox: thumb color and track color */,
  },
  /* Webkit-based browsers (Chrome, Safari, Edge) */
  "mainSection::-webkit-scrollbar": {
    width: "8px" /* Width of the scrollbar */,
  },
  "mainSection::-webkit-scrollbar-thumb": {
    backgroundColor: "#888" /* Color of the scrollbar thumb */,
    borderRadius: "10px" /* Round the corners of the scrollbar thumb */,
  },
  "mainSection::-webkit-scrollbar-track": {
    backgroundColor: "transparent" /* Make the scrollbar track transparent */,
  },

  itemListTitle: {
    color: "#888EB0",
    fontSize: "15px",
    marginBottom: "10px",
  },
  section: {
    marginBottom: "20px",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  itemContainer: {
    display: "flex",
    alignItems: "center",
    marginBottom: "10px",
    gap: "10px",
    flex: "2 1 1 1",
  },
  removeButton: {
    marginLeft: "10px",
    backgroundColor: "#ff4d4d",
    color: "#fff",
    border: "none",
    padding: "5px 10px",
    borderRadius: "4px",
    cursor: "pointer",
  },
  addItemButton: {
    backgroundColor: "#4CAF50",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "4px",
    cursor: "pointer",
  },
  buttons: {
    display: "flex",
    backgroundColor: "#141625",
    justifyContent: "space-between",
    borderRadiusRight: "8px",
    width: "100%",
    padding: "20px",
    paddingLeft: "40px",
    paddingRight: "40px",
    borderRadius: "0px 39px 0px 0px",
  },
  submitButton: {
    backgroundColor: "#2196F3",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "4px",
    cursor: "pointer",
  },
  draftButton: {
    backgroundColor: "#FFC107",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "4px",
    cursor: "pointer",
  },
  error: {
    color: "red",
    margin: "5px 0",
  },
  success: {
    color: "green",
    margin: "10px 0",
  },
};

export default InvoiceForm;
