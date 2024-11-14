// import { signIn, useSession } from "next-auth/react";
// import { useRouter } from "next/router";
// import { useEffect } from "react";
// import { googleIcons } from "../../utils/icons";

// export default function LoginPage() {
//   const { data: session } = useSession();
//   const router = useRouter();
//   const { callbackUrl } = router.query;

//   useEffect(() => {
//     if (session) {
//       router.push("/"); // Redirect to home page if already signed in
//     }
//   }, [session, router]);

//   const handleSignIn = () => {
//     signIn("google", { callbackUrl: callbackUrl || "/" }); // Redirect to home page after sign-in
//   };

//   return (
//     <div className="login-container-cls">
//       <div className="login-social-container">
//         <div className="login-container-wrapper">
//           <h1>Login</h1>
//           <div className="social-btn-container" onClick={handleSignIn}>
//             <span>{googleIcons()}</span>
//             <span className="social-btn-text">Sign in with Google</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// components/Login.js
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import CustomInput from "../../components/Input";
import CustomButton from "../../components/Button";
import "./login.css";

export default function Login() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (session) {
      router.push("/"); // Redirect if already signed in
    }
  }, [session, router]);

  // Email login handler
  // const handleEmailLogin = async (data) => {
  //   setLoading(true);
  //   try {
  //     const response = await fetch("/api/auth/login", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         email: data.email,
  //         password: data.password,
  //       }),
  //     });

  //     if (response.ok) {
  //       console.log("Login successful");
  //       router.push("/");
  //     } else {
  //       const errorData = await response.json();
  //       alert(`Login failed: ${errorData.message || "Invalid credentials"}`);
  //     }
  //   } catch (error) {
  //     console.error("Error during login:", error);
  //     alert("Login failed. Please try again.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleEmailLogin = async (data) => {
    setLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      });

      if (response.ok) {
        const { sessionId } = await response.json();
        console.log("Login successful, session ID:", sessionId);
        localStorage.setItem("sessionId", sessionId); // Store sessionId in localStorage
        router.push("/");
      } else {
        const errorData = await response.json();
        alert(`Login failed: ${errorData.message || "Invalid credentials"}`);
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container-cls">
      <div className="login-social-container">
        <div className="login-container-wrapper">
          <h1>Login</h1>
          <form onSubmit={handleSubmit(handleEmailLogin)}>
            <CustomInput
              type="text"
              name="email"
              title="Email"
              placeholder="Enter your email"
              inputClass="inputInvoiceCls"
              required
              register={register}
              errors={errors}
              validationRules={{
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              }}
            />

            <CustomInput
              type="password"
              name="password"
              title="Password"
              placeholder="Enter your password"
              inputClass="inputInvoiceCls"
              required
              register={register}
              errors={errors}
              validationRules={{
                required: "Password is required",
              }}
            />

            <CustomButton
              type="purple"
              buttonStyle={{ marginTop: "1rem", minWidth: "250px" }}
              isLoading={loading}
            >
              Login
            </CustomButton>
          </form>

          <div>
            <span>
              Do not have an account?{" "}
              <button onClick={() => router.push("/auth/register")}>
                Sign up now
              </button>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
