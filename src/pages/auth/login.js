import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import {googleIcons} from '../../utils/icons'

export default function LoginPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { callbackUrl } = router.query;

  useEffect(() => {
    if (session) {
      router.push('/'); // Redirect to home page if already signed in
    }
  }, [session, router]);

  const handleSignIn = () => {
    signIn('google', { callbackUrl: callbackUrl || '/' }); // Redirect to home page after sign-in
  };

  return (
    <div className='login-container-cls'>
      <div className='login-social-container'>
        <div className='login-container-wrapper'>
          <h1>Login</h1>
          <div className='social-btn-container' onClick={handleSignIn}>
            <span>{googleIcons()}</span>
            <span className='social-btn-text'>Sign in with Google</span>
          </div>
        </div>
      </div>
    </div>
  );
}
