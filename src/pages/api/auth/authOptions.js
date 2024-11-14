// import GoogleProvider from "next-auth/providers/google";
// import { db } from "../../../../firebaseConfig";
// import { collection, query, where, getDocs, addDoc } from "firebase/firestore";

// export const authOptions = {
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     }),
//   ],
//   pages: {
//     signIn: "/auth/login",
//   },
//   callbacks: {
//     async signIn({ user }) {
//       const usersCollection = collection(db, "users");
//       const userQuery = query(
//         usersCollection,
//         where("googleId", "==", user.id)
//       );

//       try {
//         const querySnapshot = await getDocs(userQuery);

//         if (querySnapshot.empty) {
//           await addDoc(usersCollection, {
//             googleId: user.id,
//             name: user.name,
//             email: user.email,
//             picture: user.image,
//           });
//         }

//         return true;
//       } catch (error) {
//         console.error("Error during sign-in:", error);
//         return false;
//       }
//     },

//     async redirect({ url, baseUrl }) {
//       return url.startsWith(baseUrl) ? url : baseUrl;
//     },
//   },
//   session: {
//     strategy: "jwt",
//     maxAge: 30 * 24 * 60 * 60, // 1 day
//   },
//   secret: process.env.NEXTAUTH_SECRET,
// };

import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { db } from "../../../../firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials;
        console.log(email, password, "email and password1");
        const usersCollection = collection(db, "users");
        const userQuery = query(usersCollection, where("email", "==", email));
        const userSnapshot = await getDocs(userQuery);

        if (userSnapshot.empty) {
          throw new Error("Invalid email or password");
        }

        const user = userSnapshot.docs[0].data();
        const isPasswordValid = await bcrypt.compare(password, user.password);
        console.log(isPasswordValid, "isPasswordValid1");
        if (!isPasswordValid) {
          throw new Error("Invalid email or password");
        }

        return { id: user.id, name: user.name, email: user.email };
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    async session({ session, token }) {
      session.user.id = token.sub;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
