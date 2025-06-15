"use client";
import { useUser } from "@/context/UserDetailContext";
import React from "react";

const WelcomeContainer = () => {
  const { user } = useUser();

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : "G";

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
        <div className="bg-blue-500 text-white rounded-full h-12 w-12 flex items-center justify-center text-xl font-bold">
          {userInitial}
        </div>
      </div>
    </div>
  );
};

export default WelcomeContainer;
