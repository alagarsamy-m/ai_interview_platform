"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useUser } from "./provider";
import { useRef, useState, useEffect } from "react";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function Home() {
  const router = useRouter();
  const { user, setUser } = useUser();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const supabase = createClientComponentClient();



  // Helper to get initial
  const getInitial = (user) => {
    if (!user) return '';
    if (user.user_metadata?.name && user.user_metadata.name.length > 0) return user.user_metadata.name[0].toUpperCase();
    if (user.name && user.name.length > 0) return user.name[0].toUpperCase();
    if (user.email && user.email.length > 0) return user.email[0].toUpperCase();
    return '';
  };

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  // Sign out handler
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setDropdownOpen(false);
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden bg-white">
      {/* Profile or Login Button in Upper Right */}
      <div className="absolute top-6 right-8 z-20">
        {user ? (
          <div className="relative" ref={dropdownRef}>
            <div
              className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-600 text-white font-bold text-lg shadow-md border-2 border-white cursor-pointer select-none"
              title={user.name || user.email}
              onClick={() => setDropdownOpen((open) => !open)}
            >
              {getInitial(user)}
            </div>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-30 p-4 flex flex-col items-start min-w-[200px]">
                <div className="mb-2">
                  <div className="font-semibold text-gray-900 text-base">{user.user_metadata?.name || user.name || user.email || "No Name"}</div>
                  <div className="text-gray-500 text-sm break-all">{user.email}</div>
                </div>
                <button
                  onClick={handleSignOut}
                  className="mt-2 w-full text-left px-3 py-2 rounded-md bg-red-50 hover:bg-red-100 text-red-600 font-medium text-sm focus:outline-none"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        ) : (
          <Button
            size="sm"
            variant="outline"
            className="border-blue-500 text-blue-700 hover:bg-blue-50 hover:border-blue-700 focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 rounded-lg px-5 py-2 font-semibold shadow-sm"
            onClick={() => router.push('/auth/signin')}
          >
            Login
          </Button>
        )}
      </div>

      {/* Animated Gradient Background */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-blue-200 via-blue-100 to-transparent animate-float1 opacity-60" />
        <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-blue-100 via-blue-300 to-transparent animate-float2 opacity-50" />
        <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tl from-blue-50 via-blue-200 to-transparent animate-float3 opacity-40" />
      </div>

      <div className="w-full max-w-4xl text-center z-10 fade-in-up bg-white rounded-3xl shadow-2xl p-10 md:p-16">
        {/* Logo with fade-in animation */}
        <div className="mx-auto mb-8 w-40 h-40 flex items-center justify-center fade-in-up delay-100">
          <Image
            src="/logo.png"
            alt="Logo"
            width={160}
            height={160}
            className="object-contain"
            priority
          />
        </div>
        
        <h1 className="text-4xl font-bold mb-4 fade-in-up delay-200">
          AI-Powered Interview Platform
        </h1>
        
        <p className="text-xl text-gray-600 mb-8 fade-in-up delay-300">
          Create and conduct interviews with AI-generated questions
        </p>

        <div className="space-y-4 fade-in-up delay-400">
          <Button
            size="lg"
            className="w-full max-w-md transition-all duration-200 shadow-md hover:shadow-xl hover:scale-105 bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => {
              if (!user) {
                router.push('/auth/signin');
              } else {
                router.push('/interview/create');
              }
            }}
          >
            Create New Interview
          </Button>
          
          <p className="text-sm text-gray-500">
            Share the generated link with candidates to start the interview process
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 fade-in-up delay-500">
          <div className="p-6 bg-white rounded-lg shadow-md border border-blue-50 hover:shadow-lg transition-all duration-200">
            <h3 className="text-lg font-semibold mb-2 text-blue-700">AI-Generated Questions</h3>
            <p className="text-gray-600">
              Customized questions based on job position and types
            </p>
          </div>
          
          <div className="p-6 bg-white rounded-lg shadow-md border border-blue-50 hover:shadow-lg transition-all duration-200">
            <h3 className="text-lg font-semibold mb-2 text-blue-700">Voice-Controlled Interview</h3>
            <p className="text-gray-600">
              Natural conversation with AI interviewer
            </p>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style jsx global>{`
        @keyframes float1 {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-20px) scale(1.05); }
        }
        @keyframes float2 {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(20px) scale(1.08); }
        }
        @keyframes float3 {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        .animate-float1 { animation: float1 7s ease-in-out infinite; }
        .animate-float2 { animation: float2 9s ease-in-out infinite; }
        .animate-float3 { animation: float3 11s ease-in-out infinite; }
        .fade-in-up {
          opacity: 0;
          transform: translateY(30px);
          animation: fadeInUp 0.8s forwards;
        }
        .fade-in-up.delay-100 { animation-delay: 0.1s; }
        .fade-in-up.delay-200 { animation-delay: 0.2s; }
        .fade-in-up.delay-300 { animation-delay: 0.3s; }
        .fade-in-up.delay-400 { animation-delay: 0.4s; }
        .fade-in-up.delay-500 { animation-delay: 0.5s; }
        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
