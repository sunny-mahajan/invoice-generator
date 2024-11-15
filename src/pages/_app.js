// import { SessionProvider } from "next-auth/react";
// import ProtectedPage from "../app/protected"; // Adjust path if necessary
// import "./style.css";
// import { ThemeProvider } from "../utils/themeContext";

// function MyApp({ Component, pageProps, router }) {
//   const protectedRoutes = ["/", "/upload"]; // Define protected routes

//   const isProtectedRoute = protectedRoutes.includes(router.pathname);

//   return (
//     <SessionProvider session={pageProps.session}>
//       {isProtectedRoute ? (
//         <ProtectedPage>
//           <ThemeProvider>
//             <Component {...pageProps} />
//           </ThemeProvider>
//         </ProtectedPage>
//       ) : (
//         <Component {...pageProps} />
//       )}
//     </SessionProvider>
//   );
// }

// export default MyApp;

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

