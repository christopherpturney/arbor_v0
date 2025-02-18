'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import type { User } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/lib/database.types';
import DashboardNav from '@/components/dashboard/DashboardNav';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<'designer' | 'homeowner' | null>(null);
  const router = useRouter();
  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/auth');
        return;
      }

      setUser(user);

      // Get user role
      const { data: roleData, error: roleError } = await supabase
        .from('user_role')
        .select('user_role')
        .eq('user_id', user.id)
        .single();

      if (roleError) {
        console.error('Error fetching user role:', roleError);
        return;
      }

      setUserRole(roleData?.user_role || null);
    };

    checkAuth();
  }, [supabase, router]);

  if (!user || !userRole) {
    return null; // Or a loading spinner
  }

  return (
    <div className="min-h-screen bg-base-100">
      <DashboardNav user={user} userRole={userRole} />
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
} 