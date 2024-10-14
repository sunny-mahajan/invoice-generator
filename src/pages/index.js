import Layout from "../components/Layout";
import React, { useRef, useState } from "react";
import CustomButton from "../components/Button";
import CustomInput from "../components/Input";
import FormCustomDropdown from "../components/FormDropdown";
import { DeleteIcon, PlusIcon } from "../utils/icons";
import CustomDatePicker from "../components/DatePicker";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./style.css";
import { generateHTMLPDF } from "../utils/generateHTMLPDF";
import {
  addDays,
  formatDateToISO,
  mapBankDetails,
  mapReceiverDetails,
  mapSenderDetails,
  validateEmail,
  validateField,
} from "../utils/helpers";
import InvoiceTemplates from "../components/InvoiceTemplates";
import useClickOutside from "../hooks/useClickOutside";
import {
  currencyOptions,
  allowedKeys,
  taxTypeOptions,
  currencySymbols,
} from "../utils/constants";
import PhoneInputField from "../components/Input/phoneInput";

const formDataInitialValues = {
  invoiceNo: "",
  createdAt: formatDateToISO(new Date()),
  dueDate: formatDateToISO(addDays(new Date(), 30)),
  status: "draft",
  senderDetails: {
    name: "",
    contactNo: "",
    email: "",
    street: "",
    city: "",
    postCode: "",
    country: "",
    state: "",
    taxType: "GST",
    taxNo: "",
  },
  clientDetails: {
    name: "",
    contactNo: "",
    email: "",
    street: "",
    city: "",
    postCode: "",
    country: "",
    state: "",
    taxType: "GST",
    taxNo: "",
  },
  items: [
    {
      name: "",
      description: "",
      quantity: "",
      price: "",
    },
  ],
  newFields: [],
  bankDetails: {
    bankName: "",
    accountNumber: "",
    confirmAccountNumber: "",
    ifscCode: "",
    accounHolderName: "",
    bankAccountType: "",
  },
  taxPercentage: 0,
  total: 0,
  currency: "INR",
};

