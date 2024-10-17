import React, { useState } from "react";
import CustomInput from "../../components/Input";
import PhoneInputField from "../Input/phoneInput";
import { DownArrowIcon } from "../../utils/icons";

const DialogBox = ({ isOpen, onClose, onConfirm, data }) => {
  const [errors, setErrors] = useState({});
  const [isAccordianOpen, setisAccordianOpen] = useState(false);

  const toggleAccordion = () => {
    setisAccordianOpen(!isAccordianOpen);
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      ></div>

      {/* Dialog Box */}
      <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl p-6 relative z-10">
        <div className="flex justify-between items-center mb-4">
          {/* Title */}
          <h3 className="text-xl font-semibold text-black">666</h3>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            &times;
          </button>
        </div>

        {/* Content */}
        <div className="mb-6">
          <div className="text-black" style={{ whiteSpace: "pre-line" }}>
            <div style={{ display: "flex", gap: "20px" }}>
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
                  value={data?.name}
                  onChange={handleChange}
                  required={true}
                />
                {errors?.senderName && (
                  <p style={styles.error}>{errors.senderName}</p>
                )}
              </div>
              <PhoneInputField
                value={data?.contactNo}
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
            <div style={{ display: "flex", gap: "20px", marginTop: "10px" }}>
              <div
                style={{
                  display: "flex",
                  width: "50%",
                  flexDirection: "column",
                }}
              >
                <CustomInput
                  type="text"
                  name="senderDetails.email"
                  title="Email"
                  value={data?.email}
                  onChange={handleChange}
                />
                {errors?.senderEmail && (
                  <p style={styles.error}>{errors.senderEmail}</p>
                )}
              </div>
            </div>
            <div className="border-b border-slate-200">
              <button
                onClick={toggleAccordion}
                className="w-full flex justify-between items-center pb-5 text-slate-800"
              >
                <span>Address</span>
                <DownArrowIcon />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  isAccordianOpen ? "max-h-screen" : "max-h-0"
                }`}
              >
                <div style={{ display: "flex", gap: "20px" }}>
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
                      value={formData.senderDetails?.name}
                      onChange={handleChange}
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
                      width: "50%",
                      flexDirection: "column",
                    }}
                  >
                    <CustomInput
                      type="text"
                      name="senderDetails.email"
                      title="Email"
                      value={formData.senderDetails?.email}
                      onChange={handleChange}
                    />
                    {errors?.senderEmail && (
                      <p style={styles.error}>{errors.senderEmail}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            zvv
          </button>

          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            ghg
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  error: {
    color: "red",
    margin: "5px 0",
  },
};

export default DialogBox;
