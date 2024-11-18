// components/Login.js
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import CustomInput from "../../components/Input";
import CustomButton from "../../components/Button";
import "./style.css";

export default function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

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
        router.push("/");
      } else {
        alert(result.error || "An error occurred");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      alert("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container-cls">
      <div className="login-container-wrapper">
        <div className="login-form-cls">
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
    </div>
  );
}