const InvoiceForm = () => {
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);
  const [downloadInvoiceIsDisabled, setDownloadInvoiceIsDisabled] =
    useState(true);
  const [loading, setLoading] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isDueDatePickerOpen, setIsDueDatePickerOpen] = useState(false);
  const [formData, setFormData] = useState(formDataInitialValues);
  const [errors, setErrors] = useState({});

  const customDatePickerRef = useRef(null);
  const datePickerInputRef = useRef(null);
  const dueDatePickerInputRef = useRef(null);
  const dueCustomDatePickerRef = useRef(null);

  useClickOutside([customDatePickerRef, datePickerInputRef], () =>
    setIsDatePickerOpen(false)
  );

  useClickOutside([dueCustomDatePickerRef, dueDatePickerInputRef], () =>
    setIsDueDatePickerOpen(false)
  );

  const handleDatePickerInputClick = (isDueDate = false) => {
    if (isDueDate) {
      setIsDueDatePickerOpen((prevState) => !prevState);
      return;
    }
    setIsDatePickerOpen((prevState) => !prevState);
  };

  const handleKeyDown = (event) => {
    if (
      allowedKeys.includes(event.key) ||
      (event.key >= "0" && event.key <= "9")
    ) {
      return;
    }

    event.preventDefault();
  };

  const handleChange = (e) => {
    if (Object.keys(errors).length !== 0) {
      validateForm();
    }

    const updateFormData = (name, value) => {
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
    };

    // Handle based on whether 'e' is an event or an object with name/value
    if (e?.target) {
      const { name, value } = e.target;
      updateFormData(name, value);
    } else if (e?.name) {
      updateFormData(e.name, e.value);
    }
  };

  const handleItemChange = (index, e) => {
    if (Object.keys(errors).length !== 0) {
      validateForm();
    }

    const { name, value } = e.target;

    setFormData((prev) => {
      const updatedItems = [...prev.items];
      updatedItems[index] = {
        ...updatedItems[index],
        [name]: value,
      };

      // Calculate total only if both quantity and price are valid
      const { quantity, price } = updatedItems[index];
      updatedItems[index].total =
        quantity && price ? (quantity * price).toFixed(2) : "0.00";

      return {
        ...prev,
        items: updatedItems,
      };
    });
  };

  const handleFieldChange = (index, e) => {
    if (Object.keys(errors).length !== 0) {
      validateForm();
    }

    const { name, value } = e.target; // Corrected destructuring

    setFormData((prev) => {
      const updatedFields = [...prev.newFields];
      updatedFields[index] = {
        ...updatedFields[index],
        [name]: value, // Use name from input to update the correct field
      };

      return {
        ...prev,
        newFields: updatedFields, // Corrected to update 'newFields'
      };
    });
  };

  const handleAddItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        { name: "", description: "", quantity: "", price: "" },
      ],
    }));
  };
  const handleAddField = () => {
    setFormData((prev) => ({
      ...prev,
      newFields: [...prev.newFields, { fieldName: "", fieldValue: "" }],
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
  const handleRemoveField = (index) => {
    const newItems = formData.newFields.filter((_, i) => i !== index);
    setFormData((prev) => ({
      ...prev,
      newFields: newItems,
    }));
  };

  const handleSelectTemplate = (templateId) => {
    setSelectedTemplateId(templateId);
    setDownloadInvoiceIsDisabled(false); // Enable the download button
  };

  const validateForm = () => {
    const newErrors = {};

    // Invoice Info
    validateField(formData.invoiceNo, "invoiceNo", "Required field", newErrors);

    // Sender Info
    const senderDetails = formData.senderDetails || {};
    validateField(
      senderDetails.name,
      "senderName",
      "Required field",
      newErrors
    );
    validateEmail(senderDetails.email, "senderEmail", newErrors);

    // Client Info
    const clientDetails = formData.clientDetails || {};
    validateField(
      clientDetails.name,
      "clientName",
      "Required field",
      newErrors
    );
    validateEmail(clientDetails.email, "clientEmail", newErrors);

    // Bank Details Validation
    if (
      formData.bankDetails?.accountNumber &&
      formData.bankDetails.accountNumber !==
        formData.bankDetails.confirmAccountNumber
    ) {
      newErrors.confirmAccountNumber =
        "Account number and confirm account number should be the same.";
    }

    // Items Validation
    if (
      formData.items.some(
        (item) =>
          !item.name || !item.description || !item.quantity || !item.price
      )
    ) {
      newErrors.items = "Required fields";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e, saveAsDraft) => {
    e.preventDefault();

    if (!saveAsDraft && !validateForm()) {
      toast.error("Please fill all required fields before submitting");
      return;
    }
    setLoading(true);

    const mappedData = {
      "Invoice No.": formData.invoiceNo,
      "Template Id": selectedTemplateId,
      "Invoice Issue Date": formData.createdAt,
      "Invoice Due Date": formData.dueDate,
      ...mapSenderDetails(formData.senderDetails),
      ...mapReceiverDetails(formData.clientDetails),
      ...mapBankDetails(formData.bankDetails),
      newFields: formData.newFields,
      Items: formData.items,
      Currency: formData.currency,
      "Tax Percentage": formData.taxPercentage,
    };
    try {
      const pdfBlob = await generateHTMLPDF(mappedData);
      if (pdfBlob) {
        // Create a temporary URL for the blob
        const blobURL = URL.createObjectURL(pdfBlob);

        // Open the PDF in a new tab
        window.open(blobURL, "_blank");

        // Clean up: revoke the object URL to free memory after a short delay
        setTimeout(() => URL.revokeObjectURL(blobURL), 100);
      }

      // const response = await submitInvoice(mappedData, saveAsDraft);
      // handleResponse(response);
    } catch (error) {
      toast.error("Error generating invoice PDF: " + error.message);
    } finally {
      setLoading(false);
      // Optional: trigger any post-submit actions like fetching updated data.
    }
  };

  return (
    <Layout>
      <div className="content d-flex flex-direction-column">
        <div>
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
                onClick={() => handleDatePickerInputClick(false)}
              >
                <CustomDatePicker
                  name="createdAt"
                  title="Invoice Date"
                  value={formData.createdAt}
                  onChange={handleChange}
                  isDatePickerOpen={isDatePickerOpen}
                  customDatePickerRef={customDatePickerRef}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  width: "25%",
                  marginBottom: "20px",
                  flexDirection: "column",
                }}
                ref={dueDatePickerInputRef}
                onClick={() => handleDatePickerInputClick(true)}
              >
                <CustomDatePicker
                  name="dueDate"
                  title="Invoice Due Date"
                  value={formData.dueDate}
                  onChange={handleChange}
                  isDatePickerOpen={isDueDatePickerOpen}
                  customDatePickerRef={dueCustomDatePickerRef}
                />
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
                      name="senderDetails.name"
                      title="Name"
                      value={formData?.senderDetails?.name}
                      onChange={handleChange}
                      style={styles.input}
                      required={true}
                    />
                    {errors?.senderName && (
                      <p style={styles.error}>{errors.senderName}</p>
                    )}
                  </div>
                  <PhoneInputField
                    value={formData.senderDetails?.contactNo}
                    onChange={(value) =>
                      handleChange({
                        target: {
                          name: "senderDetails.contactNo",
                          value: value,
                        },
                      })
                    }
                    label="Phone No."
                    placeholder="Enter Phone number"
                    defaultCountry="IN"
                  />
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
                      name="senderDetails.email"
                      title="Email"
                      value={formData?.senderDetails?.email}
                      onChange={handleChange}
                      style={styles.input}
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
                      name="senderDetails.street"
                      title="Street Address"
                      value={formData?.senderDetails?.street}
                      onChange={handleChange}
                      style={styles.input}
                    />
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
                      name="senderDetails.city"
                      title="City"
                      value={formData?.senderDetails?.city}
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
                      name="senderDetails.state"
                      title="State"
                      value={formData?.senderDetails?.state}
                      onChange={handleChange}
                      style={styles.input}
                    />
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
                      name="senderDetails.postCode"
                      title="Post Code"
                      value={formData?.senderDetails?.postCode}
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
                      name="senderDetails.country"
                      title="Country"
                      value={formData?.senderDetails?.country}
                      onChange={handleChange}
                      style={styles.input}
                    />
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
                        name="senderDetails.taxType"
                        title="Tax Type"
                        label={formData.senderDetails.taxType}
                        onSelect={handleChange}
                        style={styles.input}
                        options={taxTypeOptions}
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
                      name="senderDetails.taxNo"
                      value={formData.senderDetails.taxNo}
                      onChange={handleChange}
                      style={styles.input}
                      title={formData.senderDetails.taxType + " Number"}
                    />
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: "20px",
                    marginTop: "10px",
                  }}
                ></div>
              </div>

              <div
                className="bill-to-container w-3/6 p-4 rounded-lg"
                style={styles.section}
              >
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
                      name="clientDetails.name"
                      title="Client's Name"
                      value={formData.clientDetails.name}
                      onChange={handleChange}
                      style={styles.input}
                      required={true}
                    />
                    {errors?.clientName ? (
                      <p style={styles.error}>{errors.clientName}</p>
                    ) : (
                      errors["clientDetails.name"] && (
                        <p style={styles.error}>
                          {errors["clientDetails.name"]}
                        </p>
                      )
                    )}
                  </div>
                  <PhoneInputField
                    value={formData.clientDetails?.contactNo}
                    onChange={(value) =>
                      handleChange({
                        target: {
                          name: "clientDetails.contactNo",
                          value: value,
                        },
                      })
                    }
                    label="Phone No."
                    placeholder="Enter phone number"
                    defaultCountry="IN"
                  />
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
                      name="clientDetails.email"
                      title="Client's Email"
                      value={formData.clientDetails.email}
                      onChange={handleChange}
                      style={styles.input}
                    />
                    {errors?.clientEmail ? (
                      <p style={styles.error}>{errors.clientEmail}</p>
                    ) : (
                      errors["clientDetails.email"] && (
                        <p style={styles.error}>
                          {errors["clientDetails.email"]}
                        </p>
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
                      name="clientDetails.street"
                      value={formData?.clientDetails?.street}
                      onChange={handleChange}
                      title="Street Address"
                      style={styles.input}
                    />
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
                      name="clientDetails.city"
                      value={formData?.clientDetails?.city}
                      onChange={handleChange}
                      title="City"
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
                      name="clientDetails.state"
                      value={formData?.clientDetails?.state}
                      onChange={handleChange}
                      title="State"
                      style={styles.input}
                    />
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
                      name="clientDetails.postCode"
                      value={formData?.clientDetails?.postCode}
                      onChange={handleChange}
                      title={"Post Code"}
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
                      name="clientDetails.country"
                      value={formData?.clientDetails?.country}
                      onChange={handleChange}
                      title="Country"
                      style={styles.input}
                    />
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
                      name="clientDetails.taxType"
                      title="Tax Type"
                      label={formData.clientDetails.taxType}
                      onSelect={handleChange}
                      style={styles.input}
                      options={taxTypeOptions}
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
                      name="clientDetails.taxNo"
                      value={formData.clientDetails.taxNo}
                      onChange={handleChange}
                      style={styles.input}
                      title={formData.clientDetails.taxType + " Number"}
                    />
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: "20px",
                    marginTop: "10px",
                  }}
                ></div>
              </div>
            </div>
            <div style={styles.section}>
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
                    options={currencyOptions}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    marginTop: "10px",
                    width: "25%",
                    flexDirection: "column",
                  }}
                >
                  <CustomInput
                    type="text"
                    name="taxPercentage"
                    title="Tax Percentage"
                    value={formData.taxPercentage}
                    onChange={handleChange}
                    style={styles.input}
                  />
                </div>
              </div>
              <div>
                {formData.newFields &&
                  formData.newFields.map((field, index) => (
                    <div key={index} style={styles.itemContainer}>
                      <CustomInput
                        type="text"
                        name="fieldName"
                        title="Label"
                        containerStyle={{ width: "25%" }}
                        value={field.fieldName}
                        onChange={(e) => handleFieldChange(index, e)}
                        inputStyle={{
                          flex: "2 1 auto", // Larger space for Item Name
                        }}
                      />
                      <CustomInput
                        type="text"
                        name="fieldValue"
                        title="Value"
                        containerStyle={{ width: "25%" }}
                        value={field.fieldValue}
                        onChange={(e) => handleFieldChange(index, e)}
                        inputStyle={{
                          flex: "2 1 auto", // Larger space for Item Name
                        }}
                      />
                      <div
                        onClick={() => handleRemoveField(index)}
                        style={{
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          height: "100%",
                          flex: "0 1 auto",
                          paddingTop: "22px",
                        }}
                      >
                        <DeleteIcon />
                      </div>
                    </div>
                  ))}
                <div className="mt-4 flex align-items-center">
                  <CustomButton
                    type="gray"
                    onClick={(e) => {
                      e.preventDefault();
                      handleAddField();
                    }}
                    buttonStyle={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      float: "right",
                    }}
                  >
                    <PlusIcon f={"#dfe3fa"} /> Add Field
                  </CustomButton>
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
                        const currencySymbol = { currencySymbols };
                        const selectedCurrency = formData.currency;
                        const symbol = currencySymbol[selectedCurrency] || ""; // Default to empty if currency not found
                        return selectedCurrency
                          ? `${symbol} ${item.total || 0}`
                          : item.total || 0;
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
                        paddingTop: "18px",
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
            <InvoiceTemplates
              handleSelectTemplates={handleSelectTemplate}
              selectable={true}
            />
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
            <ToastContainer />
          </div>
        </div>
      </div>
    </Layout>
  );
};

const styles = {
  title: {
    padding: "25px 0px 20px",
  },
  titleText: {
    color: "#7C5DFA",
    fontSize: "15px",
    marginTop: "15px",
    marginBottom: "10px",
  },
  mainSection: {
    padding: "10px 0px",
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
  section: {
    marginBottom: "20px",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "4px",
    border: "5px solid #ccc",
  },
  itemContainer: {
    display: "flex",
    alignItems: "center",
    marginBottom: "10px",
    gap: "20px",
    flex: "2 1 1 1",
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
  error: {
    color: "red",
    margin: "5px 0",
  },
};

export default InvoiceForm;
