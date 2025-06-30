'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import React from 'react';

export default function InterviewComplete({ params }) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [transcript, setTranscript] = useState(null);
  const unwrappedParams = React.use(params);

  useEffect(() => {
    const fetchTranscript = async () => {
      try {
        const { data, error } = await supabase
          .from('interviews')
          .select('answers, jobPosition')
          .eq('interview_id', unwrappedParams.interview_id)
          .single();

        if (error) {
          throw error;
        }

        if (!data) {
          setTranscript(null);
          return;
        }

        setTranscript(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load interview transcript.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTranscript();
  }, [unwrappedParams.interview_id, toast]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading interview transcript...</p>
        </div>
      </div>
    );
  }

  if (!transcript || !transcript.answers) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Transcript Not Found</h1>
          <p className="text-gray-600 mb-4">The interview transcript is not available.</p>
          <Button onClick={() => router.push('/')}>Return Home</Button>
        </div>
      </div>
    );
  }

  const conversationSegments = Object.entries(transcript.answers)
    .filter(([key]) => key.startsWith('conversation_segment_'))
    .sort(([a], [b]) => {
      const aNum = parseInt(a.split('_')[2]);
      const bNum = parseInt(b.split('_')[2]);
      return aNum - bNum;
    });

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Interview Complete</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Interview Details</h2>
            <p className="text-gray-600">Position: {transcript.jobPosition || 'Not specified'}</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Conversation Transcript</h2>
            <div className="space-y-3 max-h-96 overflow-y-auto border border-gray-200 rounded-lg p-4">
              {conversationSegments.length === 0 ? (
                <p className="text-gray-500 italic">No conversation recorded.</p>
              ) : (
                conversationSegments.map(([key, message], index) => (
                  <div key={key} className="mb-3">
                    <div className={`inline-block px-4 py-2 rounded-lg ${
                      message.startsWith('user:') 
                        ? 'bg-blue-500 text-white ml-auto' 
                        : 'bg-gray-200 text-gray-800'
                    }`}>
                      <strong>{message.startsWith('user:') ? 'You' : 'AI'}:</strong> {message.split(': ')[1]}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="text-center">
          <Button
            size="lg"
            onClick={() => router.push('/')}
            className="w-full max-w-md"
          >
            Return Home
          </Button>
        </div>
      </div>
    </div>
  );
} 