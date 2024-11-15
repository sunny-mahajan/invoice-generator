// components/Login.js
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import CustomInput from "../../components/Input";
import CustomButton from "../../components/Button";
import "./login.css";

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
    }
  };

  return (
    <div className="login-container-cls">
      <div className="login-social-container">
        <div className="login-container-wrapper">
          <h1>Login</h1>
          <form onSubmit={handleSubmit(handleLogin)}>
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
