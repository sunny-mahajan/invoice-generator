import { useState } from "react";
import { useForm } from "react-hook-form";
import "./style.css";
import CustomInput from "../../components/Input";
import CustomButton from "../../components/Button";

export default function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleForgotPassword = async (e) => {
    setLoading(true);
    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: e.email }),
      });

      const data = await response.json();
      if (!response.ok) {
        alert(data.error);
      } else {
        setLoading(false);
        alert(data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container-cls">
      <div className="login-container-wrapper">
        <div className="login-form-cls">
          <h1>Forgot Password</h1>
          <form onSubmit={handleSubmit(handleForgotPassword)}>
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
            <CustomButton
              type="purple"
              buttonStyle={{ marginTop: "1rem", minWidth: "250px" }}
              isLoading={loading}
            >
              Send Reset Email
            </CustomButton>
          </form>
        </div>
      </div>
    </div>
  );
}
