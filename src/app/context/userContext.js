// userContext.js
import React, { createContext, useContext, useState } from "react";
import { auth, googleAuthProvider } from "../../../firebaseConfig"; // Make sure to import from your firebase config
import { signInWithPopup } from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
const UserItemContext = createContext();
import { useRouter } from "next/router";

export const UserItemsProvider = ({ children }) => {
  const router = useRouter();
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

    if (formData.senderDetails?.advancedAmount && total > 0) {
      total -= formData.senderDetails.advancedAmount;
    }

    setItemData({
      subTotal: subTotal.toFixed(2),
      total: total.toFixed(2),
      taxAmount: taxAmount.toFixed(2),
      taxPercentage: taxPercentages.toFixed(2),
      discount: discountMoney.toFixed(2),
      afterDiscountAmount: afterDiscountAmount.toFixed(2),
    });
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleAuthProvider);
      const user = result.user;

      // Get the Firebase ID token
      const idToken = await user.getIdToken();

      // Save the token to localStorage
      localStorage.setItem("token", idToken);
      // Add user details to Firestore if they don't exist
      const userDocRef = doc(db, "users", user.uid);
      const existingUser = await getDoc(userDocRef);

      if (!existingUser.exists()) {
        await setDoc(userDocRef, {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          verified: user.emailVerified,
          createdAt: serverTimestamp(),
        });
      }
      // Update the context
      setUser({
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
      });
      // Redirect to the protected route
      router.push("/");
    } catch (error) {
      console.error("Error during Google Sign-In:", error.message);
    }
  };

  return (
    <UserItemContext.Provider
      value={{
        userData,
        setUser,
        clearUser,
        itemData,
        handleItemCalculatation,
        handleGoogleSignIn,
      }}
    >
      {children}
    </UserItemContext.Provider>
  );
};

export const useUser = () => useContext(UserItemContext);
