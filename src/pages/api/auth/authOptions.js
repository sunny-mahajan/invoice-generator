import GoogleProvider from 'next-auth/providers/google';
import User from '../../../models/user';
import connectToDatabase from '../../../lib/mongodb';

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  pages: {
    signIn: '/auth/login',
  },
  callbacks: {
    async signIn({ user }) {
      try {
        await connectToDatabase();
        
        // Check if user already exists
        const existingUser = await User.findOne({ googleId: user.id });
        if (!existingUser) {
          // Create a new user record
          await User.create({
            googleId: user.id,
            name: user.name,
            email: user.email,
            picture: user.image,
          });
        }
        return true;
      } catch (error) {
        console.error('Error during sign-in:', error);
        return false;
      }
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith(baseUrl)) return url;
      return baseUrl;
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 1 * 24 * 60 * 60, // 1 day
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// import GoogleProvider from 'next-auth/providers/google';
// import { db } from '../../../../firebaseConfig';
// import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';

// export const authOptions = {
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     }),
//   ],
//   pages: {
//     signIn: '/auth/login',
//   },
//   callbacks: {
//     // async signIn({ user }) {
//     //   try {
//     //     // Firestore collection reference
//     //     const usersCollection = collection(db, 'users');

//     //     // Query Firestore for existing user
//     //     const q = query(usersCollection, where('googleId', '==', user.id));
//     //     const querySnapshot = await getDocs(q);

//     //     if (querySnapshot.empty) {
//     //       // If user does not exist, create a new document
//     //       await addDoc(usersCollection, {
//     //         googleId: user.id,
//     //         name: user.name,
//     //         email: user.email,
//     //         picture: user.image,
//     //       });
//     //     }

//     //     return true;
//     //   } catch (error) {
//     //     console.error('Error during sign-in:', error);
//     //     return false;
//     //   }
//     // },
//     async signIn({ user }) {
//       console.log("Signing in user:", user);
//       try {
//          const usersCollection = collection(db, 'users');
//          const q = query(usersCollection, where('googleId', '==', user.id));
//          const querySnapshot = await getDocs(q);
   
//          if (querySnapshot.empty) {
//             console.log("User not found, creating new user document...");
//             await addDoc(usersCollection, {
//                googleId: user.id,
//                name: user.name,
//                email: user.email,
//                picture: user.image,
//             });
//             console.log("User document created successfully.");
//          }
   
//          return true;
//       } catch (error) {
//          console.error('Error during sign-in:', error);
//          return false;
//       }
//     },
   
//     async redirect({ url, baseUrl }) {
//       if (url.startsWith(baseUrl)) return url;
//       return baseUrl;
//     },
//   },
//   session: {
//     strategy: 'jwt',
//     maxAge: 1 * 24 * 60 * 60, // 1 day
//   },
//   secret: process.env.NEXTAUTH_SECRET,
// };
