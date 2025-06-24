import React, { useEffect, useRef } from 'react';

interface GoogleSignInButtonProps {
  onSuccess: (user: any) => void;
  onError?: (error: any) => void;
  text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
  theme?: 'outline' | 'filled_blue' | 'filled_black';
  size?: 'large' | 'medium' | 'small';
  shape?: 'rectangular' | 'pill' | 'circle' | 'square';
  disabled?: boolean;
}

export function GoogleSignInButton({
  onSuccess,
  onError,
  text = 'signin_with',
  theme = 'outline',
  size = 'large',
  shape = 'rectangular',
  disabled = false
}: GoogleSignInButtonProps) {
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.google || !buttonRef.current || disabled) return;

    const handleCredentialResponse = (response: any) => {
      try {
        // Decode JWT token (in production, verify this server-side)
        const payload = JSON.parse(atob(response.credential.split('.')[1]));
        
        const googleUser = {
          id: payload.sub,
          email: payload.email,
          name: payload.name,
          picture: payload.picture,
          given_name: payload.given_name,
          family_name: payload.family_name,
        };

        onSuccess(googleUser);
      } catch (error) {
        console.error('Error processing Google credential:', error);
        onError?.(error);
      }
    };

    // Initialize Google Auth for this button
    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || '1234567890-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com',
      callback: handleCredentialResponse,
      auto_select: false,
      cancel_on_tap_outside: true,
    });

    // Render the button
    window.google.accounts.id.renderButton(buttonRef.current, {
      theme,
      size,
      type: 'standard',
      text,
      shape,
      logo_alignment: 'left',
      width: '100%',
    });
  }, [onSuccess, onError, text, theme, size, shape, disabled]);

  if (disabled) {
    return (
      <div className="w-full h-12 bg-gray-100 rounded-lg flex items-center justify-center">
        <span className="text-gray-500">Cargando...</span>
      </div>
    );
  }

  return <div ref={buttonRef} className="w-full" />;
}