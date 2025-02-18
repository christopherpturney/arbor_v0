'use client';

import Link from "next/link";
import SignUpForm from "@/components/auth/SignUpForm";
import AuthNavigation from "@/components/auth/AuthNavigation";

export default function DesignerSignUp() {
  return (
    <div className="min-h-screen bg-base-100">
      <AuthNavigation />
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)] pb-16">
        <div className="max-w-md w-full mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-medium mb-2">Sign Up as a Designer</h1>
            <p className="text-charcoal/70">Share your expertise and earn by providing design advice</p>
          </div>

          <SignUpForm userType="designer" />

          <div className="mt-6 text-center">
            <p className="text-sm text-charcoal/70">
              Already have an account?{" "}
              <Link href="/auth/designer/login" className="link link-primary">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 