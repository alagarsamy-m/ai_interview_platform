'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { use } from 'react';

export default function StartInterview({ params }) {
  const router = useRouter();
  const { toast } = useToast();
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const unwrappedParams = use(params);

  useEffect(() => {
    const fetchInterview = async () => {
      try {
        const { data, error } = await supabase
          .from('interviews')
          .select('*')
          .eq('interview_id', unwrappedParams.interview_id)
          .single();

        if (error) {
          console.error('Supabase Error:', error);
          throw error;
        }

        if (!data) {
          throw new Error('Interview not found');
        }

        setInterview(data);
      } catch (error) {
        console.error('Error fetching interview:', error);
        toast({
          title: "Error",
          description: "Failed to load interview details.",
          variant: "destructive",
        });
        router.push('/');
      } finally {
        setLoading(false);
      }
    };

    fetchInterview();
  }, [unwrappedParams.interview_id, router, toast]);

  const handleStart = () => {
    router.push(`/interview/${unwrappedParams.interview_id}/questions`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Loading interview...</h2>
        </div>
      </div>
    );
  }

  if (!interview) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Interview Not Found</h2>
          <p className="text-gray-600 mb-8">The interview you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => router.push('/')}>Return Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-gray-900">Interview Ready</h1>
              <p className="text-gray-600">Your interview has been created successfully.</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-500">Position</p>
                  <p className="text-lg font-semibold text-gray-900">{interview.jobPosition}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-500">Duration</p>
                  <p className="text-lg font-semibold text-gray-900">{interview.duration} minutes</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-500">Type</p>
                  <p className="text-lg font-semibold text-gray-900 capitalize">{interview.type}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-500">Questions</p>
                  <p className="text-lg font-semibold text-gray-900">{interview.questionList?.length || 0} questions</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Button
                onClick={() => router.push(`/interview/${unwrappedParams.interview_id}/questions`)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg text-lg font-semibold transition-colors shadow-lg hover:shadow-xl"
              >
                Start Interview
              </Button>
              <Button
                onClick={() => router.push('/')}
                variant="outline"
                className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 py-3 rounded-lg text-lg font-semibold transition-colors"
              >
                Return Home
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}