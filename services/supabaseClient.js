import { createClient } from '@supabase/supabase-js'

// Create a single supabase client for interacting with your database
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables. Please check your .env.local file.');
}

console.log('Initializing Supabase client with URL:', supabaseUrl);

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
        storageKey: 'interview-scheduler-auth',
        storage: {
            getItem: (key) => {
                if (typeof window === 'undefined') return null;
                return JSON.parse(localStorage.getItem(key));
            },
            setItem: (key, value) => {
                if (typeof window === 'undefined') return;
                localStorage.setItem(key, JSON.stringify(value));
            },
            removeItem: (key) => {
                if (typeof window === 'undefined') return;
                localStorage.removeItem(key);
            },
        },
    },
    db: {
        schema: 'public'
    }
})