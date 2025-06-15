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
    const { data: authListener } = supabase.auth.onAuthStateChange(
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
      authListener?.unsubscribe();  // Cleanup the listener on unmount
    };
  }, []);  // Empty dependency array ensures this runs only on mount

  const fetchUserData = async (authUser) => {
    // Fetch user data from the 'Users' table
    const { data: existingUsers, error: fetchError } = await supabase
      .from("Users")
      .select("*")
      .eq("email", authUser.email);

    if (fetchError) {
      console.error("Fetch error:", fetchError);
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
        console.error("Insert error:", insertError);
        return;
      }

      setUser(insertedUser?.[0]);  // Set inserted user data
    } else {
      setUser(existingUsers?.[0]);  // Set existing user data
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <UserDetailContext.Provider value={{ user, setUser }}>
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
