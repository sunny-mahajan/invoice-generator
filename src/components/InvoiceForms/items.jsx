import React from "react";
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
  return (
    <div>
      <h3 style={styles.titleText}>Item List</h3>
      {formData.items &&
        formData.items.map((item, index) => (
          <div key={index} style={styles.itemContainer} className="items-details-section">
            <div className="d-flex w-full gap-4"> 
              <CustomInput
                type="text"
                name="name"
                title="Item Name"
                placeholder="Enter item name"
                containerStyle={{ width: "50%" }}
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
                containerStyle={{ width: "50%" }}
                value={item.description}
                onChange={(e) => handleItemChange(index, e)}
                inputStyle={{ flex: "2 1 auto" }}
                required={true}
              />
            </div>
            <div className="d-flex w-full gap-4"> 
              <CustomInput
                type="number"
                name="quantity"
                title="Qty/Hrs."
                placeholder="Enter quantity"
                containerStyle={{ width: "30%" }}
                value={item.quantity}
                onChange={(e) => handleItemChange(index, e)}
                inputStyle={{ flex: "0.3 1 auto" }}
                required={true}
              />
              <CustomInput
                type="number"
                name="price"
                placeholder="Enter price"
                containerStyle={{ width: "30%" }}
                title="Price"
                value={item.price}
                onChange={(e) => handleItemChange(index, e)}
                inputStyle={{ flex: "1 1 auto" }}
                required={true}
              />
              <CustomInput
                title={"Total"}
                containerStyle={{ width: "20%", alignItems: "center" }}
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
                    paddingTop: "43px",
                    width: "20%",
                  }}
                >
                  <DeleteIcon />
                </div>
              )}
            </div>
          </div>
        ))}

      {errorsData.items && (
        <span className="input-error text-red-600">{errorsData.items}</span>
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
        }}
      >
        <PlusIcon f={"rgb(124, 93, 250)"} /> Add New Item
      </CustomButton>
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
    alignItems: "center",
    marginBottom: "20px",
    gap: "20px",
    flex: "2 1 1 1",
  },
};
