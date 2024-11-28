import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import CustomInput from "../../components/Input";
import CustomButton from "../../components/Button";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./style.css";
import Layout from "../../components/Layout";
import { useUser } from "../../app/context/userContext";

export default function ChangePassword() {
  const [loading, setLoading] = useState(false);
  const { clearUser } = useUser();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const router = useRouter();

  const handleChangePassword = async (e) => {
    setLoading(true);
    if (e.newPassword !== e.confirmPassword) {
      toast.error("New password and confirm password do not match");
      return;
    }

    try {
      const token = localStorage.getItem("token"); // Assumes JWT is stored here
      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: e.currentPassword,
          newPassword: e.newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Password change failed");
        return;
      }

      toast.success(data.message);
      setLoading(false);
      setTimeout(() => {
        localStorage.removeItem("token");
        clearUser();
        router.push("/auth/login");
      }, 2000);
    } catch (error) {
      console.error("Password change error:", error);
      toast.error("An error occurred while changing the password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="auth-container">
        <div className="auth-wrapper">
          <div className="auth-form change-password-cls">
            <h1>Change Password</h1>
            <form onSubmit={handleSubmit(handleChangePassword)}>
              <CustomInput
                type="password"
                name="currentPassword"
                title="Current Password"
                placeholder="Enter current password"
                inputClass="inputInvoiceCls"
                containerStyle={{ maxWidth: "250px" }}
                required
                register={register}
                errors={errors}
                validationRules={{
                  required: "Current password is required",
                }}
              />

              <CustomInput
                type="password"
                name="newPassword"
                title="New Password"
                placeholder="Enter new password"
                inputClass="inputInvoiceCls"
                containerStyle={{ maxWidth: "250px" }}
                required
                register={register}
                errors={errors}
                validationRules={{
                  required: "New password is required",
                  pattern: {
                    value:
                      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                    message: "Password must be 8+ chars, $@, 0-9, A-Z, a-z.",
                  },
                }}
              />

              <CustomInput
                type="password"
                name="confirmPassword"
                title="Confirm Password"
                placeholder="Enter confirm password"
                inputClass="inputInvoiceCls"
                containerStyle={{ maxWidth: "250px" }}
                required
                register={register}
                errors={errors}
                validationRules={{
                  required: "Confirm password is required",
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
                change password
              </CustomButton>
            </form>
          </div>
        </div>
        <ToastContainer />
      </div>
    </Layout>
  );
}
