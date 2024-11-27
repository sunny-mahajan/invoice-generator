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
    formData?.items?.forEach((item) => {
      if (!item.quantity || !item.price) return;
      subTotal += item.price * item.quantity;
      total += +item.total;
    });
    taxAmount = total - subTotal;
    taxPercentages = (taxAmount / subTotal) * 100;
    setTotal(total.toFixed(1));
    setSubTotal(subTotal.toFixed(1));
    setTaxAmount(taxAmount.toFixed(1));
    setTaxPercentage(taxPercentages.toFixed(1));
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
              <div className={`block w-full gap-4`}>
                <div className="flex gap-5">
                  <CustomInput
                    type="text"
                    name="name"
                    title="Item Name"
                    placeholder="Website Design"
                    // containerStyle={{ width: "50%" }}
                    containerClass={"w-full"}
                    value={item.name}
                    onChange={(e) => handleItemChange(index, e)}
                    inputStyle={{
                      flex: "2 1 auto",
                      borderColor: errorsData[index]?.name ? "red" : "",
                    }}
                    required={true}
                    itemErrorsData={errorsData}
                  />
                  {errorsData[index]?.name && (
                    <p className="input-error text-red-600">
                      {errorsData[index]?.name}
                    </p>
                  )}
                  <CustomInput
                    type="text"
                    name="description"
                    title="Item Description"
                    placeholder="Design and development"
                    // containerStyle={{ width: "50%" }}
                    containerClass={"w-full"}
                    value={item.description}
                    onChange={(e) => handleItemChange(index, e)}
                    inputStyle={{ flex: "2 1 auto" }}
                  />
                </div>
              </div>
              <div className={`d-flex w-full gap-4`}>
                <div className="flex gap-5 flex-1">
                  <div className="w-full">
                    <CustomInput
                      type="number"
                      name="quantity"
                      title="Qty/Hrs."
                      placeholder="1"
                      value={item.quantity}
                      // containerClass="max-w-[200px]"
                      onChange={(e) => handleItemChange(index, e)}
                      inputStyle={{
                        flex: "0.3 1 auto",
                        borderColor: errorsData[index]?.quantity ? "red" : "",
                        minWidth: "50px",
                      }}
                      required={true}
                      itemErrorsData={errorsData}
                    />
                    {errorsData[index]?.quantity && (
                      <p className="input-error text-red-600">
                        {errorsData[index]?.quantity}
                      </p>
                    )}
                  </div>
                  <div className="w-full">
                    <CustomInput
                      type="number"
                      name="price"
                      placeholder="200"
                      title="Price"
                      // containerClass="max-w-[200px]"
                      value={item.price}
                      onChange={(e) => handleItemChange(index, e)}
                      inputStyle={{
                        flex: "1 1 auto",
                        borderColor: errorsData[index]?.price ? "red" : "",
                        minWidth: "60px",
                      }}
                      required={true}
                      itemErrorsData={errorsData}
                    />
                    {errorsData[index]?.price && (
                      <p className="input-error text-red-600">
                        {errorsData[index]?.price}
                      </p>
                    )}
                  </div>
                  {formData.senderDetails.taxType &&
                    formData.senderDetails.taxType !== "None" && (
                      <CustomInput
                        type="number"
                        name="taxPercentage"
                        placeholder="18"
                        title="GST Rate"
                        value={item.price}
                        onChange={(e) => handleItemChange(index, e)}
                        inputStyle={{ flex: "1 1 auto", minWidth: "65px" }}
                      />
                    )}
                </div>
                <div className="flex items-center">
                  {formData.senderDetails.taxType &&
                    formData.senderDetails.taxType !== "None" && (
                      <>
                        <CustomInput
                          title={"Amount"}
                          containerStyle={{
                            minWidth: "110px",
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
                            minWidth: "110px",
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
                      minWidth: "110px",
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
                        // paddingTop: "10px",
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
        <CustomButton
          type="gray"
          onClick={(e) => {
            e.preventDefault();
            handleAddItem();
          }}
          buttonStyle={{
            width: "50%",
            display: "flex",
            alignItems: "center",
            gap: "5px",
            float: "right",
            marginTop: "20px",
            filter: "brightness(1.3)",
          }}
          containerClass="add-new-item-btn add-new-btn-cls"
        >
          <PlusIcon f={"rgb(124, 93, 250)"} /> Add New Item
        </CustomButton>
      </div>
      {formData.items[0].price && formData.items[0].quantity && (
        <div className="w-full flex justify-end">
          <div className="d-flex flex-col gap-2 w-[35%]">
            {formData.senderDetails.taxType &&
              formData.senderDetails.taxType !== "None" && (
                <>
                  <div className="flex justify-end gap-20">
                    <span>SubTotal:</span>
                    <span>₹{subTotal}</span>
                  </div>
                  {formData.senderDetails.taxType === "IGST" ? (
                    <div className="flex justify-end gap-20">
                      <span>IGST ({taxPercentage}%)</span>
                      <span>₹{taxAmount}</span>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-end gap-20">
                        <span>CGST ({taxPercentage / 2}%)</span>
                        <span>₹{taxAmount / 2}</span>
                      </div>
                      <div className="flex justify-end gap-20">
                        <span>SGST ({taxPercentage / 2}%)</span>
                        <span>₹{taxAmount / 2}</span>
                      </div>
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
