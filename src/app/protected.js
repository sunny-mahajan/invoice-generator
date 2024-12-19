import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useUser } from "./context/userContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProtectedPage = ({ children }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const { setUser, clearUser } = useUser();

  useEffect(() => {
    const token = localStorage.getItem("token");

    // Redirect if token is missing
    if (!token) {
      router.push("/auth/login");
      return;
    }

    // Fetch protected data
    fetchProtectedData(token);
  }, []);

  const fetchProtectedData = async (token) => {
    try {
      console.log("Fetching protected data...", token);
      const response = await fetch("/api/auth/protected", {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Parse the response JSON data
      const data = await response.json();
      console.log(data, "data");
      setUser(data.user);
      if (!response.ok || (!data.user.email_verified && !data.user.verified)) {
        toast.info("Please verify your email to access this page.");
        clearUser();
        router.push("/auth/login");
        return;
      }
      // Protected data is fetched successfully, stop loading
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch protected data:", error);
      router.push("/auth/login");
    }
  };

  // Show loading indicator while fetching data
  if (loading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};

export default ProtectedPage;
