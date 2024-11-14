// components/Register.js
import { useState } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import CustomInput from "../../components/Input";
import CustomButton from "../../components/Button";
import "./login.css";

export default function Register() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  // Registration handler
  const handleRegister = async (data) => {
    setLoading(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert("Registration successful! Please login.");
        reset();
      } else {
        const errorData = await response.json();
        alert(`Registration failed: ${errorData.message || "Unknown error"}`);
      }
    } catch (error) {
      alert("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container-cls">
      <div className="login-social-container">
        <div className="register-container-wrapper">
          <h1>Register</h1>
          <form onSubmit={handleSubmit(handleRegister)}>
            <CustomInput
              type="text"
              name="name"
              title="Name"
              placeholder="Enter your name"
              inputClass="inputInvoiceCls"
              required
              register={register}
              errors={errors}
              validationRules={{
                required: "Name is required",
              }}
            />

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
              type="text"
              name="contactNo"
              title="Contact Number"
              placeholder="Enter your contact number"
              inputClass="inputInvoiceCls"
              register={register}
              errors={errors}
              validationRules={{
                required: "Contact Number is required",
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
              Create Account
            </CustomButton>
          </form>
          <div>
            <span>
              Already have an account?{" "}
              <button onClick={() => router.push("/auth/login")}>
                Login here
              </button>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
