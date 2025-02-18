'use client';

import { useState } from 'react';
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const fullName = formData.get('name') as string;

    try {
      // Check if user already exists in users table
      const { data: existingUsers, error: userCheckError } = await supabase
        .from('users')
        .select('id')
        .eq('email', email);

      if (userCheckError) {
        console.error('Error checking existing user:', {
          error: userCheckError,
          details: userCheckError.details,
          hint: userCheckError.hint,
          code: userCheckError.code
        });
        setError('An error occurred during signup. Please try again.');
        setLoading(false);
        return;
      }

      if (existingUsers && existingUsers.length > 0) {
        setError('This email is already registered. Please log in instead.');
        setLoading(false);
        return;
      }

      // Sign up the user
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            user_type: userType,
          },
          emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || location.origin}/auth/callback`,
        }
      });

      if (signUpError) {
        console.error('Signup error:', {
          error: signUpError,
          name: signUpError.name,
          message: signUpError.message,
          stack: signUpError.stack
        });
        throw signUpError;
      }

      router.push('/auth/verify-email');
    } catch (error: unknown) {
      console.error('Unhandled signup error:', {
        error,
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      setError('An error occurred during signup. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return {
    handleSubmit,
    loading,
    error,
  };
} 