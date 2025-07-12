'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function DebugPage() {
  const [session, setSession] = useState(null);
  const [envVars, setEnvVars] = useState({});
  const supabase = createClientComponentClient();

  useEffect(() => {
    // Check session
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
    };

    getSession();

    // Check environment variables
    setEnvVars({
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasSupabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      hasVapiKey: !!process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY,
    });
  }, []);

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-4">Debug Information</h1>
      
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">Environment Variables</h2>
          <pre className="bg-gray-100 p-4 rounded">
            {JSON.stringify(envVars, null, 2)}
          </pre>
        </div>

        <div>
          <h2 className="text-lg font-semibold">Session</h2>
          <pre className="bg-gray-100 p-4 rounded">
            {JSON.stringify(session, null, 2)}
          </pre>
        </div>

        <div>
          <h2 className="text-lg font-semibold">Current URL</h2>
          <p>{typeof window !== 'undefined' ? window.location.href : 'Server side'}</p>
        </div>
      </div>
    </div>
  );
} 