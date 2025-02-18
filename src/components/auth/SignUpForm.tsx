'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { AuthError } from '@supabase/supabase-js';

interface SignUpFormProps {
  userType: 'homeowner' | 'designer';
}

export default function SignUpForm({ userType }: SignUpFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClientComponentClient();
  
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const handleSignUp = async () => {
    if (!nameRef.current || !emailRef.current || !passwordRef.current) return;

    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    const fullName = nameRef.current.value;

    if (!email || !password || !fullName) {
      setError('All fields are required');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      console.log('Attempting signup with:', { email, fullName, userType }); // Debug log

      const enableEmailConfirmation = process.env.NEXT_PUBLIC_ENABLE_EMAIL_CONFIRMATION === 'true';
      const redirectTo = enableEmailConfirmation
        ? process.env.NODE_ENV === 'production'
          ? 'https://arbor-v0.vercel.app/auth/callback'
          : `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`
        : undefined;

      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            user_type: userType,
          },
          emailRedirectTo: redirectTo,
        }
      });

      console.log('Signup response:', { authData, error: signUpError }); // Debug log

      if (signUpError) {
        throw signUpError;
      }

      if (authData.user) {
        if (enableEmailConfirmation) {
          router.push('/auth/verify-email');
        } else {
          // If email confirmation is disabled, sign in the user immediately
          const { error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (signInError) {
            throw signInError;
          }

          // Refresh to update the session
          router.refresh();
          router.push(`/dashboard/${userType}`);
        }
      } else {
        throw new Error('No user data returned from signup');
      }
    } catch (error: unknown) {
      console.error('Signup error:', error);
      if (error instanceof AuthError) {
        setError(error.message);
      } else {
        setError('An error occurred during signup. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="alert alert-error">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      <div className="form-control">
        <label htmlFor="name" className="label">
          <span className="label-text">Full Name</span>
        </label>
        <input
          ref={nameRef}
          type="text"
          id="name"
          name="name"
          className="input input-bordered w-full"
          required
          minLength={2}
        />
      </div>

      <div className="form-control">
        <label htmlFor="email" className="label">
          <span className="label-text">Email</span>
        </label>
        <input
          ref={emailRef}
          type="email"
          id="email"
          name="email"
          className="input input-bordered w-full"
          required
        />
      </div>

      <div className="form-control">
        <label htmlFor="password" className="label">
          <span className="label-text">Password</span>
        </label>
        <input
          ref={passwordRef}
          type="password"
          id="password"
          name="password"
          className="input input-bordered w-full"
          required
          minLength={6}
        />
      </div>

      <button 
        onClick={handleSignUp}
        type="button"
        className={`btn btn-primary w-full ${loading ? 'loading' : ''}`}
        disabled={loading}
      >
        {loading ? 'Creating Account...' : 'Create Account'}
      </button>
    </div>
  );
} 