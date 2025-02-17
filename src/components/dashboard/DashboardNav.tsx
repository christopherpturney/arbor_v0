'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { User } from '@supabase/auth-helpers-nextjs';

interface DashboardNavProps {
  user: User | null;
  userRole: 'designer' | 'homeowner';
}

export default function DashboardNav({ user, userRole }: DashboardNavProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/auth');
    router.refresh();
  };

  const userFullName = user?.user_metadata?.full_name || 'User';
  const userInitial = userFullName[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || '?';

  return (
    <div className="navbar bg-base-200 border-b border-base-300">
      <div className="flex-1">
        <Link href={`/dashboard/${userRole}`} className="flex items-center gap-2">
          <Image 
            src="/arbor_design_logo.png" 
            alt="Arbor Design Advice" 
            width={32} 
            height={32}
          />
          <span className="text-xl font-medium">Arbor</span>
        </Link>
      </div>

      <div className="flex-none gap-2">
        {userRole === 'designer' && (
          <Link href="/portfolio/edit" className="btn btn-ghost btn-sm">
            Edit Portfolio
          </Link>
        )}
        
        <div className="dropdown dropdown-end">
          <div 
            tabIndex={0} 
            role="button" 
            className="btn btn-ghost btn-circle avatar"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <div className="w-10 rounded-full bg-primary text-primary-content flex items-center justify-center">
              <span className="text-lg">{userInitial}</span>
            </div>
          </div>
          
          <ul 
            tabIndex={0} 
            className={`mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52 ${
              isDropdownOpen ? 'block' : 'hidden'
            }`}
          >
            <li className="menu-title px-4 py-2">
              <span className="text-xs opacity-50">Signed in as</span>
              <span className="font-medium truncate">{userFullName}</span>
              <span className="text-xs opacity-50 truncate">{user?.email}</span>
            </li>
            <div className="divider my-0"></div>
            <li>
              <Link href="/profile" className="py-3">
                Profile Settings
              </Link>
            </li>
            {userRole === 'designer' ? (
              <>
                <li>
                  <Link href="/earnings" className="py-3">
                    Earnings & Payments
                  </Link>
                </li>
                <li>
                  <Link href="/portfolio" className="py-3">
                    View Portfolio
                  </Link>
                </li>
              </>
            ) : (
              <li>
                <Link href="/payment-methods" className="py-3">
                  Payment Methods
                </Link>
              </li>
            )}
            <div className="divider my-0"></div>
            <li>
              <button 
                onClick={handleLogout}
                className="text-error py-3"
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
} 