'use client';

import Link from "next/link";
import SignUpForm from "@/components/auth/SignUpForm";
import AuthNavigation from "@/components/auth/AuthNavigation";

export default function HomeownerSignUp() {
  return (
    <div className="min-h-screen bg-base-100">
      <AuthNavigation />
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)] pb-16">
        <div className="max-w-md w-full mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-medium mb-2">Sign Up as a Homeowner</h1>
            <p className="text-charcoal/70">Get expert design advice for your space</p>
          </div>

          <SignUpForm userType="homeowner" />

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