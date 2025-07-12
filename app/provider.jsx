'use client';
import { InterviewDataContext } from "@/context/InterviewDataContext";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import React, { useContext, useEffect, useState, createContext } from "react";

const UserContext = createContext();

function Provider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [interviewInfo, setInterviewInfo] = useState(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const getSession = async () => {
      try {
        console.log("[Provider] Getting session...");
        const { data: { session } } = await supabase.auth.getSession();
        console.log("[Provider] Session:", session);
        if (session?.user) {
          console.log("[Provider] User found, setting user directly");
          setUser(session.user);
        } else {
          console.log("[Provider] No session found");
        }
      } catch (error) {
        console.error("[Provider] Error getting session:", error);
      } finally {
        console.log("[Provider] Setting loading to false");
        setLoading(false);
      }
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        console.log("[Provider] Auth state changed:", _event, session);
        if (session?.user) {
          setUser(session.user);
        } else {
          setUser(null);
        }
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const fetchUserData = async (authUser) => {
    try {
      console.log("[Provider] Fetching user data for:", authUser.email);
      
      // Fetch user data from the 'Users' table
      const { data: existingUsers, error: fetchError } = await supabase
        .from("Users")
        .select("*")
        .eq("email", authUser.email);

      if (fetchError) {
        console.error("[Provider] Fetch error:", fetchError);
        // Set user to auth user as fallback
        setUser(authUser);
        return;
      }

      if (!existingUsers || existingUsers.length === 0) {
        console.log("[Provider] User not found, creating new user");
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
          // Set user to auth user as fallback
          setUser(authUser);
          return;
        }

        console.log("[Provider] New user created:", insertedUser?.[0]);
        setUser(insertedUser?.[0]); // Set inserted user data
      } else {
        console.log("[Provider] Existing user found:", existingUsers?.[0]);
        setUser(existingUsers?.[0]); // Set existing user data
      }
    } catch (error) {
      console.error("[Provider] Error in fetchUserData:", error);
      // Set user to auth user as fallback
      setUser(authUser);
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
    <UserContext.Provider value={{ user, setUser, loading }}>
      <InterviewDataContext.Provider value={{ interviewInfo, setInterviewInfo }}>
        {children}
      </InterviewDataContext.Provider>
    </UserContext.Provider>
  );
}

export default Provider;
export const useUser = () => useContext(UserContext);
