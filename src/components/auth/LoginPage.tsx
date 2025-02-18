'use client';

import Link from 'next/link';
import LoginForm from '@/components/auth/LoginForm';
import AuthNavigation from '@/components/auth/AuthNavigation';
import type { Database } from '@/lib/database.types';

type UserRoleType = Database['public']['Enums']['user_role_type'];

interface LoginPageProps {
  userType: UserRoleType;
}

export default function LoginPage({ userType }: LoginPageProps) {
  const { handleSubmit, loading, formErrors } = LoginForm({ userType });

  const roleText = userType === 'designer' ? 'designer' : 'homeowner';

  return (
    <div className="min-h-screen bg-base-100">
      <AuthNavigation />
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)] pb-16">
        <div className="max-w-md w-full px-6 py-8">
          <h1 className="text-2xl font-bold text-center mb-2">Welcome Back</h1>
          <p className="text-center text-base-content/70 mb-8">
            Log in to your {roleText} account
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {formErrors.general && (
              <div className="alert alert-error">
                <span>{formErrors.general}</span>
              </div>
            )}

            {formErrors.verification && (
              <div className="alert alert-warning">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>{formErrors.verification}</span>
              </div>
            )}

            <div className="form-control">
              <label className="label" htmlFor="email">
                <span className="label-text">Email</span>
              </label>
              <input
                id="email"
                type="email"
                name="email"
                className={`input input-bordered w-full ${formErrors.email ? 'input-error' : ''}`}
                placeholder="you@example.com"
              />
              {formErrors.email && (
                <label className="label">
                  <span className="label-text-alt text-error">{formErrors.email}</span>
                </label>
              )}
            </div>

            <div className="form-control">
              <label className="label" htmlFor="password">
                <span className="label-text">Password</span>
              </label>
              <input
                id="password"
                type="password"
                name="password"
                className={`input input-bordered w-full ${formErrors.password ? 'input-error' : ''}`}
                placeholder="••••••••"
              />
              {formErrors.password && (
                <label className="label">
                  <span className="label-text-alt text-error">{formErrors.password}</span>
                </label>
              )}
            </div>

            <button
              type="submit"
              className={`btn btn-primary w-full ${loading ? 'loading' : ''}`}
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Log In'}
            </button>
          </form>

          <p className="text-center mt-8">
            Don&apos;t have an account?{' '}
            <Link href={`/auth/${roleText}/signup`} className="link link-primary">
              Sign up
            </Link>
          </p>

          <p className="text-lg text-charcoal/70">
            We&apos;ll help you find the perfect designer for your space.
          </p>
        </div>
      </div>
    </div>
  );
} 