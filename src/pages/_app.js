import ProtectedPage from "../app/protected";
import "./style.css";
import { ThemeProvider } from "../utils/themeContext";
import { UserProvider } from "../app/context/userContext";

function MyApp({ Component, pageProps, router }) {
  const protectedRoutes = ["/", "/upload"]; // Define protected routes
  const isProtectedRoute = protectedRoutes.includes(router.pathname);

  return (
    <ThemeProvider>
      <UserProvider>
        {isProtectedRoute ? (
          <ProtectedPage>
            <Component {...pageProps} />
          </ProtectedPage>
        ) : (
          <Component {...pageProps} />
        )}
      </UserProvider>
    </ThemeProvider>
  );
}

export default MyApp;
