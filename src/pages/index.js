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

const InvoiceForm = ({ templates }) => {
  const [user, setUser] = useState(null);
  const [invoiceTemplates, setTemplates] = useState({});

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
    console.log(`templates: `, templates);
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

  const fetchDataBasedId = async () => {
    // if (user) {
    //   const response = await fetch(
    //     `http://localhost:5000/api/invoices/${invoiceFormId}`,
    //     {
    //       method: "GET",
    //       headers: {
    //         Authorization: `Bearer ${user.token}`,
    //         "Content-Type": "application/json",
    //       },
    //     }
    //   );
    //   const data = await response.json();

    //   setInitalValues(data);
    //   setFormData(data);
    // }
  };

  useEffect(() => {
    fetchDataBasedId();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.clientName) newErrors.clientName = "Required field";
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
    console.log(`formData: `, formData);
    if (!saveAsDraft && !validateForm()) return;

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
              <div style={styles.section}>
                <h3 style={styles.titleText}>Bill From</h3>
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
                  />
                  {errors?.clientStreetAddress && (
                    <p style={styles.error}>{errors.clientStreetAddress}</p>
                  )}
                  {errors["senderAddress.street"] && (
                    <p style={styles.error}>{errors["senderAddress.street"]}</p>
                  )}
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
                    />
                    {errors?.clientCity && (
                      <p style={styles.error}>{errors.clientCity}</p>
                    )}
                    {errors["senderAddress.city"] && (
                      <p style={styles.error}>{errors["senderAddress.city"]}</p>
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
                      name="senderAddress.postCode"
                      title="Post Code"
                      value={formData?.senderAddress?.postCode}
                      onChange={handleChange}
                      style={styles.input}
                    />
                    {errors?.clientPostalCode && (
                      <p style={styles.error}>{errors.clientPostalCode}</p>
                    )}
                    {errors["senderAddress.postCode"] && (
                      <p style={styles.error}>{errors["senderAddress.postCode"]}</p>
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
                    />
                    {errors?.clientCountry && (
                      <p style={styles.error}>{errors.clientCountry}</p>
                    )}
                    {errors["senderAddress.country"] && (
                      <p style={styles.error}>{errors["senderAddress.country"]}</p>
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
                      name="clientEmail"
                      title="Client's Email"
                      placeholder="e.g.email@example.com"
                      value={formData.clientEmail}
                      onChange={handleChange}
                      style={styles.input}
                    />
                    {errors?.clientEmail ? (
                      <p style={styles.error}>{errors.clientEmail}</p>
                    ) : errors["clientEmail"] && (
                      <p style={styles.error}>{errors["clientEmail"]}</p>
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
                      <p style={styles.error}>{errors.invoiceStreetAddress}</p>
                    )}
                    {errors["clientAddress.street"] && (
                      <p style={styles.error}>{errors["clientAddress.street"]}</p>
                    )}
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
                      />
                      {errors?.invoiceCity && (
                        <p style={styles.error}>{errors.invoiceCity}</p>
                      )}
                      {errors["clientAddress.city"] && (
                        <p style={styles.error}>{errors["clientAddress.city"]}</p>
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
                        name="clientAddress.postCode"
                        value={formData?.clientAddress?.postCode}
                        onChange={handleChange}
                        title={"Post Code"}
                        style={styles.input}
                      />
                      {errors?.invoicePostcode && (
                        <p style={styles.error}>{errors.invoicePostcode}</p>
                      )}
                      {errors["clientAddress.postCode"] && (
                        <p style={styles.error}>{errors["clientAddress.postCode"]}</p>
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
                      />
                      {errors?.invoiceCountry && (
                        <p style={styles.error}>{errors.invoiceCountry}</p>
                      )}
                      {errors["clientAddress.country"] && (
                        <p style={styles.error}>{errors["clientAddress.country"]}</p>
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
                    {errors["description"] && (
                      <p style={styles.error}>{errors["description"]}</p>
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

            <div className='templates-container d-flex'>
              <div className='template-tile'></div>
            </div>

            <div style={styles.buttons}>
              <div style={{ display: "flex", gap: "5px" }}>
                <CustomButton type="purple" onClick={(e) => handleSubmit(e, false)}>
                  Save Changes
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
