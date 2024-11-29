// components/Register.js
import { useState } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import CustomInput from "../../components/Input";
import CustomButton from "../../components/Button";
import "./style.css";
import PhoneInputField from "../../components/Input/phoneInput";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
        toast.success("Registration successful! Please verify your email.");
        setTimeout(() => {
          router.push("/auth/login");
        }, 3000);
        reset();
      } else {
        const errorData = await response.json();
        toast.error(
          `Registration failed: ${errorData.error || "Unknown error"}`
        );
      }
    } catch (error) {
      toast.error("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-wrapper">
        <div className="auth-form">
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

            <PhoneInputField
              type={"tel"}
              name="contactNo"
              placeholder="9898989899"
              errors={errors}
              register={register}
              validationRules={{
                required: "Phone Number is required",
                pattern: {
                  value: /^\d{10}$/,
                  message: "Invalid phone number",
                },
              }}
              touchedInput={true}
              required={true}
            />

            <CustomInput
              type="password"
              name="password"
              title="Password"
              placeholder="Enter your password"
              inputClass="inputInvoiceCls"
              containerStyle={{ maxWidth: "266px" }}
              required
              register={register}
              errors={errors}
              validationRules={{
                required: "Password is required",
                pattern: {
                  value:
                    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                  message: "Password must be 8+ chars, $@, 0-9, A-Z, a-z.",
                },
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
          <div style={{ padding: "1rem 0" }}>
            <span>
              Already have an account?{" "}
              <span
                onClick={() => router.push("/auth/login")}
                className="signup-signin-cls"
              >
                Login here
              </span>
            </span>
          </div>
          <ToastContainer />
        </div>
      </div>
    </div>
  );
}
