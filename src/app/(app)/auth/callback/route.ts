import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');
    const enableEmailConfirmation = process.env.NEXT_PUBLIC_ENABLE_EMAIL_CONFIRMATION === 'true';

    // Get cookie store
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    // If email confirmation is disabled and there's no code, check if user is already authenticated
    if (!enableEmailConfirmation && !code) {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        return NextResponse.redirect(new URL('/auth', requestUrl.origin));
      }

      // Get user role and redirect
      const { data: userData, error: roleError } = await supabase
        .from('users')
        .select('user_role')
        .eq('id', user.id)
        .single();

      if (roleError || !userData) {
        return NextResponse.redirect(new URL('/auth', requestUrl.origin));
      }

      return NextResponse.redirect(new URL(`/dashboard/${userData.user_role}`, requestUrl.origin));
    }

    if (code) {
      // Exchange the code for a session
      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
      
      if (exchangeError) {
        console.error('Error exchanging code for session:', exchangeError);
        throw exchangeError;
      }

      // Get the current user after exchanging the code
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error('Error getting user:', userError);
        throw userError || new Error('User not found');
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

      if (!userData?.user_role) {
        console.error('No valid user role found:', userData);
        throw new Error('Invalid user role');
      }

      // Redirect based on user role
      return NextResponse.redirect(new URL(`/dashboard/${userData.user_role}`, requestUrl.origin));
    }

    // If no code and not authenticated, redirect to auth page
    return NextResponse.redirect(new URL('/auth', requestUrl.origin));
  } catch (error) {
    console.error('Auth callback error:', error);
    // Redirect to auth page with error message
    return NextResponse.redirect(new URL('/auth?error=An error occurred during authentication', request.url));
  }
} 