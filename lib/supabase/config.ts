// The project URL and public anon ("publishable") key. Both are safe in the
// browser: Row Level Security decides what they can reach. When either is
// missing the site runs on the local data and sign-in is switched off.
export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);
