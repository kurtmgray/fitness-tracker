import { useEffect, useRef } from 'react';

interface GoogleLoginProps {
  onSuccess: (response: any) => void;
  onError: (error: any) => void;
  clientId: string;
}

export function GoogleLogin({
  onSuccess,
  onError,
  clientId,
}: GoogleLoginProps) {
  const googleButtonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.google) {
      // Load Google Identity Services script
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogleSignIn;
      document.head.appendChild(script);
    } else {
      initializeGoogleSignIn();
    }

    function initializeGoogleSignIn() {
      if (window.google && googleButtonRef.current) {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleCredentialResponse,
        });

        window.google.accounts.id.renderButton(googleButtonRef.current, {
          theme: 'outline',
          size: 'large',
          width: 300,
          text: 'signin_with',
          shape: 'rounded',
        });
      }
    }

    function handleCredentialResponse(response: any) {
      if (response.credential) {
        // Decode the JWT token to get user info
        const base64Url = response.credential.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split('')
            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );

        const userInfo = JSON.parse(jsonPayload);

        onSuccess({
          credential: response.credential,
          user: {
            googleId: userInfo.sub,
            email: userInfo.email,
            name: userInfo.name,
            picture: userInfo.picture,
          },
        });
      } else {
        onError('No credential received');
      }
    }
  }, [clientId, onSuccess, onError]);

  return (
    <div className="flex justify-center">
      <div ref={googleButtonRef} className="w-full"></div>
    </div>
  );
}

// Extend the Window interface for TypeScript
declare global {
  interface Window {
    google: any;
  }
}
