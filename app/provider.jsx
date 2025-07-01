'use client';
import { UserDetailContext } from "@/context/UserDetailContext";
import { InterviewDataContext } from "@/context/InterviewDataContext";
import { supabase } from "@/services/supabaseClient";
import React, { useContext, useEffect, useState } from "react";

function Provider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [interviewInfo, setInterviewInfo] = useState(null);

  useEffect(() => {
    // Fetch the session asynchronously
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        fetchUserData(session.user);  // Fetch user data if session is available
      }
    };

    getSession();  // Immediately fetch session on mount

    // Listen for auth state changes (i.e., login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          fetchUserData(session.user);  // Fetch user data if logged in
        } else {
          setUser(null);  // Clear user if logged out
        }
      }
    );

    setLoading(false);

    return () => {
      subscription?.unsubscribe();  // Cleanup the listener on unmount
    };
  }, []);  // Empty dependency array ensures this runs only on mount

  const fetchUserData = async (authUser) => {
    // Fetch user data from the 'Users' table
    const { data: existingUsers, error: fetchError } = await supabase
      .from("Users")
      .select("*")
      .eq("email", authUser.email);

    if (fetchError) {
      console.error("[Provider] Fetch error:", fetchError);
      return;
    }

    if (!existingUsers || existingUsers.length === 0) {
      // If the user doesn't exist, insert new user data
      const { data: insertedUser, error: insertError } = await supabase
        .from("Users")
        .insert([
          {
            name: authUser.user_metadata?.name,
            email: authUser.email,
            picture: authUser.user_metadata?.picture,
          },
        ])
        .select();

      if (insertError) {
        console.error("[Provider] Insert error:", insertError);
        return;
      }

      setUser(insertedUser?.[0]);  // Set inserted user data
    } else {
      setUser(existingUsers?.[0]);  // Set existing user data
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="text-gray-600 text-sm">Loading...</p>
      </div>
    </div>
  );

  return (
    <UserDetailContext.Provider value={{ user, setUser, loading }}>
      <InterviewDataContext.Provider value={{interviewInfo, setInterviewInfo}}>
        <div>{children}</div>
      </InterviewDataContext.Provider>
    </UserDetailContext.Provider>
  );
}

export default Provider;

export const useUser = () => {
  const context = useContext(UserDetailContext);
  return context;
};
