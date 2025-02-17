'use client';

import Link from "next/link";
import { useState } from "react";
import SignUpForm from "@/components/auth/SignUpForm";
import AuthNavigation from "@/components/auth/AuthNavigation";

export default function HomeownerSignUp() {
  const [error, setError] = useState<string | null>(null);
  const { handleSubmit, loading, error: formError, formErrors } = SignUpForm({ userType: 'homeowner' });

  return (
    <div className="min-h-screen bg-base-100">
      <AuthNavigation />
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)] pb-16">
        <div className="max-w-md w-full mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-medium mb-2">Sign Up as a Homeowner</h1>
            <p className="text-charcoal/70">Get expert design advice for your space</p>
          </div>

          {(error || formError) && (
            <div className="alert alert-error mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-medium">{error || formError}</p>
                {(error || formError)?.toLowerCase().includes('already registered') && (
                  <p className="text-sm mt-1">
                    Please <Link href="/auth/homeowner/login" className="underline">log in</Link> instead
                  </p>
                )}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-control">
              <label htmlFor="name" className="label">
                <span className="label-text">Full Name</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className={`input input-bordered w-full ${formErrors.name ? 'input-error' : ''}`}
                required
              />
              {formErrors.name && (
                <label className="label">
                  <span className="label-text-alt text-error">{formErrors.name}</span>
                </label>
              )}
            </div>

            <div className="form-control">
              <label htmlFor="email" className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className={`input input-bordered w-full ${formErrors.email ? 'input-error' : ''}`}
                required
              />
              {formErrors.email && (
                <label className="label">
                  <span className="label-text-alt text-error">{formErrors.email}</span>
                </label>
              )}
            </div>

            <div className="form-control">
              <label htmlFor="password" className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className={`input input-bordered w-full ${formErrors.password ? 'input-error' : ''}`}
                required
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
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-charcoal/70">
              Already have an account?{" "}
              <Link href="/auth/homeowner/login" className="link link-primary">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 