'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import type { Database } from '@/lib/database.types';
import type { AuthError } from '@supabase/supabase-js';

type UserRoleType = Database['public']['Enums']['user_role_type'];

interface LoginFormProps {
  userType: UserRoleType;
  onSuccess?: () => void;
}

function getErrorMessage(error: AuthError): { message: string; type: 'email' | 'password' | 'verification' | 'general' } {
  switch (error.message) {
    case 'Invalid login credentials':
      return {
        message: 'The password you entered is incorrect',
        type: 'password'
      };
    case 'Email not confirmed':
      return {
        message: 'Please check your email and click the verification link to activate your account',
        type: 'verification'
      };
    case 'Invalid email or password format':
      return {
        message: 'Please check your email and password format',
        type: 'general'
      };
    default:
      if (error.message.includes('User not found')) {
        return {
          message: 'No account found with this email address',
          type: 'email'
        };
      }
      return {
        message: error.message,
        type: 'general'
      };
  }
}

export default function LoginForm({ userType, onSuccess }: LoginFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<{
    email?: string;
    password?: string;
    verification?: string;
    general?: string;
  }>({});

  const validateForm = (email: string, password: string) => {
    const errors: typeof formErrors = {};
    
    if (!email) {
      errors.email = 'Email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      errors.email = 'Invalid email address';
    }

    if (!password) {
      errors.password = 'Password is required';
    }

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setFormErrors({});

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    // Validate form
    const validationErrors = validateForm(email, password);
    if (Object.keys(validationErrors).length > 0) {
      setFormErrors(validationErrors);
      setLoading(false);
      return;
    }

    try {
      // Sign in with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      if (authData.user) {
        // Check if user has correct role
        const { data: roleData, error: roleError } = await supabase
          .from('users')
          .select('user_role')
          .eq('id', authData.user.id)
          .single();

        if (roleError) {
          console.error('Error fetching user role:', roleError);
          setFormErrors({
            general: 'An error occurred while checking user role'
          });
          return;
        }

        if (roleData.user_role !== userType) {
          setFormErrors({
            general: `This account is registered as a ${roleData.user_role}. Please use the correct login form.`
          });
          return;
        }

        onSuccess?.();
        router.refresh(); // Refresh to update session
        router.push(`/dashboard/${userType}`);
      }
    } catch (err) {
      console.error('Login error:', err);
      const error = err as AuthError;
      const errorDetails = getErrorMessage(error);
      
      setFormErrors({
        [errorDetails.type]: errorDetails.message
      });
    } finally {
      setLoading(false);
    }
  };

  return { handleSubmit, loading, formErrors };
} 