import Link from "next/link";
import Image from "next/image";
import AuthNavigation from "@/components/auth/AuthNavigation";

export default function VerifyEmail() {
  return (
    <div className="min-h-screen bg-base-100">
      <AuthNavigation />
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)] pb-16">
        <div className="max-w-md w-full mx-auto px-4 text-center">
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <h1 className="text-2xl font-medium mb-4">Check Your Email</h1>
              
              <div className="text-charcoal/70 space-y-4">
                <p>
                  We've sent you an email with a verification link. 
                  Please click the link to verify your email address and complete your registration.
                </p>
                
                <div className="divider"></div>
                
                <div className="space-y-2">
                  <p className="text-sm">Didn't receive the email?</p>
                  <ul className="text-sm space-y-2">
                    <li>• Check your spam folder</li>
                    <li>• Make sure you entered your email correctly</li>
                    <li>• Allow a few minutes for the email to arrive</li>
                  </ul>
                </div>
              </div>

              <div className="mt-6">
                <Link href="/auth" className="btn btn-outline btn-primary w-full">
                  Return to Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 