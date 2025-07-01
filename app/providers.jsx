'use client';

import { Toaster } from "@/components/ui/toaster";
import Provider from "./provider";

export function Providers({ children }) {
  return (
    <Provider>
      {children}
      <Toaster />
    </Provider>
  );
} 