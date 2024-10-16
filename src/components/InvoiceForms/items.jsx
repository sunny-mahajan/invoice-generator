import React from 'react';
import CustomInput from '../Input/index';
import CustomButton from '../Button/index';
import {PlusIcon, DeleteIcon} from '../../utils/icons';

const ItemDetails = ({
  formData,
  handleItemChange,
  handleRemoveItem,
  handleAddItem,
  currencySymbols,
  validateForm={validateForm},
  errorsData={errorsData}
}) => {
  return (
    <div>
      <h3 style={styles.titleText}>Item List</h3>
      {formData.items && formData.items.map((item, index) => (
        <div key={index} style={styles.itemContainer}>
          <CustomInput
            type="text"
            name="name"
            title="Item Name"
            containerStyle={{ width: "fit-content" }}
            value={item.name}
            onChange={(e) => handleItemChange(index, e)}
            inputStyle={{ flex: "2 1 auto" }}
            required={true}
          />
          <CustomInput
            type="text"
            name="description"
            title="Item Description"
            containerStyle={{ width: "fit-content" }}
            value={item.description}
            onChange={(e) => handleItemChange(index, e)}
            inputStyle={{ flex: "2 1 auto" }}
            required={true}
          />
          <CustomInput
            type="number"
            name="quantity"
            title="Qty/Hrs."
            containerStyle={{ width: "fit-content" }}
            value={item.quantity}
            onChange={(e) => handleItemChange(index, e)}
            inputStyle={{ flex: "0.3 1 auto", maxWidth: "70px" }}
            required={true}
          />
          <CustomInput
            type="number"
            name="price"
            containerStyle={{ width: "fit-content" }}
            title="Price"
            value={item.price}
            onChange={(e) => handleItemChange(index, e)}
            inputStyle={{ flex: "1 1 auto", maxWidth: "100px" }}
            required={true}
          />
          <CustomInput
            title={"Total"}
            containerStyle={{ width: "fit-content" }}
            isText={true}
            value={`${formData.currency ? `${currencySymbols[formData.currency] || ""} ` : ""}${item.total || 0}`}
            // value={item.total || 0}
            inputStyle={{ flex: "1 1 auto" }}
          />
          <div
            onClick={() => handleRemoveItem(index)}
            style={{ cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", height: "100%", flex: "0 1 auto", paddingTop: "18px" }}
          >
            <DeleteIcon />
          </div>
        </div>
      ))}

{errorsData.items && <span style={styles.errorText}>{errorsData.items}</span>}
      <CustomButton
        type="gray"
        onClick={(e) => {
          e.preventDefault();
          if (validateForm()) {
            handleAddItem();
          }
        }}
        buttonStyle={{ width: "25%", display: "flex", alignItems: "center", gap: "5px", float: "right" }}
      >
        <PlusIcon f={"#dfe3fa"} /> Add New Item
      </CustomButton>
    </div>
  );
};

export default ItemDetails;

// Example styles object
const styles = {
    titleText: {
        color: "#7C5DFA",
        fontSize: "15px",
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
