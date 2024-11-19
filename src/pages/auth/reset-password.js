import { useState } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import "./style.css";
import CustomInput from "../../components/Input";
import CustomButton from "../../components/Button";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ResetPassword() {
  const router = useRouter();
  const { token, email } = router.query;
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleResetPassword = async (e) => {
    setLoading(true);
    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token, newPassword: e.password }),
      });

      const data = await response.json();
      if (!response.ok) {
        toast.error(data.error);
      } else {
        toast.success(data.message);
        setLoading(false);
        setTimeout(() => {
          router.push("/auth/login");
        }, 2000);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container-cls">
      <div className="login-container-wrapper">
        <div className="login-form-cls">
          <h1>Reset Password</h1>
          <form onSubmit={handleSubmit(handleResetPassword)}>
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
              Reset Password
            </CustomButton>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
