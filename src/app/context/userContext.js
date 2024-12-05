// userContext.js
import React, { createContext, useContext, useState } from "react";

const UserItemContext = createContext();

export const UserItemsProvider = ({ children }) => {
  const [userData, setUserData] = useState(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    }
    return null;
  });

  const [itemData, setItemData] = useState({
    subTotal: 0,
    total: 0,
    taxAmount: 0,
    taxPercentage: 0,
    discount: 0,
    afterDiscountAmount: 0,
  });

  const setUser = (user) => {
    setUserData(user);
    localStorage.setItem("user", JSON.stringify(user));
  };

  const clearUser = () => {
    setUserData(null);
    localStorage.removeItem("user");
  };

  const handleItemCalculatation = (formData) => {
    let subTotal = 0;
    let total = 0;
    let taxAmount = 0;
    let taxPercentages = 0;
    let discountMoney = 0;
    let afterDiscountAmount = 0;

    formData?.items?.forEach((item) => {
      if (!item.quantity || !item.price) return;
      subTotal += +item.amount;
      total += +item.total;
      discountMoney += +item.amountSaved;
      taxAmount += +item.taxAmount;
      afterDiscountAmount += +item.afterDiscount;
    });

    taxPercentages =
      (taxAmount / (afterDiscountAmount ? afterDiscountAmount : subTotal)) *
      100;

    if(formData.senderDetails.advancedAmount && total > 0){
      total -= formData.senderDetails.advancedAmount
    }

    setItemData({
      subTotal: subTotal.toFixed(1),
      total: total.toFixed(1),
      taxAmount: taxAmount.toFixed(1),
      taxPercentage: taxPercentages.toFixed(1),
      discount: discountMoney.toFixed(1),
      afterDiscountAmount: afterDiscountAmount.toFixed(1),
    });
  };

  return (
    <UserItemContext.Provider
      value={{
        userData,
        setUser,
        clearUser,
        itemData,
        handleItemCalculatation,
      }}
    >
      {children}
    </UserItemContext.Provider>
  );
};

export const useUser = () => useContext(UserItemContext);
