'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface SignUpFormProps {
  userType: 'homeowner' | 'designer';
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
}

export default function SignUpForm({ userType }: SignUpFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setFormErrors({});

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
      const { error: signUpError, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            user_type: userType,
          },
        },
      });

      if (signUpError) {
        console.error('Sign up error:', signUpError);
        setError(signUpError.message);
        setLoading(false);
        return;
      }

      if (!data.user) {
        setError('Failed to create account. Please try again.');
        setLoading(false);
        return;
      }

      // Wait for triggers to complete
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Verify user role was created
      const { data: userRole, error: roleError } = await supabase
        .from('user_role')
        .select('user_role')
        .eq('user_id', data.user.id)
        .single();

      if (roleError) {
        console.error('Error verifying user role:', roleError);
        // Check if user exists in users table
        const { data: userData, error: userDataError } = await supabase
          .from('users')
          .select('id')
          .eq('id', data.user.id)
          .single();

        if (userDataError) {
          console.error('Error checking user data:', userDataError);
        }

        setError('Account created but role assignment failed. Please contact support.');
        setLoading(false);
        return;
      }

      // Redirect to dashboard
      router.push(`/dashboard/${userType}`);
      router.refresh();
    } catch (err: any) {
      console.error('Unexpected error during sign up:', err);
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  return {
    handleSubmit,
    loading,
    error,
    formErrors,
  };
} 