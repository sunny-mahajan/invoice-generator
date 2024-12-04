import ProtectedPage from "../app/protected";
import "./style.css";
import { ThemeProvider } from "../utils/themeContext";
import { UserItemsProvider } from "../app/context/userContext";

function MyApp({ Component, pageProps, router }) {
  const protectedRoutes = ["/", "/upload", "/auth/change-password"]; // Define protected routes
  const isProtectedRoute = protectedRoutes.includes(router.pathname);

  return (
    <ThemeProvider>
      <UserItemsProvider>
        {isProtectedRoute ? (
          <ProtectedPage>
            <Component {...pageProps} />
          </ProtectedPage>
        ) : (
          <Component {...pageProps} />
        )}
      </UserItemsProvider>
    </ThemeProvider>
  );
}

export default MyApp;
