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
      const { data: existingUser, error: userCheckError } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .single();

      if (userCheckError && !userCheckError.message.includes('no rows')) {
        console.error('Error checking existing user:', userCheckError);
        setError('An error occurred. Please try again.');
        setLoading(false);
        return;
      }

      if (existingUser) {
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
          emailRedirectTo: `${location.origin}/auth/callback`,
        }
      });

      if (signUpError) throw signUpError;

      router.push('/auth/verify-email');
    } catch (error: unknown) {
      const authError = error as AuthError;
      setError(authError.message);
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