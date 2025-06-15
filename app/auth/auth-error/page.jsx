'use client';

import Link from 'next/link';

export default function AuthError() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Authentication Error
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            There was a problem with the authentication process. This could be because:
          </p>
          <ul className="mt-4 text-sm text-gray-600 list-disc list-inside">
            <li>The verification link has expired</li>
            <li>The link has already been used</li>
            <li>There was an error processing your request</li>
          </ul>
        </div>

        <div className="mt-8 space-y-4">
          <div className="text-center">
            <Link
              href="/auth/signin"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Return to Sign In
            </Link>
          </div>
          <div className="text-center">
            <Link
              href="/auth/signup"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Create a New Account
            </Link>
          </div>
          <div className="text-center">
            <Link
              href="/auth/reset-password"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Reset Your Password
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 