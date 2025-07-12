'use client';

import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function AuthTest() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [authUrl, setAuthUrl] = useState('');
  const supabase = createClientComponentClient();

  const testAuth = async () => {
    try {
      setLoading(true);
      setError('');

      console.log('Testing auth with URL:', window.location.origin);

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        console.error('Auth error:', error);
        setError(error.message);
        return;
      }

      console.log('Auth data:', data);
      setAuthUrl(data?.url || 'No URL returned');

      if (data?.url) {
        console.log('Redirecting to:', data.url);
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Test auth error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-4">Auth Test Page</h1>
      
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">Current URL</h2>
          <p>{typeof window !== 'undefined' ? window.location.href : 'Server side'}</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold">Origin</h2>
          <p>{typeof window !== 'undefined' ? window.location.origin : 'Server side'}</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold">Environment Variables</h2>
          <p>Supabase URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Not set'}</p>
          <p>Supabase Key: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Not set'}</p>
        </div>

        <div>
          <button
            onClick={testAuth}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Google Auth'}
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            Error: {error}
          </div>
        )}

        {authUrl && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            Auth URL: {authUrl}
          </div>
        )}
      </div>
    </div>
  );
} 