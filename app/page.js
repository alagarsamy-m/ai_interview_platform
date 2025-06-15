"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl text-center">
        <Image
          src="/logo.png"
          alt="Logo"
          width={200}
          height={100}
          className="mx-auto mb-8"
        />
        
        <h1 className="text-4xl font-bold mb-4">
          AI-Powered Interview Platform
        </h1>
        
        <p className="text-xl text-gray-600 mb-8">
          Create and conduct interviews with AI-generated questions and real-time feedback
        </p>

        <div className="space-y-4">
          <Button
            size="lg"
            className="w-full max-w-md"
            onClick={() => router.push('/interview/create')}
          >
            Create New Interview
          </Button>
          
          <p className="text-sm text-gray-500">
            Share the generated link with candidates to start the interview process
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">AI-Generated Questions</h3>
            <p className="text-gray-600">
              Customized questions based on job position and type
            </p>
          </div>
          
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Voice-Controlled Interview</h3>
            <p className="text-gray-600">
              Natural conversation with AI interviewer
            </p>
          </div>
          
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Instant Feedback</h3>
            <p className="text-gray-600">
              AI-powered analysis and recommendations
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
