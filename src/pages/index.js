import Layout from '../components/Layout';
import React, { useEffect, useState } from "react";
import CustomButton from "../components/Button";
import CustomInput from "../components/Input";
import FormCustomDropdown from "../components/FormDropdown";
import { DeleteIcon, PlusIcon } from "../components/icons";
import CustomDatePicker from "../components/DatePicker";
import { toast } from "react-toastify";
import Link from 'next/link';
import "./style.css";
import ProtectedPage from './protected';
import { generateHTMLPDF } from "../utils/generateHTMLPDF";
import { addDays, formatDate } from '../utils/helpers';

const InvoiceForm = ({ templates }) => {
  const [user, setUser] = useState(null);
  const [invoiceTemplates, setTemplates] = useState([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);
  const [downloadInvoiceIsDisabled, setDownloadInvoiceIsDisabled] = useState(true);

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
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    const res = await fetch(`http://localhost:${process.env.NEXT_PUBLIC_PORT}/api/templates`);
    const templates = await res.json();
    setTemplates(templates);
  }

  const formatDateToISO = (date) => {
    return date.toISOString().split("T")[0];
  };
  const formDataInitialValues = {
    createdAt: formatDateToISO(new Date()),
    description: "",
    paymentTerms: 30,
    clientName: "",
    clientEmail: "",
    status: "draft",
    senderAddress: {
      street: "",
      city: "",
      postCode: "",
      country: "",
    },
    clientAddress: {
      street: "",
      city: "",
      postCode: "",
      country: "",
    },
    items: [
      {
        name: "",
        quantity: "",
        price: "",
      },
    ],
    total: 0,
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
      setFormData((prev) => ({
        ...prev,
        [e?.name]: e?.value,
      }));
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
      items: [...prev.items, { name: "", quantity: "", price: "" }],
    }));
  };

  const handleRemoveItem = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData((prev) => ({
      ...prev,
      items: newItems,
    }));
  };

  const handleSelectTemplate = (templateId) => {
    setSelectedTemplateId(templateId);
    setDownloadInvoiceIsDisabled(false);
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
    if (!formData.clientAddress?.street)
      newErrors.invoiceStreetAddress = "Required field";
    if (!formData.clientAddress?.city) newErrors.invoiceCity = "Required field";
    if (!formData.clientAddress?.postCode)
      newErrors.invoicePostcode = "Required field";
    if (!formData.clientAddress?.country)
      newErrors.invoiceCountry = "Required field";
    if (!formData.createdAt) newErrors.issueDate = "Required field";
    if (!formData.paymentTerms) newErrors.paymentTerm = "Required field";
    if (!formData.description) newErrors.projectDescription = "Required field";
    if (
      formData.items.some((item) => !item.name || !item.quantity || !item.price)
    )
      newErrors.items = "Required fields";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e, saveAsDraft) => {
    e.preventDefault();
    if (!saveAsDraft && !validateForm()) return;
    formData["Invoice No."] = formData.invoiceNo;
    formData["Template Id"] = selectedTemplateId;
    formData["Items"] = formData.items;
    formData["Sender's Name"] = formData.sender.name;
    formData["Sender's Address"] = formData.senderAddress.street;
    formData["Sender's City"] = formData.senderAddress.city;
    formData["Sender's State"] = formData.senderAddress.state;
    formData["Sender's Contact No"] = formData.sender.contactNo;
    formData["Sender's Email"] = formData.sender.email;
    formData["Sender's Zipcode"] = formData.senderAddress.postCode;
    // formData["Sender's Company Name"] = formData.;
    formData["Receiver's Name"] = formData.clientName;
    formData["Receiver's Address"] = formData.clientAddress.street;
    formData["Receiver's City"] = formData.clientAddress.city;
    formData["Receiver's State"] = formData.clientAddress.state;
    formData["Receiver's Contact No"] = formData.clientContactNo;
    formData["Receiver's email"] = formData.clientEmail;
    // formData["Receiver's Zipcode"] = formData.;
    // formData["Receiver's Company Name"] = formData.;
    // formData["Remarks"] = formData.;

    // add invoice issue date
    formData["Invoice Issue Date"] = formData.createdAt;

    // add invoice due date
    const paymentDueDate = addDays(formData["Invoice Issue Date"], formData.paymentTerms);
    formData["Invoice Due Date"] = paymentDueDate;

    const pdfBlob = await generateHTMLPDF(formData);
    // Create a temporary URL for the blob
    const blobURL = URL.createObjectURL(pdfBlob);

    // Create an <a> element
    const link = document.createElement("a");

    // Set the download attribute with a filename
    link.href = blobURL;
    link.download = `${formData["Invoice No."]}.pdf`;

    // Programmatically trigger the download by clicking the link
    document.body.appendChild(link);
    link.click();

    // Clean up and remove the link after triggering the download
    document.body.removeChild(link);

    // Revoke the object URL to free memory
    URL.revokeObjectURL(blobURL);
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
        <div className='content d-flex flex-direction-column'>
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
                  marginBottom: "20px",
                  width: "100%",
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
              
              <div style={styles.section}>
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
              </div>

              <div style={styles.section}>
                <h3 style={styles.titleText}>Bill To</h3>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
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
                        placeholder="e.g.email@example.com"
                        value={formData.clientEmail}
                        onChange={handleChange}
                        style={styles.input}
                        required={true}
                      />
                      {errors?.clientEmail ? (
                        <p style={styles.error}>{errors.clientEmail}</p>
                      ) : errors["clientEmail"] && (
                        <p style={styles.error}>{errors["clientEmail"]}</p>
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
                        name="clientAddress.street"
                        value={formData?.clientAddress?.street}
                        onChange={handleChange}
                        title="Street Address"
                        style={styles.input}
                        required={true}
                      />
                      {errors?.invoiceStreetAddress && (
                        <p style={styles.error}>{errors.invoiceStreetAddress}</p>
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
                      <CustomInput
                        type="text"
                        name="gstin"
                        value={formData.gstin}
                        onChange={handleChange}
                        style={styles.input}
                        title="GSTIN"
                      />

                      {errors?.gstin && (
                        <p style={styles.error}>{errors.gstin}</p>
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
                        name="panCardNo"
                        title="PAN"
                        value={formData.panCardNo}
                        onChange={handleChange}
                        style={styles.input}
                      />
                      {errors?.panCardNo && (
                        <p style={styles.error}>{errors.panCardNo}</p>
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
                      <CustomDatePicker
                        name="createdAt"
                        title="Invoice Date"
                        value={formData.createdAt}
                        onChange={handleChange}
                      />

                      {errors?.issueDate && (
                        <p style={styles.error}>{errors.issueDate}</p>
                      )}
                    </div>
                    <div
                      style={{
                        display: "flex",

                        width: "100%",
                        flexDirection: "column",
                      }}
                    >
                      <FormCustomDropdown
                        name="paymentTerms"
                        title="Payment Terms"
                        label={formData.paymentTerms}
                        onSelect={handleChange}
                        style={styles.input}
                        options={[
                          { label: "Net 1 Day", value: 1 },
                          { label: "Net 7 Day", value: 7 },
                          { label: "Net 14 Day", value: 14 },
                          { label: "Net 30 Day", value: 30 },
                        ]}
                      />
                      {errors?.paymentTerm && (
                        <p style={styles.error}>{errors.paymentTerm}</p>
                      )}
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
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      title="Project Description"
                      placeholder="e.g.Graphic Design Service"
                      style={styles.input}
                    />
                    {errors?.projectDescription && (
                      <p style={styles.error}>{errors.projectDescription}</p>
                    )}
                  </div>
                </div>
              </div>

              <div style={styles.section}>
                <h3 style={styles.itemListTitle}>Item List</h3>
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
                        type="number"
                        name="quantity"
                        title="Qty."
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
                        value={item.total || 0}
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
                        }}
                      >
                        <DeleteIcon />
                      </div>
                    </div>
                  ))}
                {errors?.items && <p style={styles.error}>{errors.items}</p>}
                {(errors[`items[0].name`] || errors[`items[0].price`] || errors[`items[0].quantity`]) && <p style={styles.error}>Required fields</p>}
                <CustomButton
                  type="gray"
                  onClick={(e) => {
                    e.preventDefault();
                    handleAddItem();
                  }}
                  buttonStyle={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                  }}
                >
                  <PlusIcon f={"#dfe3fa"} /> Add New Item
                </CustomButton>
              </div>
            </div>

            <h2 style={styles.title}>Select Template</h2>

            <div className='templates-container flex flex-wrap'>
              {invoiceTemplates.map((invoiceTemplate) => (
                
                <div key={invoiceTemplate.id}
                  className={`template-tile w-1/3 p-2 flex items-center flex-col `}
                  >

                  <div className={`template-content flex items-center flex-col ${ selectedTemplateId === invoiceTemplate.id ? "selected-invoice-template" : "" }`}
                    onClick={() => handleSelectTemplate(invoiceTemplate.id)}>

                    <div className='template-preview-image-container'>
                      <img className='template-preview-image' src={invoiceTemplate.previewUrl} style={styles['template-preview-image']}></img>
                    </div>
                    <div className='template-name'>
                      <span>{invoiceTemplate.name}</span>
                    </div>

                  </div>

                </div>
              ))}
            </div>

            <div style={styles.buttons}>
              <div style={{ display: "flex", gap: "5px" }}>
                <CustomButton type="purple" onClick={(e) => handleSubmit(e, false)}  buttonStyle={{ minWidth: "150px" }} isLoading={false} disabled={downloadInvoiceIsDisabled ? true : false}>
                  Download Invoice
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
  "template-preview-image": {
    maxHeight: "300px"
  },
  title: {
    padding: "35px 40px",
    paddingTop: "40px",
  },
  titleText: {
    color: "#7C5DFA",
    fontSize: "15px",
    marginBottom: "25px",
  },
  mainSection: {
    padding: "20px",
    paddingLeft: "40px",
    paddingRight: "40px",
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
