import { useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

const ProtectedPage = ({ children }) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // Do nothing while loading

    if (!session) {
      router.push("/auth/login"); // Redirect to login if not authenticated
    }
  }, [session, status, router]);

  if (session && status === "loading") {
    return <div>Loading...</div>; // Loading state while checking authentication
  }

  // Render the children if authenticated
  if (session) {
    return <>{children}</>;
  }
};

export default ProtectedPage;
