import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const authRedirectUrl = new URL('/auth', requestUrl.origin);

  try {
    const code = requestUrl.searchParams.get('code');
    const enableEmailConfirmation = process.env.NEXT_PUBLIC_ENABLE_EMAIL_CONFIRMATION === 'true';

    // If email confirmation is disabled and there's no code, redirect to auth page
    if (!enableEmailConfirmation && !code) {
      return NextResponse.redirect(authRedirectUrl);
    }

    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    if (code) {
      // Exchange the code for a session
      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
      
      if (exchangeError) {
        console.error('Error exchanging code for session:', exchangeError);
        throw exchangeError;
      }
    }

    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError) {
      console.error('Error getting user:', userError);
      throw userError;
    }

    if (!user) {
      console.error('No user found after auth');
      throw new Error('User not found');
    }

    // Get the user's role from the users table
    const { data: userData, error: roleError } = await supabase
      .from('users')
      .select('user_role')
      .eq('id', user.id)
      .single();

    if (roleError) {
      console.error('Error fetching user role:', roleError);
      throw roleError;
    }

    console.log('User role:', userData); // Debug log

    // Redirect based on user role
    if (userData?.user_role === 'designer') {
      return NextResponse.redirect(new URL('/dashboard/designer', requestUrl.origin));
    } else if (userData?.user_role === 'homeowner') {
      return NextResponse.redirect(new URL('/dashboard/homeowner', requestUrl.origin));
    } else {
      console.error('No valid user role found:', userData);
      throw new Error('Invalid user role');
    }
  } catch (error) {
    console.error('Auth callback error:', error);
    // Redirect to auth page with error message
    authRedirectUrl.searchParams.set('error', 'An error occurred during authentication');
    return NextResponse.redirect(authRedirectUrl);
  }
} 