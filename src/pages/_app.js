import { SessionProvider } from "next-auth/react";
import ProtectedPage from "../app/protected"; // Adjust path if necessary
import "./style.css";

function MyApp({ Component, pageProps, router }) {
  const protectedRoutes = ["/", "/upload"]; // Define protected routes

  const isProtectedRoute = protectedRoutes.includes(router.pathname);

  return (
    <SessionProvider session={pageProps.session}>
      {isProtectedRoute ? (
        <ProtectedPage>
          <Component {...pageProps} />
        </ProtectedPage>
      ) : (
        <Component {...pageProps} />
      )}
    </SessionProvider>
  );
}

export default MyApp;
