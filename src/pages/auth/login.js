// components/Login.js
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import CustomInput from "../../components/Input";
import CustomButton from "../../components/Button";
import "./style.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdBanner from "../../components/AdBanner";
import { useUser } from "../../app/context/userContext";

export default function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { setUser, clearUser } = useUser();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleLogin = async (data) => {
    setLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email, password: data.password }),
      });

      const result = await response.json();

      if (response.ok) {
        localStorage.setItem("token", result.token);
        fetchProtectedData(result.token);
        router.push("/");
      } else {
        toast.error(result.error || "An error occurred");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Login failed");
    } finally {
      setLoading(false);
    }
  };

  const fetchProtectedData = async (token) => {
    try {
      const response = await fetch("/api/auth/protected", {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Parse the response JSON data
      const data = await response.json();
      setUser(data.user);
      if (!response.ok || !data.user.verified) {
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

  return (
    <div className="auth-container">
      {/* <AdBanner
        data-ad-slot="8786526439"
        data-ad-format="auto"
        data-full-width-responsive="true"
      /> */}
      <div className="auth-wrapper">
        <div className="auth-form">
          <h1>Login</h1>
          <form onSubmit={handleSubmit(handleLogin)}>
            <CustomInput
              type="text"
              name="email"
              title="Email"
              placeholder="E-mail"
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
              containerStyle={{ maxWidth: "250px" }}
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
          <div style={{ textAlign: "center" }}>
            <div style={{ padding: "1rem 0" }}>
              <span>
                Do not have an account?{" "}
                <span
                  onClick={() => router.push("/auth/register")}
                  className="signup-signin-cls"
                >
                  Sign up now
                </span>
              </span>
            </div>
            <div>
              <span
                onClick={() => router.push("/auth/forgot-password")}
                className="signup-signin-cls"
              >
                Forgot Password?
              </span>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
