'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

export default function InterviewComplete({ params }) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const { data, error } = await supabase
          .from('interview_responses')
          .select('*')
          .eq('interview_id', params.interview_id)
          .single();

        if (error) throw error;
        setFeedback(data.feedback);
      } catch (error) {
        console.error('Error fetching feedback:', error);
        toast({
          title: "Error",
          description: "Failed to load interview feedback.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, [params.interview_id, toast]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading interview feedback...</p>
        </div>
      </div>
    );
  }

  if (!feedback) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Feedback Not Found</h1>
          <p className="text-gray-600 mb-4">The interview feedback is not available.</p>
          <Button onClick={() => router.push('/')}>Return Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Interview Complete</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">Overall Assessment</h2>
              <p className="text-gray-600">{feedback.overallAssessment}</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">Strengths</h2>
              <ul className="list-disc list-inside text-gray-600">
                {feedback.strengths.map((strength, index) => (
                  <li key={index}>{strength}</li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">Areas for Improvement</h2>
              <ul className="list-disc list-inside text-gray-600">
                {feedback.areasForImprovement.map((area, index) => (
                  <li key={index}>{area}</li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">Technical Knowledge</h2>
              <p className="text-gray-600">{feedback.technicalKnowledge}</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">Communication Skills</h2>
              <p className="text-gray-600">{feedback.communicationSkills}</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">Final Recommendation</h2>
              <p className="text-gray-600">{feedback.finalRecommendation}</p>
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