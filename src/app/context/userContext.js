// userContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { auth, googleAuthProvider } from "../../../firebaseConfig"; // Make sure to import from your firebase config
import { getAuth, signInWithPopup, onAuthStateChanged } from "firebase/auth";
import {
  doc,
  setDoc,
  collection,
  getDocs,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import {
  storeAccessToken,
  getAccessToken,
  isTokenExpired,
  refreshAccessToken,
  handleSignOut,
} from "../../utils/googleAuth";
import { db } from "../../../firebaseConfig";
const UserItemContext = createContext();
import { useRouter } from "next/router";

export const UserItemsProvider = ({ children }) => {
  const router = useRouter();
  const authData = getAuth();
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

  // Google Sign-In Function
  // const handleGoogleSignIn = async () => {
  //   try {
  //     const result = await signInWithPopup(auth, googleAuthProvider);
  //     const user = result.user;
  //     console.log("user", user);
  //     // Reference to the Firestore "users" collection
  //     const usersCollection = collection(db, "users");

  //     // Check if the user already exists in Firestore
  //     const userQuery = query(
  //       usersCollection,
  //       where("email", "==", user.email)
  //     );
  //     const existingUserSnapshot = await getDocs(userQuery);

  //     if (existingUserSnapshot.empty) {
  //       // Add the user's details to Firestore if they don't exist
  //       const userDocRef = doc(db, "users", user.uid);
  //       await setDoc(userDocRef, {
  //         uid: user.uid,
  //         displayName: user.displayName,
  //         email: user.email,
  //         photoURL: user.photoURL,
  //         createdAt: serverTimestamp(), // Use serverTimestamp for consistency
  //       });
  //     }

  //     // Set user data in the context and localStorage
  //     setUser({
  //       uid: user.uid,
  //       displayName: user.displayName,
  //       email: user.email,
  //       photoURL: user.photoURL,
  //     });

  //     // Redirect the user to the home page
  //     router.push("/");
  //   } catch (error) {
  //     console.error("Error during Google sign-in:", error.message);
  //   }
  // };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleAuthProvider);
      const user = result.user;

      // Get the Firebase ID token
      const idToken = await user.getIdToken();

      // Save the token to localStorage
      localStorage.setItem("token", idToken);
      console.log("idToken", idToken);
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
      console.log("idToken2", user);
      // Update the context
      setUser({
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
      });
      console.log("idToken3", idToken);
      // Redirect to the protected route
      router.push("/");
    } catch (error) {
      console.error("Error during Google Sign-In:", error.message);
    }
  };

  // Refresh token periodically
  // const refreshTokenIfNeeded = async () => {
  //   const token = getAccessToken();
  //   if (isTokenExpired(token) && auth.currentUser) {
  //     await refreshAccessToken(auth.currentUser);
  //   }
  // };

  // Listen to Authentication State Changes
  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(auth, async (user) => {
  //     if (user) {
  //       setUser({
  //         uid: user.uid,
  //         displayName: user.displayName,
  //         email: user.email,
  //         photoURL: user.photoURL,
  //       });
  //       localStorage.setItem("user", JSON.stringify(user));
  //       await storeAccessToken(user); // Save token to localStorage
  //     } else {
  //       setUser(null);
  //       localStorage.removeItem("user");
  //       localStorage.removeItem("accessToken");
  //     }
  //   });

  //   return unsubscribe;
  // }, [authData]);

  return (
    <UserItemContext.Provider
      value={{
        userData,
        setUser,
        clearUser,
        itemData,
        handleItemCalculatation,
        handleGoogleSignIn,
        // refreshTokenIfNeeded,
        handleSignOut,
      }}
    >
      {children}
    </UserItemContext.Provider>
  );
};

export const useUser = () => useContext(UserItemContext);
