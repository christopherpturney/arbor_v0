import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from './database.types';

// Create a single supabase client for the entire session
export const supabase = createClientComponentClient<Database>();

// Helper types for easier database access
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type InsertTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type UpdateTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']; 