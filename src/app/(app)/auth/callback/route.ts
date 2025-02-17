import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const authRedirectUrl = new URL('/auth', requestUrl.origin);

  try {
    const code = requestUrl.searchParams.get('code');

    if (code) {
      const cookieStore = cookies();
      const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
      
      // Exchange the code for a session
      await supabase.auth.exchangeCodeForSession(code);

      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('User not found');
      }

      // Get the user's role from the user_role table
      const { data: userRole } = await supabase
        .from('user_role')
        .select('user_role')
        .eq('user_id', user.id)
        .single();

      console.log('User role:', userRole); // Debug log

      // Redirect based on user role
      if (userRole?.user_role === 'designer') {
        return NextResponse.redirect(new URL('/dashboard/designer', requestUrl.origin));
      } else if (userRole?.user_role === 'homeowner') {
        return NextResponse.redirect(new URL('/dashboard/homeowner', requestUrl.origin));
      } else {
        console.log('No valid user role found'); // Debug log
      }
    } else {
      console.log('No code found in request'); // Debug log
    }

    // If no code or role found, redirect to auth page
    return NextResponse.redirect(authRedirectUrl);
  } catch (error) {
    console.error('Auth callback error:', error);
    // Redirect to auth page with error message
    authRedirectUrl.searchParams.set('error', 'An error occurred during authentication');
    return NextResponse.redirect(authRedirectUrl);
  }
} 