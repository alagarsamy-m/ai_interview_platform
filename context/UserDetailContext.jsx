'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/services/supabaseClient';
import { useRouter } from 'next/navigation';

const defaultContextValue = {
    user: null,
    setUser: () => {},
    loading: true
};

export const UserDetailContext = createContext(defaultContextValue);

export function UserProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchSession = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (session?.user) {
                    await fetchUserData(session.user);
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error('Error fetching session:', error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        fetchSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            if (session?.user) {
                await fetchUserData(session.user);
            } else {
                setUser(null);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const fetchUserData = async (authUser) => {
        try {
            const { data: users, error } = await supabase
                .from('Users')
                .select('*')
                .eq('email', authUser.email);

            if (error) throw error;

            if (!users?.length) {
                const { data: inserted, error: insertErr } = await supabase
                    .from('Users')
                    .insert([{
                        name: authUser.user_metadata?.name,
                        email: authUser.email,
                        picture: authUser.user_metadata?.picture
                    }])
                    .select();

                if (insertErr) throw insertErr;
                setUser(inserted[0]);
            } else {
                setUser(users[0]);
            }
        } catch (error) {
            console.error('Error fetching/creating user:', error);
            setUser(null);
        }
    };

    const value = {
        user,
        setUser,
        loading
    };

    return (
        <UserDetailContext.Provider value={value}>
            {children}
        </UserDetailContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserDetailContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
}