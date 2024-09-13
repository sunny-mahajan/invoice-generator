// pages/protected.js
import { getSession } from 'next-auth/react';

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: '/api/auth/signin',
        permanent: false,
      },
    };
  }
  return {
    props: { session },
  };
}

export default function ProtectedPage({ session }) {
  return <div>Welcome, {session.user.name}</div>;
}
