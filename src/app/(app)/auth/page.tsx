'use client';

import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import AuthNavigation from "@/components/auth/AuthNavigation";

export default function AuthPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Get user type from metadata or fetch from user_role table
        const { data: roleData } = await supabase
          .from('user_role')
          .select('user_role')
          .eq('user_id', user.id)
          .single();

        const userType = roleData?.user_role || user.user_metadata?.user_type || 'homeowner';
        router.replace(`/dashboard/${userType}`);
      }
    };

    checkAuth();
  }, [router, supabase]);

  return (
    <div className="min-h-screen bg-base-100">
      <AuthNavigation />

      <div className="max-w-4xl w-full mx-auto px-4 pt-16 pb-16">
        <div className="text-center mb-12">
          <Image 
            src="/arbor_design_logo.png" 
            alt="Arbor Design Advice" 
            width={64} 
            height={64}
            className="mx-auto mb-8"
            priority
          />
          <h1 className="text-3xl font-medium mb-4">Welcome to Arbor Design Advice</h1>
          <div className="text-center mb-8">
            <h2>Let&apos;s get started</h2>
            <p>Choose how you&apos;d like to use Arbor</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Homeowner Card */}
          <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
            <div className="card-body text-center">
              <h2 className="card-title text-2xl justify-center mb-4">I&apos;m a Homeowner</h2>
              <p className="mb-6 text-charcoal/70">
                Get expert design advice for your space from professional designers.
              </p>
              <div className="card-actions justify-center">
                <Link href="/auth/homeowner/signup" className="btn btn-primary btn-lg w-full">
                  Sign Up as Homeowner
                </Link>
              </div>
              <div className="divider">or</div>
              <Link href="/auth/homeowner/login" className="link link-primary">
                Log in to your homeowner account
              </Link>
            </div>
          </div>

          {/* Designer Card */}
          <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
            <div className="card-body text-center">
              <h2 className="card-title text-2xl justify-center mb-4">I&apos;m a Designer</h2>
              <p className="mb-6 text-charcoal/70">
                Share your expertise and earn by providing design advice to clients.
              </p>
              <div className="card-actions justify-center">
                <Link href="/auth/designer/signup" className="btn btn-primary btn-lg w-full">
                  Sign Up as Designer
                </Link>
              </div>
              <div className="divider">or</div>
              <Link href="/auth/designer/login" className="link link-primary">
                Log in to your designer account
              </Link>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <p className="text-center text-base-content/70">I&apos;m a homeowner looking for design advice</p>
          <p className="text-center text-base-content/70">I&apos;m a designer looking to offer advice</p>
        </div>
      </div>
    </div>
  );
} 