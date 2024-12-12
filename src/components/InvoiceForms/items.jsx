import React, { useEffect, useState } from "react";
import CustomInput from "../Input/index";
import CustomButton from "../Button/index";
import { PlusIcon, DeleteIcon } from "../../utils/icons";
import { useUser } from "../../app/context/userContext";

const ItemDetails = ({
  formData,
  handleItemChange,
  handleRemoveItem,
  handleAddItem,
  currencySymbols,
  errorsData = { errorsData },
}) => {
  const [showDescription, setShowDescription] = useState(false);
  const { handleItemCalculatation, itemData } = useUser();

  useEffect(() => {
    calculateItems();
  }, [formData]);

  const calculateItems = () => {
    handleItemCalculatation(formData);
  };

  const handleSanitizedChange = (e, index, callback, regex) => {
    const sanitizedValue = e.target.value.replace(regex, "");
    e.target.value = sanitizedValue;
    callback(index, e);
  };

  const handleDescription = () => {
    setShowDescription(!showDescription);
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
              <div className="block w-full gap-4">
                <div className="flex gap-2 flex-wrap">
                  <div className="block md:flex gap-2 mb-2">
                    {/* Item Name Input */}
                    <CustomInput
                      type="text"
                      name="name"
                      title="Item Name"
                      placeholder="Website Design"
                      maxLength={50}
                      containerClass="min-w-[150px]"
                      value={item.name}
                      onChange={(e) => handleItemChange(index, e)}
                      inputStyle={{
                        borderColor: errorsData[index]?.name ? "red" : "",
                      }}
                      required
                      itemErrorsData={errorsData}
                    />

                    {/* Quantity Input */}
                    <CustomInput
                      type="text"
                      inputMode="numeric"
                      name="quantity"
                      title="Qty/Hrs."
                      placeholder="1"
                      maxLength={20}
                      containerClass="min-w-[70px]"
                      value={item.quantity}
                      onChange={(e) =>
                        handleSanitizedChange(
                          e,
                          index,
                          handleItemChange,
                          /[^0-9]/g
                        )
                      }
                      inputStyle={{
                        borderColor: errorsData[index]?.quantity ? "red" : "",
                      }}
                      required
                      itemErrorsData={errorsData}
                    />

                    {/* Price Input */}
                    <CustomInput
                      type="text"
                      name="price"
                      placeholder="200"
                      maxLength={20}
                      title="Price"
                      containerClass="min-w-[70px]"
                      value={item.price}
                      onChange={(e) =>
                        handleSanitizedChange(
                          e,
                          index,
                          handleItemChange,
                          /[^0-9.]/g
                        )
                      }
                      inputStyle={{
                        borderColor: errorsData[index]?.price ? "red" : "",
                      }}
                      required
                      itemErrorsData={errorsData}
                    />

                    {/* Discount Percentage Input */}
                    {formData.senderDetails.discount && (
                      <CustomInput
                        type="text"
                        inputMode="numeric"
                        name="discountPercentage"
                        placeholder="18"
                        title="Discount %"
                        value={item.discountPercentage}
                        containerClass="min-w-[80px]"
                        itemErrorsData={errorsData}
                        onChange={(e) =>
                          handleSanitizedChange(
                            e,
                            index,
                            handleItemChange,
                            /[^0-9.]/g
                          )
                        }
                      />
                    )}

                    {/* Tax Percentage Input */}
                    {formData.senderDetails.taxType &&
                      formData.senderDetails.taxType !== "None" && (
                        <CustomInput
                          type="text"
                          inputMode="numeric"
                          name="taxPercentage"
                          placeholder="18"
                          maxLength={10}
                          title="GST %"
                          containerClass="min-w-[60px]"
                          value={item.taxPercentage}
                          itemErrorsData={errorsData}
                          onChange={(e) =>
                            handleSanitizedChange(
                              e,
                              index,
                              handleItemChange,
                              /[^0-9.]/g
                            )
                          }
                        />
                      )}

                    {formData.senderDetails.taxType == "None" &&
                      !formData.senderDetails.discount && (
                        <div className="flex items-center">
                          <CustomInput
                            title="Total"
                            containerClass="items-center min-w-[100px]"
                            isText
                            itemErrorsData={errorsData}
                            value={`${currencySymbols}${item.total || 0}`}
                          />
                          {formData.items.length > 1 && (
                            <div
                              onClick={() => handleRemoveItem(index)}
                              className="flex items-center justify-center cursor-pointer mt-3"
                            >
                              <DeleteIcon />
                            </div>
                          )}
                        </div>
                      )}
                  </div>
                  <div className="items-amount-cls flex gap-2 w-full flex-wrap justify-between">
                    {/* Conditional Amounts */}
                    {(formData.senderDetails.taxType !== "None" ||
                      formData.senderDetails.discount) && (
                      <>
                        <CustomInput
                          title="Amount"
                          containerClass="items-center break-all min-w-[90px]"
                          isText
                          value={`${currencySymbols}${item.amount || 0}`}
                          itemErrorsData={errorsData}
                        />
                        {formData.senderDetails.discount && (
                          <>
                            <CustomInput
                              title="Discount"
                              containerClass="items-center break-all min-w-[90px]"
                              isText
                              value={`${currencySymbols}${
                                item.amountSaved || 0
                              }`}
                              itemErrorsData={errorsData}
                            />
                            {formData.senderDetails.taxType !== "None" &&
                              formData.senderDetails.discount && (
                                <CustomInput
                                  title="Net Price"
                                  containerClass="items-center break-all min-w-[90px]"
                                  isText
                                  value={`${currencySymbols}${
                                    item.afterDiscount || 0
                                  }`}
                                  itemErrorsData={errorsData}
                                />
                              )}
                          </>
                        )}
                        {formData.senderDetails.taxType !== "None" && (
                          <CustomInput
                            title="Tax Amount"
                            containerClass="items-center min-w-[80px] break-all min-w-[90px]"
                            isText
                            value={`${currencySymbols}${item.taxAmount || 0}`}
                            itemErrorsData={errorsData}
                          />
                        )}
                      </>
                    )}

                    {/* Total Amount */}
                    {(formData.senderDetails.taxType !== "None" ||
                      formData.senderDetails.discount) && (
                      <CustomInput
                        title="Total"
                        containerClass="items-center break-all min-w-[90px]"
                        isText
                        value={`${currencySymbols}${item.total || 0}`}
                        itemErrorsData={errorsData}
                      />
                    )}

                    {/* Remove Item */}
                    {(formData.senderDetails.taxType !== "None" ||
                      formData.senderDetails.discount) &&
                      formData.items.length > 1 && (
                        <div
                          onClick={() => handleRemoveItem(index)}
                          className="flex items-center justify-center cursor-pointer mt-3"
                          style={{ flex: "0 1 auto", height: "100%" }}
                        >
                          <DeleteIcon />
                        </div>
                      )}
                  </div>
                </div>
                <div className="flex w-full">
                  {!showDescription && (
                    <CustomButton
                      type="gray"
                      onClick={(e) => {
                        e.preventDefault();
                        handleDescription();
                      }}
                      buttonStyle={{
                        width: "50%",
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                        float: "left",
                        filter: "brightness(1.3)",
                        marginBottom: "20px",
                      }}
                      containerClass="add-new-item-btn add-new-btn-cls"
                    >
                      <PlusIcon f={"rgb(124, 93, 250)"} /> Add Description
                    </CustomButton>
                  )}
                  {showDescription && (
                    <div className="flex gap-5 w-full">
                      <CustomInput
                        type="text"
                        name="description"
                        title="Item Description"
                        placeholder="Design and development"
                        maxLength={50}
                        containerClass={"w-full"}
                        value={item.description}
                        onChange={(e) => handleItemChange(index, e)}
                        inputStyle={{ flex: "2 1 auto" }}
                      />
                      <div
                        onClick={() => handleDescription()}
                        className="flex items-center justify-center cursor-pointer mt-2"
                      >
                        <DeleteIcon />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        <div>
          {errorsData &&
            Object.values(errorsData).some(
              (item) => item.price || item.quantity || item.name
            ) && (
              <p className="text-red-500 mt-2">
                Please fill required fields for all items.
              </p>
            )}
        </div>
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
          <div className="d-flex flex-col gap-2 md:w-[60%] w-[80%]">
            {(formData.senderDetails.taxType &&
              formData.senderDetails.taxType !== "None") ||
            formData.senderDetails.discount > 0 ? (
              <>
                <div className="flex justify-between break-all">
                  <span className="min-w-[130px]">SubTotal:</span>
                  <span>₹{itemData.subTotal}</span>
                </div>
                {formData.senderDetails.discount > 0 && (
                  <div className="flex justify-between break-all">
                    <span className="min-w-[130px]">Discount:</span>
                    <span>₹{itemData.discount}</span>
                  </div>
                )}
                {formData.senderDetails.discount &&
                  formData.senderDetails.taxType !== "None" && (
                    <div className="flex justify-between break-all">
                      <span className="min-w-[130px]">Net Price:</span>
                      <span>₹{itemData.afterDiscountAmount}</span>
                    </div>
                  )}
                {formData.senderDetails.taxType === "IGST" && (
                  <div className="flex justify-between break-all">
                    <span className="min-w-[130px]">IGST</span>
                    <span>₹{itemData.taxAmount}</span>
                  </div>
                )}
                {formData.senderDetails.taxType == "CGST & SGST" && (
                  <>
                    <div className="flex justify-between break-all">
                      <span className="min-w-[130px]">CGST</span>
                      <span>₹{itemData.taxAmount / 2}</span>
                    </div>
                    <div className="flex justify-between break-all">
                      <span className="min-w-[130px]">SGST</span>
                      <span>₹{itemData.taxAmount / 2}</span>
                    </div>
                  </>
                )}
              </>
            ) : (
              ""
            )}
            {formData.senderDetails.advancedAmount > 0 && (
              <>
                <div className="flex justify-between break-all">
                  <span className="min-w-[130px]">Paid Amount</span>
                  <span>
                    ₹{Number(formData.senderDetails.advancedAmount).toFixed(2)}
                  </span>
                </div>
              </>
            )}
            <div className="flex justify-between py-2 border-t-2 border-b-2 text-xl font-semibold break-all">
              <span className="min-w-[130px]">Total:</span>
              <span>₹{itemData.total}</span>
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
    fontWeight: "600",
  },
  itemContainer: {
    display: "flex",
    // alignItems: "center",
    gap: "20px",
    flex: "2 1 1 1",
  },
};
