import { getAuth, signOut } from "firebase/auth";

// Store the access token in localStorage
export const storeAccessToken = async (user) => {
  if (user) {
    console.log(user, "storeAccessToken");
    const idToken = await user.getIdToken();
    localStorage.setItem("accessToken", idToken);
  }
};

// Retrieve the access token from localStorage
export const getAccessToken = () => {
  return localStorage.getItem("accessToken");
};

// Check if a token is expired
export const isTokenExpired = (token) => {
  if (!token) return true;

  const payload = JSON.parse(atob(token.split(".")[1]));
  const expirationTime = payload.exp * 1000; // exp is in seconds
  return expirationTime < Date.now();
};

// Force refresh the token and update localStorage
export const refreshAccessToken = async (user) => {
  if (user) {
    const freshToken = await user.getIdToken(true);
    localStorage.setItem("accessToken", freshToken);
    return freshToken;
  }
  return null;
};

// Handle sign-out
export const handleSignOut = async () => {
  const auth = getAuth();
  await signOut(auth);
  localStorage.removeItem("accessToken");
};
