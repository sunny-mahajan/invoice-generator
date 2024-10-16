import Layout from "../components/Layout";
import React, { useRef, useState, useEffect } from "react";
import CustomButton from "../components/Button";
import CustomInput from "../components/Input";
import FormCustomDropdown from "../components/FormDropdown";
import {
  DeleteIcon,
  PlusIcon,
  DownArrowIcon,
  UpArrowIcon,
} from "../utils/icons";
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
import { useForm } from "react-hook-form";

let formDataInitialValues = {
  invoiceNo: "",
  createdAt: formatDateToISO(new Date()),
  dueDate: "",
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
  const [errorsData, setErrorsData] = useState({});
  const [isDueDateOpen, setIsDueDateOpen] = useState(false);
  const [isAccordianOpen, setisAccordianOpen] = useState({});
  const [dueDateAfter, setDueDateAfter] = useState(15);

  const {
    register,
    handleDataSubmit,
    formState: { errors },
    trigger,
    getValues,
  } = useForm({
    mode: "onChange", // Triggers validation on change
    reValidateMode: "onChange", // Revalidates fields on change if they were invalid
  });

  const customDatePickerRef = useRef(null);
  const datePickerInputRef = useRef(null);

  const dueDatePickerInputRef = useRef(null);
  const dueCustomDatePickerRef = useRef(null);

  useClickOutside([customDatePickerRef, datePickerInputRef], () =>
    setIsDatePickerOpen(false)
  );

  // useClickOutside([dueCustomDatePickerRef, dueDatePickerInputRef], () =>
  //   setIsDueDatePickerOpen(false)
  // );

  useEffect(() => {
    if (formData.createdAt && dueDateAfter >= 0) {
      setFormData((prev) => ({
        ...prev,
        dueDate: formatDateToISO(addDays(formData.createdAt, dueDateAfter)),
      }));
    }
  }, [formData.createdAt, isDueDateOpen]);

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
    console.log("e", e);
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
        if (name === "dueDate") {
          const createdAtDate = new Date(formData.createdAt);
          const dueDateValue = new Date(value);
          const timeDifferenceInMs =
            dueDateValue.getTime() - createdAtDate.getTime();

          // Convert milliseconds to days, hours, minutes
          const differenceInDays = timeDifferenceInMs / (1000 * 60 * 60 * 24); // Days
          setDueDateAfter(differenceInDays);
        }
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
    // if (Object.keys(errors).length !== 0) {
    //   validateForm();
    // }
    console.log(formData, "formData");

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
    console.log(formData, "formData");
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
    // validateField(formData.invoiceNo, "invoiceNo", "Required field", newErrors);

    // Items Validation
    if (
      formData.items.some(
        (item) =>
          !item.name || !item.description || !item.quantity || !item.price
      )
    ) {
      newErrors.items = "Required fields";
    }
    console.log(newErrors, "newErrors");
    setErrorsData(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e, saveAsDraft) => {
    const data = getValues();

    console.log(formData, "formData---------", data);
    e.preventDefault(); // Prevent default form submission behavior

    // Trigger form validation
    const isValid = await trigger(); // This will validate the entire form

    // If the form is not valid, show an error message and return
    if (!isValid && !saveAsDraft && !validateForm()) {
      toast.error("Please fill all required fields before submitting");
      return;
    }

    setLoading(true); // Set loading state to true while processing the form

    // Map form data into the required format
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
      // Generate the PDF from the form data
      const pdfBlob = await generateHTMLPDF(mappedData);

      if (pdfBlob) {
        // Create a temporary URL for the generated PDF
        const blobURL = URL.createObjectURL(pdfBlob);

        // Open the generated PDF in a new tab
        window.open(blobURL, "_blank");

        // Clean up the blob URL after a short delay to free up memory
        setTimeout(() => URL.revokeObjectURL(blobURL), 100);
      }

      // You can also uncomment this to handle the server-side submission of the form
      // const response = await submitInvoice(mappedData, saveAsDraft);
      // handleResponse(response);
    } catch (error) {
      // Display an error message if PDF generation fails
      toast.error("Error generating invoice PDF: " + error.message);
    } finally {
      setLoading(false); // Set loading state to false after processing
      // Optional: trigger any post-submit actions like fetching updated data
    }
  };

  const handleDueDate = () => {
    setIsDueDateOpen(true);
  };

  const handleRemoveDueDate = () => {
    setFormData((prev) => ({
      ...prev,
      dueDate: "",
    }));
    setIsDueDateOpen(false);
  };

  const toggleAccordion = (id) => {
    setisAccordianOpen((prev) => ({
      ...prev,
      [id]: !prev[id], // Toggle the specific accordion's open state
    }));
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
                flexDirection: "column",
                gap: "20px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  width: "45%",
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
                  containerClass="input-container-cls"
                  required={true}
                  errors={errors} // pass errors object
                  register={register} // pass register function
                  validationRules={{ required: "Invoice No. is required" }}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  width: "45%",
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
                  containerClass="input-container-cls"
                  required={true}
                />
              </div>
              {!isDueDateOpen ? (
                <div className=" flex align-items-center">
                  <CustomButton
                    type="gray"
                    onClick={(e) => {
                      e.preventDefault();
                      handleDueDate();
                    }}
                    buttonStyle={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      float: "right",
                    }}
                  >
                    <PlusIcon f={"#dfe3fa"} /> Add Due Date
                  </CustomButton>
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    width: "48%",
                    gap: "20px",
                    alignItems: "center",
                  }}
                  onClick={() => handleDatePickerInputClick(true)}
                >
                  <CustomDatePicker
                    name="dueDate"
                    title="Invoice Due Date"
                    value={formData.dueDate}
                    onChange={handleChange}
                    isDatePickerOpen={isDueDatePickerOpen}
                    containerClass="input-container-cls"
                    invoiceCreatedDate={formData.createdAt}
                    isDueDate={true}
                  />
                  <div
                    onClick={() => handleRemoveDueDate()}
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
              )}

              <div>
                {formData.newFields &&
                  formData.newFields.map((field, index) => (
                    <div
                      key={index}
                      style={styles.itemContainer}
                      className="w-[48%]"
                    >
                      <CustomInput
                        type="text"
                        name="fieldName"
                        placeholder="Field Name"
                        containerClass="due-date-input-container-cls"
                        containerStyle={{ width: "80%", marginBottom: "0" }}
                        value={field.fieldName}
                        onChange={(e) => handleFieldChange(index, e)}
                      />
                      <CustomInput
                        type="text"
                        name="fieldValue"
                        placeholder="Value"
                        containerClass="due-date-input-container-cls"
                        value={field.fieldValue}
                        onChange={(e) => handleFieldChange(index, e)}
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
                        }}
                      >
                        <DeleteIcon />
                      </div>
                    </div>
                  ))}
                <div className="mb-4 flex align-items-center">
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
                    <PlusIcon f={"#dfe3fa"} /> Add More Field
                  </CustomButton>
                </div>
              </div>
            </div>
            <div className="parties-details-container flex justify-between gap-12">
              <div style={styles.section} className="w-3/6">
                <div className="bill-from-container p-4 rounded-lg">
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
                        errors={errors} // pass errors object
                        register={register} // pass register function
                        validationRules={{
                          required: "Name is required",
                        }}
                      />
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

                        width: "48%",
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
                        errors={errors} // pass errors object
                        register={register} // pass register function
                        validationRules={{
                          pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: "Invalid email format",
                          },
                        }}
                      />
                    </div>
                  </div>

                  <div className="border-slate-200">
                    <button
                      onClick={() => toggleAccordion(1)}
                      className="w-full flex justify-between items-center py-5 text-slate-800"
                    >
                      <span class="text-[#dfe3fa]">Address (optional)</span>
                      {isAccordianOpen[1] ? <UpArrowIcon /> : <DownArrowIcon />}
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        isAccordianOpen[1] ? "max-h-screen" : "max-h-0"
                      }`}
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
                            name="senderDetails.street"
                            title="Street Address"
                            value={formData?.senderDetails?.street}
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
                            name="senderDetails.city"
                            title="City"
                            value={formData?.senderDetails?.city}
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
                            name="senderDetails.state"
                            title="State"
                            value={formData?.senderDetails?.state}
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
                            name="senderDetails.postCode"
                            title="Post Code"
                            value={formData?.senderDetails?.postCode}
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

                            width: "48%",
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
                    </div>
                  </div>

                  <div className="border-slate-200">
                    <button
                      onClick={() => toggleAccordion(2)}
                      className="w-full flex justify-between items-center py-5 text-slate-800"
                    >
                      <span class="text-[#dfe3fa]">
                        Tax Information (optional)
                      </span>
                      {isAccordianOpen[2] ? <UpArrowIcon /> : <DownArrowIcon />}
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        isAccordianOpen[2] ? "max-h-screen" : "max-h-0"
                      }`}
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
                    </div>
                  </div>
                </div>
              </div>

              <div style={styles.section} className=" w-3/6 ">
                <div className="bill-to-container p-4 rounded-lg">
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
                        errors={errors} // pass errors object
                        register={register} // pass register function
                        validationRules={{
                          required: "Client name is required",
                        }}
                      />
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

                        width: "48%",
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
                        errors={errors} // pass errors object
                        register={register} // pass register function
                        validationRules={{
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Invalid email address",
                          },
                        }}
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
                          name="clientDetails.street"
                          value={formData?.clientDetails?.street}
                          onChange={handleChange}
                          title="Street Address"
                          style={styles.input}
                        />
                      </div> */}
                  </div>
                  {/* <div
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
                    </div> */}

                  <div className="border-slate-200">
                    <button
                      onClick={() => toggleAccordion(3)}
                      className="w-full flex justify-between items-center py-5 text-slate-800"
                    >
                      <span class="text-[#dfe3fa]">Address (optional)</span>
                      {isAccordianOpen[3] ? <UpArrowIcon /> : <DownArrowIcon />}
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        isAccordianOpen[3] ? "max-h-screen" : "max-h-0"
                      }`}
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
                            name="clientDetails.street"
                            value={formData?.clientDetails?.street}
                            onChange={handleChange}
                            title="Street Address"
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
                            name="clientDetails.city"
                            value={formData?.clientDetails?.city}
                            onChange={handleChange}
                            title="City"
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
                            name="clientDetails.state"
                            value={formData?.clientDetails?.state}
                            onChange={handleChange}
                            title="State"
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
                            name="clientDetails.postCode"
                            value={formData?.clientDetails?.postCode}
                            onChange={handleChange}
                            title={"Post Code"}
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

                            width: "48%",
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
                    </div>
                  </div>

                  <div className="border-slate-200">
                    <button
                      onClick={() => toggleAccordion(4)}
                      className="w-full flex justify-between items-center py-5 text-slate-800"
                    >
                      <span class="text-[#dfe3fa]">
                        Tax Information (optional)
                      </span>
                      {isAccordianOpen[4] ? <UpArrowIcon /> : <DownArrowIcon />}
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        isAccordianOpen[4] ? "max-h-screen" : "max-h-0"
                      }`}
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
                    </div>
                  </div>
                </div>
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
                      errors={errors} // pass errors object
                      register={register} // pass register function
                      validationRules={{
                        required: "Required Fields", // Always required
                        validate: (value) => {
                          // Check if any item in the items array is missing required fields

                          const hasMissingFields = formData.items.some(
                            (item) =>
                              !item.name ||
                              !item.description ||
                              !item.quantity ||
                              !item.price
                          );

                          console.log(
                            hasMissingFields,
                            "hasMissingFields",
                            formData.items
                          ); // This should log

                          // Return error if any fields are missing
                          return hasMissingFields ? "Required Fields" : true;
                        },
                      }}
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
              {/* {errorsData?.items && (
                <p style={styles.error}>{errorsData.items}</p>
              )}
              {(errorsData[`items[0].name`] ||
                errorsData[`items[0].price`] ||
                errorsData[`items[0].description`] ||
                errorsData[`items[0].quantity`]) && (
                <p style={styles.error}>Required fields</p>
              )} */}
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
                    errors={errors} // pass errors object
                    register={register} // pass register function
                    validationRules={{
                      required: formData.bankDetails.accountNumber
                        ? "Confirm account number is required"
                        : false, // If accountNumber exists, require confirmation
                      validate: (value) =>
                        formData.bankDetails.accountNumber
                          ? value === formData.bankDetails.accountNumber ||
                            "Confirm account number does not match account number"
                          : true, // If accountNumber exists, check for match
                    }}
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
    marginBottom: "20px",
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
