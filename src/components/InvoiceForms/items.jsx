import React, { useEffect, useState } from "react";
import CustomInput from "../Input/index";
import CustomButton from "../Button/index";
import { PlusIcon, DeleteIcon } from "../../utils/icons";

const ItemDetails = ({
  formData,
  handleItemChange,
  handleRemoveItem,
  handleAddItem,
  currencySymbols,
  validateForm = { validateForm },
  errorsData = { errorsData },
}) => {
  const [subTotal, setSubTotal] = useState(0);
  const [total, setTotal] = useState(0);
  const [taxAmount, setTaxAmount] = useState(0);
  const [taxPercentage, setTaxPercentage] = useState(0);
  useEffect(() => {
    handleCalculateTotal();
  }, [formData]);

  const handleCalculateTotal = () => {
    let subTotal = 0;
    let total = 0;
    let taxAmount = 0;
    let taxPercentages = 0;
    formData.items.forEach((item) => {
      if (!item.quantity || !item.price) return;
      subTotal += item.price * item.quantity;
      total += +item.total;
    });

    taxAmount = total - subTotal;
    taxPercentages = (taxAmount / subTotal) * 100;
    setTotal(total.toFixed(2));
    setSubTotal(subTotal.toFixed(2));
    setTaxAmount(taxAmount.toFixed(2));
    setTaxPercentage(taxPercentages.toFixed(2));
  };

  return (
    <div className="item-details-section flex flex-col gap-6">
      <div>
        <h3 style={styles.titleText}>Item List</h3>
        {formData.items &&
          formData.items.map((item, index) => (
            <div
              key={index}
              style={styles.itemContainer}
              className="items-details-section"
            >
              <div className="block md:flex w-full lg:w-[41%] gap-4">
                <CustomInput
                  type="text"
                  name="name"
                  title="Item Name"
                  placeholder="Enter item name"
                  // containerStyle={{ width: "50%" }}
                  containerClass={"w-full md:w-1/2"}
                  value={item.name}
                  onChange={(e) => handleItemChange(index, e)}
                  inputStyle={{ flex: "2 1 auto" }}
                  required={true}
                />
                <CustomInput
                  type="text"
                  name="description"
                  title="Item Description"
                  placeholder="Enter item description"
                  // containerStyle={{ width: "50%" }}
                  containerClass={"w-full md:w-1/2"}
                  value={item.description}
                  onChange={(e) => handleItemChange(index, e)}
                  inputStyle={{ flex: "2 1 auto" }}
                  required={true}
                />
              </div>
              <div className="d-flex w-full lg:w-[69%] gap-4 ">
                <div className="block md:flex gap-5 w-[50%] md:w-full">
                  <CustomInput
                    type="number"
                    name="quantity"
                    title="Qty/Hrs."
                    placeholder="Enter qty"
                    value={item.quantity}
                    containerClass="max-w-[200px]"
                    onChange={(e) => handleItemChange(index, e)}
                    inputStyle={{ flex: "0.3 1 auto" }}
                    required={true}
                  />
                  <CustomInput
                    type="number"
                    name="price"
                    placeholder="Enter price"
                    title="Price"
                    containerClass="max-w-[200px]"
                    value={item.price}
                    onChange={(e) => handleItemChange(index, e)}
                    inputStyle={{ flex: "1 1 auto" }}
                    required={true}
                  />
                  {formData.senderDetails.taxType && (
                    <CustomInput
                      type="number"
                      name="taxPercentage"
                      placeholder="Tax %"
                      title="GST Rate"
                      value={item.price}
                      onChange={(e) => handleItemChange(index, e)}
                      inputStyle={{ flex: "1 1 auto" }}
                    />
                  )}
                </div>
                <div className="flex items-center ">
                  {formData.senderDetails.taxType && (
                    <>
                      <CustomInput
                        title={"Amount"}
                        containerStyle={{
                          minWidth: "100px",
                          alignItems: "center",
                        }}
                        containerClass={"items-center"}
                        isText={true}
                        value={`${
                          formData.currency
                            ? `${currencySymbols[formData.currency] || ""} `
                            : ""
                        }${item.amount || 0}`}
                        inputStyle={{ flex: "1 1 auto" }}
                      />
                      <CustomInput
                        title={"Tax Amount"}
                        containerStyle={{
                          minWidth: "100px",
                          alignItems: "center",
                        }}
                        containerClass={"items-center"}
                        isText={true}
                        value={`${
                          formData.currency
                            ? `${currencySymbols[formData.currency] || ""} `
                            : ""
                        }${item.taxAmount || 0}`}
                        inputStyle={{ flex: "1 1 auto" }}
                      />
                    </>
                  )}

                  <CustomInput
                    title={"Total"}
                    containerStyle={{
                      minWidth: "100px",
                      alignItems: "center",
                    }}
                    containerClass={"items-center"}
                    isText={true}
                    value={`${
                      formData.currency
                        ? `${currencySymbols[formData.currency] || ""} `
                        : ""
                    }${item.total || 0}`}
                    // value={item.total || 0}
                    inputStyle={{ flex: "1 1 auto" }}
                  />
                  {formData.items.length > 1 && (
                    <div
                      onClick={() => handleRemoveItem(index)}
                      style={{
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "100%",
                        flex: "0 1 auto",
                        paddingTop: "10px",
                        // width: "20%",
                      }}
                    >
                      <DeleteIcon />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

        {errorsData.items && (
          <p className="input-error text-red-600">{errorsData.items}</p>
        )}
        <CustomButton
          type="gray"
          onClick={(e) => {
            e.preventDefault();
            if (validateForm()) {
              handleAddItem();
            }
          }}
          buttonStyle={{
            width: "25%",
            display: "flex",
            alignItems: "center",
            gap: "5px",
            float: "right",
            marginTop: "20px",
          }}
          containerClass="add-new-item-btn"
        >
          <PlusIcon f={"rgb(124, 93, 250)"} /> Add New Item
        </CustomButton>
      </div>
      {formData.items[0].price && formData.items[0].quantity && (
        <div className="w-full flex justify-end">
          <div className="d-flex flex-col gap-2 w-[35%]">
            {formData.senderDetails.taxType && (
              <>
                <div className="flex justify-end gap-20">
                  <span>SubTotal:</span>
                  <span>₹{subTotal}</span>
                </div>
                {formData.senderDetails.taxType === "IGST" ? (
                  <div className="flex justify-end gap-20">
                    <span>IGST {taxPercentage}%</span>
                    <span>₹{taxAmount}</span>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-end gap-20">
                      <span>CGST & SGST {taxPercentage}%</span>
                      <span>₹{taxAmount}</span>
                    </div>
                    {/* <div className="flex justify-end gap-20">
                  <span>SGST</span>
                  <span>20222</span>
                </div> */}
                  </>
                )}
              </>
            )}
            <div className="flex justify-end gap-20 py-2 border-t-2 border-b-2 text-2xl font-semibold">
              <span>Total:</span>
              <span>₹{total}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemDetails;

// Example styles object
const styles = {
  titleText: {
    color: "#7C5DFA",
    fontSize: "16px",
    marginTop: "15px",
    marginBottom: "10px",
  },
  itemContainer: {
    display: "flex",
    // alignItems: "center",
    gap: "20px",
    flex: "2 1 1 1",
  },
};
