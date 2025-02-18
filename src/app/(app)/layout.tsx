'use client';

import "./app.css";
import Link from "next/link";
import Image from "next/image";
import { createClientComponentClient, User } from '@supabase/auth-helpers-nextjs';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClientComponentClient();
  const [user, setUser] = useState<User | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Get user type from metadata
  const userType = user?.user_metadata?.user_type || 'homeowner';

  // Check if current path is an auth page
  const isAuthPage = pathname?.startsWith('/auth');

  useEffect(() => {
    const getUser = async () => {
      try {
        setIsLoading(true);
        const { data: { user: authUser } } = await supabase.auth.getUser();
        
        if (authUser) {
          // Fetch user data from our custom users table
          const { data: userData, error } = await supabase
            .from('users')
            .select('full_name, email')
            .eq('id', authUser.id)
            .single();

          if (!error && userData) {
            setUser({
              ...authUser,
              user_metadata: {
                ...authUser.user_metadata,
                full_name: userData.full_name
              }
            });
          } else {
            console.error('Error fetching user data:', error);
            setUser(authUser);
          }
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setIsLoading(false);
      }
    };
    getUser();
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/auth');
    router.refresh();
  };

  const userInitial = user?.user_metadata?.full_name?.[0] || user?.email?.[0] || '?';

  // Navigation Links Component
  const NavigationLinks = () => (
    <ul className="space-y-2">
      <li>
        <Link 
          href={`/dashboard/${userType}`}
          className="flex items-center gap-2 p-2 rounded-lg hover:bg-base-300 transition-colors"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span>Dashboard</span>
        </Link>
      </li>
      <li>
        <Link 
          href="/projects" 
          className="flex items-center gap-2 p-2 rounded-lg hover:bg-base-300 transition-colors"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <span>Projects</span>
        </Link>
      </li>
      <li>
        <Link 
          href="/messages" 
          className="flex items-center gap-2 p-2 rounded-lg hover:bg-base-300 transition-colors"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          <span>Messages</span>
        </Link>
      </li>
    </ul>
  );

  // If it's an auth page, only render the content without navigation
  if (isAuthPage) {
    return <div className="min-h-screen bg-base-100">{children}</div>;
  }

  // Otherwise render the full layout with navigation
  return (
    <div className="min-h-screen bg-base-100">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <div className="flex h-screen overflow-hidden">
        {/* Sidebar - Hidden on mobile, shown on desktop */}
        <aside className={`
          fixed top-0 left-0 h-full w-64 bg-base-200 border-r border-base-300 z-50 
          transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          {/* Logo Section */}
          <div className="p-4 border-b border-base-300">
            <Link href={`/dashboard/${userType}`} className="flex items-center gap-2">
              <Image 
                src="/arbor_design_logo.png" 
                alt="Arbor Design Advice" 
                width={32} 
                height={32}
              />
              <span className="text-xl font-medium">Arbor</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 p-4">
            <NavigationLinks />
          </nav>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Navigation Bar */}
          <header className="sticky top-0 z-30 h-16 border-b border-base-300 bg-base-100 flex items-center px-4">
            {/* Mobile Menu Button - Left Side */}
            <div className="flex-1 flex items-center lg:hidden">
              <button 
                className="btn btn-ghost btn-sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>

            {/* Logo - Hidden on mobile, shown on desktop */}
            <div className="hidden lg:flex lg:flex-1 items-center">
              <h1 className="text-xl font-medium">Dashboard</h1>
            </div>

            {/* Logo and User Actions - Right Side */}
            <div className="flex items-center gap-4">
              {/* Logo - Shown on mobile, hidden on desktop */}
              <Link href={`/dashboard/${userType}`} className="flex lg:hidden items-center gap-2">
                <Image 
                  src="/arbor_design_logo.png" 
                  alt="Arbor Design Advice" 
                  width={32} 
                  height={32}
                />
              </Link>

              <button className="btn btn-ghost btn-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>
              <div className="dropdown dropdown-end">
                <div 
                  tabIndex={0} 
                  role="button" 
                  className="btn btn-ghost btn-circle avatar"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <div className="w-8 rounded-full bg-primary text-primary-content flex items-center justify-center">
                    {isLoading ? (
                      <span className="loading loading-spinner loading-xs"></span>
                    ) : (
                      <span className="text-base font-medium leading-[2]">{userInitial}</span>
                    )}
                  </div>
                </div>
                {isDropdownOpen && (
                  <ul 
                    tabIndex={0} 
                    className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-72"
                  >
                    <li className="px-4 py-2">
                      <div className="flex items-center gap-3">
                        <div className="avatar placeholder">
                          <div className="w-10 rounded-full bg-primary text-primary-content flex items-center justify-center">
                            <span className="text-lg font-medium leading-[2]">{userInitial}</span>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{user?.user_metadata?.full_name || 'User'}</p>
                          <p className="text-xs text-base-content/70 truncate">{user?.email}</p>
                        </div>
                      </div>
                    </li>
                    <div className="divider my-0"></div>
                    <li>
                      <Link href="/profile" className="flex items-center gap-2 p-2 rounded-lg hover:bg-base-300 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Profile Settings
                      </Link>
                    </li>
                    <li>
                      <Link href="/settings" className="flex items-center gap-2 p-2 rounded-lg hover:bg-base-300 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Account Settings
                      </Link>
                    </li>
                    <div className="divider my-0"></div>
                    <li>
                      <button 
                        onClick={handleLogout}
                        className="flex items-center gap-2 p-2 rounded-lg hover:bg-base-300 transition-colors text-error w-full"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Sign Out
                      </button>
                    </li>
                  </ul>
                )}
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
} 