'use client';
import React, { useEffect, useState } from 'react';
import { SidebarProvider, SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import AppSidebar from './_components/AppSidebar';
import WelcomeContainer from './dashboard/_components/WelcomeContainer';
import { useUser } from '@/context/UserDetailContext';
import { supabase } from '@/services/supabaseClient';
import { Menu } from "lucide-react";
import { usePathname, useRouter } from 'next/navigation';

const SidebarAndContent = ({ children }) => {
  const { open: isSidebarOpen } = useSidebar();
  return (
    <div className="flex h-screen">
      <AppSidebar />
      <main className={`flex-1 overflow-y-auto ${isSidebarOpen ? 'ml-64' : ''}`}>
        <div className="p-4">
          <WelcomeContainer />
          {children}
        </div>
      </main>
    </div>
  );
};

export default function DashboardProvider({ children }) {
  const { user } = useUser();
  const pathname = usePathname();
  const router = useRouter();
  const isInterviewRoute = pathname.startsWith('/interview/');

  useEffect(() => {
    if (!user) {
      router.push('/auth');
    }
  }, [user, router]);

  return (
    <SidebarProvider isFullWidthContent={isInterviewRoute}>
      {isInterviewRoute ? (
        children
      ) : (
        <SidebarAndContent>{children}</SidebarAndContent>
      )}
    </SidebarProvider>
  );
}
