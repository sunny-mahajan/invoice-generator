import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import "./style.css";
import CustomInput from "../../components/Input";
import CustomButton from "../../components/Button";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const router = useRouter();

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
        toast.error(data.error);
      } else {
        setLoading(false);
        toast.success(data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-wrapper">
        <div className="auth-form">
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
          <div>
            <span
              onClick={() => router.push("/auth/login")}
              className="signup-signin-cls"
            >
              Login here
            </span>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
