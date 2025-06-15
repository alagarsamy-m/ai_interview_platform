"use client";
import { useUser } from "@/context/UserDetailContext";
import React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/services/supabaseClient";
import { useRouter } from "next/navigation";

const WelcomeContainer = () => {
  const { user, setUser } = useUser();
  const router = useRouter();

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : "G";

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push('/auth');
  };

  return (
    <div className="flex justify-between items-center w-full">
      <div className="bg-white p-3 rounded-2xl flex-grow">
        <h2 className="text-lg font-bold">
          Welcome, {user?.name || "Guest"}
        </h2>
        <h2 className="text-gray-500">
          AI-Driven Interviews, Hassle-Free Hiring
        </h2>
      </div>
      <div className="ml-4 flex-shrink-0">
        <Dialog>
          <DialogTrigger asChild>
            <div className="bg-red-500 text-white rounded-full h-12 w-12 flex items-center justify-center text-xl font-bold cursor-pointer">
              {userInitial}
            </div>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Profile Information</DialogTitle>
              <DialogDescription>
                View your profile details and manage your session.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <p className="text-right">Name:</p>
                <p className="col-span-3 font-semibold">{user?.name || "N/A"}</p>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <p className="text-right">Email:</p>
                <p className="col-span-3 font-semibold">{user?.email || "N/A"}</p>
              </div>
            </div>
            <Button onClick={handleLogout} className="w-full mt-4 bg-red-600 hover:bg-red-700">
              Logout
            </Button>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default WelcomeContainer;
