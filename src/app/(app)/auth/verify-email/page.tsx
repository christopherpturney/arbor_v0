import Link from "next/link";

export default function VerifyEmail() {
  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center">
      <div className="max-w-md w-full mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-medium mb-4">Check Your Email</h1>
          <p className="text-lg text-charcoal/70">
            We&apos;ve sent you a verification link. Please check your email to continue.
          </p>
        </div>

        <div className="text-center">
          <p className="mb-4">
            Didn&apos;t receive an email? Check your spam folder or try again.
          </p>
          <Link href="/auth" className="btn btn-primary">
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
} 