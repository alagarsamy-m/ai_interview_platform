'use client';

import Provider from "./provider";

export function Providers({ children }) {
  return (
    <Provider>
      {children}
    </Provider>
  );
} 