import GoogleProvider from 'next-auth/providers/google';
import { db } from '../../../../firebaseConfig';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';

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

      const usersCollection = collection(db, 'users');
      const userQuery = query(usersCollection, where('googleId', '==', user.id));

      try {
        const querySnapshot = await getDocs(userQuery);

        if (querySnapshot.empty) {
          await addDoc(usersCollection, {
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
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 1 * 24 * 60 * 60, // 1 day
  },
  secret: process.env.NEXTAUTH_SECRET,
};
