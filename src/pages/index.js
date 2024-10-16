import Layout from "../components/Layout";
import React, { useRef, useState, useEffect } from "react";
import CustomButton from "../components/Button";
import CustomInput from "../components/Input";
import FormCustomDropdown from "../components/FormDropdown";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./style.css";
import { generateHTMLPDF } from "../utils/generateHTMLPDF";
import { addDays, formatDateToISO, mapBankDetails, mapReceiverDetails, mapSenderDetails, validateField } from "../utils/helpers";
import InvoiceTemplates from "../components/InvoiceTemplates";
import useClickOutside from "../hooks/useClickOutside";
import { currencyOptions, allowedKeys, taxTypeOptions, currencySymbols } from "../utils/constants";
import { useForm } from "react-hook-form";
import BillFromForm from "../components/InvoiceForms/billFrom";
import BillToForm from "../components/InvoiceForms/billTo";
import InvoiceDetailsForm from "../components/InvoiceForms/invoiceDetails";
import ItemDetails from "../components/InvoiceForms/items";
import BankDetails from "../components/InvoiceForms/bankDetails";

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
    accountHolderName: "",
    bankAccountType: "",
  },
  taxPercentage: 0,
  total: 0,
  currency: "INR",
};

const InvoiceForm = () => {
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);
  const [downloadInvoiceIsDisabled, setDownloadInvoiceIsDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [formData, setFormData] = useState(formDataInitialValues);
  const [errorsData, setErrorsData] = useState({});
  const [isDueDatePickerOpen, setIsDueDatePickerOpen] = useState(false);
  const [isDueDateOpen, setIsDueDateOpen] = useState(false);
  const [dueDateAfter, setDueDateAfter] = useState(15);
  


  const { register, handleSubmit, formState: { errors }, trigger, getValues } = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const customDatePickerRef = useRef(null);
  const datePickerInputRef = useRef(null);

  useClickOutside([customDatePickerRef, datePickerInputRef], () => setIsDatePickerOpen(false));

  // useEffect(() => {
  //   if (formData.createdAt) {
  //     setFormData((prev) => ({
  //       ...prev,
  //       dueDate: formatDateToISO(addDays(formData.createdAt, 15)),
  //     }));
  //   }
  // }, [formData.createdAt]);

  useEffect(() => {
    if (formData.createdAt && dueDateAfter >= 0) {
      setFormData((prev) => ({
        ...prev,
        dueDate: formatDateToISO(addDays(formData.createdAt, dueDateAfter)),
      }));
    }
  }, [formData.createdAt, isDueDateOpen]);
  const handleRemoveField = (index) => {
    const newItems = formData.newFields.filter((_, i) => i !== index);
    setFormData((prev) => ({
      ...prev,
      newFields: newItems,
    }));
  };

  const handleChange = (e) => {
    console.log("e", e);

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
    console.log("test---")
    const { name, value } = e.target;
    setFormData((prev) => {
      const updatedItems = [...prev.items];
      updatedItems[index] = { ...updatedItems[index], [name]: value };
      const { quantity, price } = updatedItems[index];
      updatedItems[index].total = quantity && price ? (quantity * price).toFixed(2) : "0.00";
      return { ...prev, items: updatedItems };
    });
    validateForm();
  };

  const handleAddItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { name: "", description: "", quantity: "", price: "" }],
    }));
  };

  const handleRemoveItem = (index) => {
    if (formData.items.length > 1) {
      const newItems = formData.items.filter((_, i) => i !== index);
      setFormData((prev) => ({ ...prev, items: newItems }));
    }
  };

  const handleSelectTemplate = (templateId) => {
    setSelectedTemplateId(templateId);
    setDownloadInvoiceIsDisabled(false);
  };

  const handleDueDate = () => {
    setIsDueDateOpen(true);
  };

  const handleFieldChange = (index, e) => {
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

  const handleRemoveDueDate = () => {
    setFormData((prev) => ({
      ...prev,
      dueDate: "",
    }));
    setIsDueDateOpen(false);
  };

  const handleAddField = () => {
    setFormData((prev) => ({
      ...prev,
      newFields: [...prev.newFields, { fieldName: "", fieldValue: "" }],
    }));
  };

  const handleDatePickerInputClick = (isDueDate = false) => {
    if (isDueDate) {
      setIsDueDatePickerOpen((prevState) => !prevState);
      return;
    }
    setIsDatePickerOpen((prevState) => !prevState);
  };
  const mergeData = (formData, data) => {
    for (const key in data) {
        if (data[key] && typeof data[key] === 'object' && !Array.isArray(data[key])) {
            // If the key is an object, recurse
            formData[key] = mergeData(formData[key] || {}, data[key]);
        } else if (data[key] !== "") {
            // Only overwrite if the value is not empty
            formData[key] = data[key];
        }
    }
    return formData;
};
  

  const validateForm = () => {
    const newErrors = {};
    if (formData.items.some(item => !item.name || !item.description || !item.quantity || !item.price)) {
      newErrors.items = "Required fields";
    }
    setErrorsData(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const data = getValues();
    console.log(data, "data----", formData);
    const isValid = await trigger();
    if (!isValid || !validateForm()) {
      toast.error("Please fill all required fields before submitting");
      return;
    }
    mergeData(formData, data);

    console.log(formData, "gddgdgdfgdf")
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
        const blobURL = URL.createObjectURL(pdfBlob);
        window.open(blobURL, "_blank");
        setTimeout(() => URL.revokeObjectURL(blobURL), 100);
      }
    } catch (error) {
      toast.error("Error generating invoice PDF: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="content d-flex flex-direction-column">
        <div>
          <h2 style={styles.title}>New Invoice</h2>
          <div style={styles.mainSection}>
            <InvoiceDetailsForm 
              formData={formData}
              handleChange={handleChange}
              handleDueDate={handleDueDate}
              isDueDateOpen={isDueDateOpen}
              handleRemoveDueDate={handleRemoveDueDate}
              handleFieldChange={handleFieldChange}
              handleAddField={handleAddField}
              handleRemoveField={handleRemoveField}
              handleDatePickerInputClick={handleDatePickerInputClick}
              datePickerInputRef={datePickerInputRef}
              customDatePickerRef={customDatePickerRef}
              isDatePickerOpen={isDatePickerOpen}
              isDueDatePickerOpen={isDueDatePickerOpen}
              errors={errors}
              register={register}
            />
            <div className="parties-details-container flex justify-between gap-12">
              <BillFromForm 
                formData={formData}
                handleChange={handleChange}
                errors={errors}
                register={register}
                taxTypeOptions={taxTypeOptions}
              />
              <BillToForm 
                formData={formData}
                handleChange={handleChange}
                errors={errors}
                register={register}
                taxTypeOptions={taxTypeOptions}
              />
            </div>
            <div style={styles.section}>
            <div style={{ display: "flex", gap: "20px" }}>
              <div style={{ display: "flex", width: "25%", marginTop: "10px", flexDirection: "column" }}>
                <FormCustomDropdown
                  name="currency"
                  title="Currency"
                  label={formData.currency}
                  onSelect={handleChange}
                  style={styles.input}
                  options={currencyOptions}
                />
              </div>
              <div style={{ display: "flex", marginTop: "10px", width: "25%", flexDirection: "column" }}>
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
            <ItemDetails 
              formData={formData}
              handleItemChange={handleItemChange}
              handleRemoveItem={handleRemoveItem}
              handleAddItem={handleAddItem}
              currencySymbols={currencySymbols}
              validateForm={validateForm}
              errorsData={errorsData}

        //       formData={formData}
        // handleRemoveItem={handleRemoveItem}
        // handleAddItem={handleAddItem}
        // errors={errors}
        // register={register}
            />
            <BankDetails
              formData={formData}
              handleChange={handleChange}
              errors={errors}
              register={register}
            />
            </div>
          </div>
          <div>
            <InvoiceTemplates
              handleSelectTemplates={handleSelectTemplate}
              selectable={true}
            />
          </div>
          <div style={styles.buttons}>
            <CustomButton
              type="purple"
              onClick={onSubmit}
              buttonStyle={{ minWidth: "150px" }}
              isLoading={loading}
              disabled={downloadInvoiceIsDisabled}
            >
              Generate Invoice
            </CustomButton>
            <ToastContainer />
          </div>
        </div>
      </div>
    </Layout>
  );
};

const styles = {
  section: {
    marginBottom: "20px",
  },
  title: {
    padding: "25px 0px 20px",
  },
  mainSection: {
    padding: "10px 0px",
    height: "100%",
    overflow: "auto",
    backgroundColor: "#141625",
    scrollbarWidth: "thin",
    scrollbarColor: "#252945 transparent",
  },
  "mainSection::-webkit-scrollbar": {
    width: "8px",
  },
  "mainSection::-webkit-scrollbar-thumb": {
    backgroundColor: "#888",
    borderRadius: "10px",
  },
  "mainSection::-webkit-scrollbar-track": {
    backgroundColor: "transparent",
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
  },
};

export default InvoiceForm;



