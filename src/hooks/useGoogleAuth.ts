import { useState, useEffect } from 'react';

interface GoogleUser {
  id: string;
  email: string;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
}

interface UseGoogleAuthReturn {
  isLoaded: boolean;
  signIn: () => Promise<GoogleUser | null>;
  signOut: () => Promise<void>;
  user: GoogleUser | null;
}

declare global {
  interface Window {
    google: any;
    gapi: any;
  }
}

export function useGoogleAuth(): UseGoogleAuthReturn {
  const [isLoaded, setIsLoaded] = useState(false);
  const [user, setUser] = useState<GoogleUser | null>(null);

  useEffect(() => {
    const initializeGoogleAuth = async () => {
      try {
        // Load Google Identity Services
        if (!window.google) {
          const script = document.createElement('script');
          script.src = 'https://accounts.google.com/gsi/client';
          script.async = true;
          script.defer = true;
          document.head.appendChild(script);
          
          await new Promise((resolve) => {
            script.onload = resolve;
          });
        }

        // Initialize Google Auth
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || '1234567890-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com',
          callback: handleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        setIsLoaded(true);
      } catch (error) {
        console.error('Error initializing Google Auth:', error);
        setIsLoaded(true); // Set to true even on error to prevent infinite loading
      }
    };

    initializeGoogleAuth();
  }, []);

  const handleCredentialResponse = (response: any) => {
    try {
      // Decode JWT token (in production, verify this server-side)
      const payload = JSON.parse(atob(response.credential.split('.')[1]));
      
      const googleUser: GoogleUser = {
        id: payload.sub,
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
        given_name: payload.given_name,
        family_name: payload.family_name,
      };

      setUser(googleUser);
    } catch (error) {
      console.error('Error processing Google credential:', error);
    }
  };

  const signIn = async (): Promise<GoogleUser | null> => {
    return new Promise((resolve) => {
      if (!window.google) {
        resolve(null);
        return;
      }

      window.google.accounts.id.prompt((notification: any) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          // Fallback to popup
          window.google.accounts.id.renderButton(
            document.createElement('div'),
            {
              theme: 'outline',
              size: 'large',
              type: 'standard',
              text: 'signin_with',
              shape: 'rectangular',
              logo_alignment: 'left',
            }
          );
        }
      });

      // Set up a listener for successful sign-in
      const checkUser = setInterval(() => {
        if (user) {
          clearInterval(checkUser);
          resolve(user);
        }
      }, 100);

      // Timeout after 30 seconds
      setTimeout(() => {
        clearInterval(checkUser);
        resolve(null);
      }, 30000);
    });
  };

  const signOut = async (): Promise<void> => {
    if (window.google) {
      window.google.accounts.id.disableAutoSelect();
    }
    setUser(null);
  };

  return {
    isLoaded,
    signIn,
    signOut,
    user,
  };
}