// import { useEffect } from "react";
// import { useRouter } from "next/router";
// import { useSession } from "next-auth/react";

// const ProtectedPage = ({ children }) => {
//   const { data: session, status } = useSession();
//   const router = useRouter();

//   useEffect(() => {
//     if (status === "loading") return; // Do nothing while loading

//     if (!session) {
//       router.push("/auth/login"); // Redirect to login if not authenticated
//     }
//   }, [session, status, router]);

//   if (session && status === "loading") {
//     return <div>Loading...</div>; // Loading state while checking authentication
//   }

//   // Render the children if authenticated
//   if (session) {
//     return <>{children}</>;
//   }
// };

// export default ProtectedPage;

// import { useEffect, useState } from "react";
// import { useRouter } from "next/router";

// const ProtectedPage = ({ children }) => {
//   const [isSessionValid, setIsSessionValid] = useState(false);
//   const router = useRouter();

//   useEffect(() => {
//     // Check if we're on the client side
//     if (typeof window !== "undefined") {
//       const sessionId = localStorage.getItem("sessionId");
//       if (!sessionId) {
//         // Redirect to login if sessionId does not exist
//         router.push("/auth/login");
//       } else {
//         setIsSessionValid(true);
//       }
//     }
//   }, [router]);

//   if (!isSessionValid) {
//     return <div>Loading...</div>; // Loading state while checking session
//   }

//   // Render the children if sessionId exists
//   return <>{children}</>;
// };

// export default ProtectedPage;

import { useEffect, useState } from "react";

const ProtectedPage = () => {
  const [message, setMessage] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get session ID from localStorage
    const sessionId = localStorage.getItem("sessionId");

    if (!sessionId) {
      console.log("No session found. Redirecting to login.");
      return; // You can redirect to the login page here
    }

    // Call the protected API route
    const fetchProtectedData = async () => {
      try {
        const response = await fetch("/api/auth/protected", {
          method: "GET",
          headers: {
            Authorization: sessionId, // Send sessionId in the Authorization header
          },
        });

        if (response.ok) {
          const data = await response.json();
          setMessage(data.message);
          setUser(data.user); // Assuming the response includes the user data
        } else {
          const errorData = await response.json();
          setMessage(errorData.error || "Access denied");
        }
      } catch (error) {
        console.error("Error fetching protected data:", error);
      }
    };

    fetchProtectedData();
  }, []);

  return (
    <div>
      <h1>Protected Page</h1>
      <p>{message}</p>
      {user && <div>User: {user.email}</div>}
    </div>
  );
};

export default ProtectedPage;
