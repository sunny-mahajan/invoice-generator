import Layout from "../components/Layout";
import React, { useRef, useState, useEffect } from "react";
import CustomButton from "../components/Button";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./style.css";
import { generateHTMLPDF } from "../utils/generateHTMLPDF";
import Script from "next/script";
import {
  addDays,
  formatDateToISO,
  mapBankDetails,
  mapReceiverDetails,
  mapSenderDetails,
  fileToBase64,
} from "../utils/helpers";
import InvoiceTemplates from "../components/InvoiceTemplates";
import useClickOutside from "../hooks/useClickOutside";
import {
  taxTypeOptions,
  currencySymbols,
  previewInvoiceData,
} from "../utils/constants";
import { useForm } from "react-hook-form";
import BillFromForm from "../components/InvoiceForms/billFrom";
import BillToForm from "../components/InvoiceForms/billTo";
import InvoiceDetailsForm from "../components/InvoiceForms/invoiceDetails";
import ItemDetails from "../components/InvoiceForms/items";
import InvoicePreview from "../components/InvoicePreview";
import { useUser } from "../app/context/userContext";
import AdBanner from "../components/AdBanner";

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
    panNo: "",
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
    panNo: "",
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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { userData } = useUser();

  const [isItemDataUpdated, setIsItemDataUpdated] = useState({
    name: false,
    quantity: false,
    price: false,
  });
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
  const datePickerInputRef = useRef(null);
  const dueDatePickerInputRef = useRef(null);
  const formValues = watch();

  useClickOutside([datePickerInputRef], () => setIsDatePickerOpen(false));

  useClickOutside([dueDatePickerInputRef], () => setIsDueDatePickerOpen(false));
  useEffect(() => {
    if (formData.createdAt && dueDateAfter >= 0 && isDueDateOpen) {
      setFormData((prev) => ({
        ...prev,
        dueDate: formatDateToISO(addDays(formData.createdAt, dueDateAfter)),
      }));
    }
  }, [formData.createdAt, isDueDateOpen]);

  useEffect(() => {
    validateForm();
  }, [formData.items, isItemDataUpdated]);

  useEffect(() => {
    mergeData(formData, formValues);
  }, [formValues]); // Dependency on formValues to re-trigger on change

  useEffect(() => {
    if (formData.senderDetails.taxType === "None") {
      setFormData((prev) => ({
        ...prev,
        items: prev.items.map((item) => ({
          ...item,
          taxPercentage: 0,
          taxAmount: 0,
          amount: item.quantity * item.price,
          total: item.quantity * item.price,
        })),
      }));
    }
  }, [formData.senderDetails.taxType]);
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
        let total = (quantity * price).toFixed(1);
        let taxAmount = 0;
        let subTotal = (quantity * price).toFixed(1);
        // If taxPercentage is greater than 0, add the tax to the total
        if (taxPercentage > 0) {
          taxAmount = (quantity * price * (taxPercentage / 100)).toFixed(1);
          total = (parseFloat(total) + parseFloat(taxAmount)).toFixed(1);
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
    setIsItemDataUpdated((prevState) => ({
      ...prevState,
      [e.target.name]: true,
    }));
  };

  const validateItem = (item) => {
    return item.name.trim() !== "" && item.quantity > 0 && item.price > 0;
  };

  const handleAddItem = () => {
    setFormData((prev) => {
      const lastItem = prev.items[prev.items.length - 1];

      // Only add a new item if the last item is valid
      if (!lastItem || validateItem(lastItem)) {
        setIsItemDataUpdated({ name: false, quantity: false, price: false });
        return {
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
        };
      } else {
        setIsItemDataUpdated({ name: true, quantity: true, price: true });
        return prev;
      }
    });
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
      } else {
        // If the value is empty, delete the key
        formData[key] = "";
      }
    }
    return formData;
  };

  const validateForm = (isItemData = false) => {
    const newErrors = {};
    formData.items.forEach((item, index) => {
      newErrors[index] = {}; // Create an object for each item to store errors individually

      if (!item.name && (isItemData || isItemDataUpdated?.name)) {
        newErrors[index].name = "Item name is required";
      }
      if (!item.quantity && (isItemData || isItemDataUpdated?.quantity)) {
        newErrors[index].quantity = "Quantity is required";
      }
      if (!item.price && (isItemData || isItemDataUpdated?.price)) {
        newErrors[index].price = "Price is required";
      }
    });
    setErrorsData(newErrors); // Set errors data with structured errors for each item
    return !Object.values(newErrors).some(
      (error) => Object.keys(error).length > 0
    ); // Return true if no errors
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const data = getValues();
    const isValid = await trigger();
    setIsItemDataUpdated({ name: true, quantity: true, price: true });
    validateForm();
    if (!isValid || !validateForm(true)) {
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
      const pdfBlob = await generateHTMLPDF(mappedData, userData);
      if (pdfBlob) {
        const blobURL = URL.createObjectURL(pdfBlob);
        // window.open(blobURL, "_blank");
        const link = document.createElement("a");
        link.href = blobURL;
        link.download = "invoice.pdf";
        link.click();
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
      <div className="content">
        {/* <AdBanner
          data-ad-slot="8786526439"
          data-ad-format="auto"
          data-full-width-responsive="true"
        /> */}
        <div className="flex gap-5">
          <div className="w-full">
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
                datePickerInputRef={datePickerInputRef}
                dueDatePickerInputRef={dueDatePickerInputRef}
                isDatePickerOpen={isDatePickerOpen}
                setIsDatePickerOpen={setIsDatePickerOpen}
                isDueDatePickerOpen={isDueDatePickerOpen}
                setIsDueDatePickerOpen={setIsDueDatePickerOpen}
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
                <ItemDetails
                  formData={formData}
                  handleItemChange={handleItemChange}
                  handleRemoveItem={handleRemoveItem}
                  handleAddItem={handleAddItem}
                  currencySymbols={currencySymbols}
                  validateForm={validateForm}
                  errorsData={errorsData}
                />
              </div>
            </div>
            <div className="flex justify-center md:justify-between rounded-r-lg w-full py-5">
              <CustomButton
                type="purple"
                onClick={onSubmit}
                buttonStyle={{ minWidth: "200px" }}
                isLoading={loading}
                disabled={downloadInvoiceIsDisabled}
              >
                Generate Invoice
              </CustomButton>
              <ToastContainer />
            </div>
          </div>
          <div className="preview-container-cls w-full">
            <InvoicePreview
              formData={formData}
              data={getValues()}
              selectedTemplateId={selectedTemplateId}
              isDialogOpen={isDialogOpen}
            />
          </div>
        </div>
        <div>
          <InvoiceTemplates
            handleSelectTemplates={handleSelectTemplate}
            selectable={true}
            invoiceData={previewInvoiceData}
            isDialogOpen={isDialogOpen}
            setIsDialogOpen={setIsDialogOpen}
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
