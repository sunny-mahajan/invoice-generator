import Layout from "../components/Layout";
import React, { useRef, useState, useEffect } from "react";
import CustomButton from "../components/Button";
import CustomInput from "../components/Input";
import FormCustomDropdown from "../components/FormDropdown";
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
  validateField,
  fileToBase64,
} from "../utils/helpers";
import InvoiceTemplates from "../components/InvoiceTemplates";
import useClickOutside from "../hooks/useClickOutside";
import {
  currencyOptions,
  allowedKeys,
  taxTypeOptions,
  currencySymbols,
} from "../utils/constants";
import { useForm } from "react-hook-form";
import BillFromForm from "../components/InvoiceForms/billFrom";
import BillToForm from "../components/InvoiceForms/billTo";
import InvoiceDetailsForm from "../components/InvoiceForms/invoiceDetails";
import ItemDetails from "../components/InvoiceForms/items";
import BankDetails from "../components/InvoiceForms/bankDetails";
import { useSession } from "next-auth/react";
import InvoicePreview from "../components/InvoicePreview";

let formDataInitialValues = {
  invoiceNo: "",
  createdAt: formatDateToISO(new Date()),
  dueDate: "",
  status: "draft",
  logo: "",
  senderDetails: {
    name: "",
    contactNo: "",
    email: "",
    street: "",
    city: "",
    postCode: "",
    country: "",
    state: "",
    taxType: "",
    taxNo: "",
    customFields: [],
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
    taxType: "",
    taxNo: "",
    customFields: [],
  },
  items: [
    {
      name: "",
      description: "",
      quantity: "",
      taxPercentage: 0,
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
    bankAccountType: "Savings",
    bankAddress: "",
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
  const [formData, setFormData] = useState(formDataInitialValues);
  const [errorsData, setErrorsData] = useState({});
  const [isDueDatePickerOpen, setIsDueDatePickerOpen] = useState(false);
  const [isDueDateOpen, setIsDueDateOpen] = useState(false);
  const [dueDateAfter, setDueDateAfter] = useState(15);
  const { data: session } = useSession();
  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    getValues,
    watch,
  } = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const customDatePickerRef = useRef(null);
  const datePickerInputRef = useRef(null);
  const formValues = watch();
  useClickOutside([customDatePickerRef, datePickerInputRef], () =>
    setIsDatePickerOpen(false)
  );

  useEffect(() => {
    if (formData.createdAt && dueDateAfter >= 0 && isDueDateOpen) {
      setFormData((prev) => ({
        ...prev,
        dueDate: formatDateToISO(addDays(formData.createdAt, dueDateAfter)),
      }));
    }
  }, [formData.createdAt, isDueDateOpen]);

  useEffect(() => {
    if (
      formData.items[0].name ||
      formData.items[0].price ||
      formData.items[0].quantity ||
      formData.items[0].description
    ) {
      validateForm();
    }
  }, [formData.items]);

  const handleChange = (e) => {
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
    const { name, value } = e.target;
    setFormData((prev) => {
      const updatedItems = [...prev.items];
      updatedItems[index] = { ...updatedItems[index], [name]: value };
      const { quantity, price, taxPercentage } = updatedItems[index];
      if (quantity && price) {
        // Calculate total without tax
        let total = (quantity * price).toFixed(2);
        let taxAmount = 0;
        let subTotal = (quantity * price).toFixed(2);
        // If taxPercentage is greater than 0, add the tax to the total
        if (taxPercentage > 0) {
          taxAmount = (quantity * price * (taxPercentage / 100)).toFixed(2);
          total = (parseFloat(total) + parseFloat(taxAmount)).toFixed(2);
        }

        updatedItems[index].taxAmount = taxAmount;
        updatedItems[index].amount = subTotal;
        updatedItems[index].total = total;
      } else {
        updatedItems[index].total = "0.00";
        updatedItems[index].taxAmount = "0.00";
        updatedItems[index].amount = "0.00";
      }
      return { ...prev, items: updatedItems };
    });
  };

  const handleAddItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          name: "",
          description: "",
          quantity: "",
          taxPercentage: 0,
          price: "",
        },
      ],
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

  const handleRemoveDueDate = () => {
    setFormData((prev) => ({
      ...prev,
      dueDate: "",
    }));
    setIsDueDateOpen(false);
  };

  const handleFieldChange = (index, e, fieldType) => {
    const { name, value } = e.target; // Corrected destructuring

    setFormData((prev) => {
      if (fieldType === "billFrom") {
        const updatedFields = [...prev.senderDetails.customFields];
        updatedFields[index] = {
          ...updatedFields[index],
          [name]: value, // Use name from input to update the correct field
        };

        return {
          ...prev,
          senderDetails: {
            ...prev.senderDetails,
            customFields: updatedFields, // Corrected to update 'customFields'
          },
        };
      } else if (fieldType === "billTo") {
        const updatedFields = [...prev.clientDetails.customFields];
        updatedFields[index] = {
          ...updatedFields[index],
          [name]: value, // Use name from input to update the correct field
        };
        return {
          ...prev,
          clientDetails: {
            ...prev.clientDetails,
            customFields: updatedFields, // Corrected to update 'customFields'
          },
        };
      } else {
        const updatedFields = [...prev.newFields];
        updatedFields[index] = {
          ...updatedFields[index],
          [name]: value, // Use name from input to update the correct field
        };

        return {
          ...prev,
          newFields: updatedFields, // Corrected to update 'newFields'
        };
      }
    });
  };

  const handleAddField = (fieldType) => {
    if (fieldType === "billFrom") {
      setFormData((prev) => ({
        ...prev,
        senderDetails: {
          ...prev.senderDetails,
          customFields: [
            ...prev.senderDetails.customFields,
            { fieldName: "", fieldValue: "" },
          ],
        },
      }));
    } else if (fieldType === "billTo") {
      setFormData((prev) => ({
        ...prev,
        clientDetails: {
          ...prev.clientDetails,
          customFields: [
            ...prev.clientDetails.customFields,
            { fieldName: "", fieldValue: "" },
          ],
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        newFields: [...prev.newFields, { fieldName: "", fieldValue: "" }],
      }));
    }
  };

  const handleRemoveField = (index, fieldType) => {
    if (fieldType === "billFrom") {
      const newItems = formData.senderDetails.customFields.filter(
        (_, i) => i !== index
      );
      setFormData((prev) => ({
        ...prev,
        senderDetails: {
          ...prev.senderDetails,
          customFields: newItems,
        },
      }));
    } else if (fieldType === "billTo") {
      const newItems = formData.clientDetails.customFields.filter(
        (_, i) => i !== index
      );
      setFormData((prev) => ({
        ...prev,
        clientDetails: {
          ...prev.clientDetails,
          customFields: newItems,
        },
      }));
    } else {
      const newItems = formData.newFields.filter((_, i) => i !== index);
      setFormData((prev) => ({
        ...prev,
        newFields: newItems,
      }));
    }
  };

  const onFileSelect = (file) => {
    fileToBase64(file).then((base64) => {
      setFormData((prev) => ({
        ...prev,
        logo: base64,
      }));
    });
  };

  const onFileRemove = () => {
    setFormData((prev) => ({
      ...prev,
      logo: null,
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
      if (
        data[key] &&
        typeof data[key] === "object" &&
        !Array.isArray(data[key])
      ) {
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
    if (
      formData.items.some(
        (item) =>
          !item.name || !item.description || !item.quantity || !item.price
      )
    ) {
      newErrors.items = "Required fields";
    }
    setErrorsData(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const data = getValues();
    const isValid = await trigger();
    validateForm();
    if (!isValid || !validateForm()) {
      toast.error("Please fill all required fields before submitting");
      return;
    }
    mergeData(formData, data);

    setLoading(true);
    const mappedData = {
      "Invoice No.": formData.invoiceNo,
      "Template Id": selectedTemplateId,
      "Invoice Issue Date": formData.createdAt,
      "Invoice Due Date": formData.dueDate,
      Logo: formData.logo,
      ...mapSenderDetails(formData.senderDetails),
      ...mapReceiverDetails(formData.clientDetails),
      ...mapBankDetails(formData.bankDetails),
      newFields: formData.newFields,
      "Sender Custom Fields": formData.senderDetails.customFields,
      "Client Custom Fields": formData.clientDetails.customFields,
      Items: formData.items,
      Currency: formData.currency,
      "Tax Percentage": formData.taxPercentage,
    };
    try {
      const pdfBlob = await generateHTMLPDF(mappedData, session.user);
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
              onFileSelect={onFileSelect}
              onFileRemove={onFileRemove}
            />
            <div className="parties-details-container flex justify-between gap-12">
              <BillFromForm
                formData={formData}
                handleChange={handleChange}
                errors={errors}
                register={register}
                taxTypeOptions={taxTypeOptions}
                handleFieldChange={handleFieldChange}
                handleAddField={handleAddField}
                handleRemoveField={handleRemoveField}
              />
              <BillToForm
                formData={formData}
                handleChange={handleChange}
                errors={errors}
                register={register}
                taxTypeOptions={taxTypeOptions}
                handleFieldChange={handleFieldChange}
                handleAddField={handleAddField}
                handleRemoveField={handleRemoveField}
              />
            </div>
            <div className="items-details-container">
              {/* <div className="block md:flex gap-5">
                <div className="w-full lg:w-1/4 flex mt-2 flex-col">
                  <FormCustomDropdown
                    name="currency"
                    title="Currency"
                    label={formData.currency}
                    onSelect={handleChange}
                    style={styles.input}
                    options={currencyOptions}
                  />
                </div>
                <div className="flex w-full lg:w-1/4 mt-2 flex-col">
                  <CustomInput
                    type="number"
                    name="taxPercentage"
                    title="Tax Percentage"
                    placeholder="Enter tax percentage"
                    value={formData.taxPercentage}
                    onChange={handleChange}
                    style={styles.input}
                  />
                </div>
              </div> */}
              <ItemDetails
                formData={formData}
                handleItemChange={handleItemChange}
                handleRemoveItem={handleRemoveItem}
                handleAddItem={handleAddItem}
                currencySymbols={currencySymbols}
                validateForm={validateForm}
                errorsData={errorsData}
              />
              {/* <BankDetails
                formData={formData}
                handleChange={handleChange}
                errors={errors}
                register={register}
              /> */}
            </div>
          </div>
          <div>
            <InvoiceTemplates
              handleSelectTemplates={handleSelectTemplate}
              selectable={true}
            />
          </div>
          <div className="flex justify-center  md:justify-between  rounded-r-lg w-full p-5 px-10">
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
        <div>
          <InvoicePreview
            formData={formData}
            data={getValues()}
            selectedTemplateId={selectedTemplateId}
          />
        </div>
      </div>
    </Layout>
  );
};

const styles = {
  title: {
    padding: "25px 0px 20px",
    color: "var(--color)",
  },
  mainSection: {
    padding: "10px 0px",
    height: "100%",
    // overflow: "auto",
    scrollbarWidth: "thin",
    scrollbarColor: "var(--secondary-color) transparent",
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
};

export default InvoiceForm;
