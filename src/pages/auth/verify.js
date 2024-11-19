import { useEffect } from "react";
import { useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Verify = () => {
  const router = useRouter();
  const { token } = router.query;

  useEffect(() => {
    if (token) {
      verifyEmail(token);
    }
  }, [token]);

  const verifyEmail = async (token) => {
    try {
      const response = await fetch(`/api/auth/verify?token=${token}`);

      if (response.ok) {
        alert("Email verified successfully. You can now log in.");
        router.push("/auth/login");
      } else {
        const errorData = await response.json();
        toast.error(`Verification failed: ${errorData.error}`);
      }
    } catch (error) {
      toast.error("Verification failed. Please try again.");
    }
  };

  return (
    <div>
      <ToastContainer />
      Verifying your email...
    </div>
  );
};

export default Verify;
