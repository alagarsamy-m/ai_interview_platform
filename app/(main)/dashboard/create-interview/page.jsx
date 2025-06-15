'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { toast } from 'react-hot-toast';

export default function CreateInterview() {
  const router = useRouter();
  const [supabase] = useState(() => createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ));
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    role: '',
    level: '',
    skills: '',
    numQuestions: 5
  });

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error || !session) {
        toast.error('Please sign in to create an interview');
        router.push('/auth/signin');
      }
    };
    checkAuth();
  }, [supabase, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Get current user
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      if (!session) {
        toast.error('Please sign in to create an interview');
        router.push('/auth/signin');
        return;
      }

      // Parse skills into array
      const skillsArray = formData.skills
        .split(',')
        .map(skill => skill.trim())
        .filter(skill => skill.length > 0);

      // Generate questions using OpenRouter
      const response = await fetch('/api/ai-model/generate-questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          role: formData.role,
          level: formData.level,
          skills: skillsArray,
          numQuestions: formData.numQuestions
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate questions');
      }

      const { questions } = await response.json();

      // Create interview in database
      const { data: interview, error: interviewError } = await supabase
        .from('interviews')
        .insert({
          user_id: session.user.id,
          role: formData.role,
          level: formData.level,
          skills: skillsArray,
          questions: questions,
          status: 'draft'
        })
        .select()
        .single();

      if (interviewError) throw interviewError;

      toast.success('Interview created successfully!');
      router.push(`/dashboard/interviews/${interview.id}`);
    } catch (error) {
      console.error('Error creating interview:', error);
      toast.error(error.message || 'Failed to create interview');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Create New Interview</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">
            Role
          </label>
          <input
            type="text"
            name="role"
            value={formData.role}
            onChange={handleChange}
            placeholder="e.g., Frontend Developer"
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Level
          </label>
          <select
            name="level"
            value={formData.level}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          >
            <option value="">Select Level</option>
            <option value="Junior">Junior</option>
            <option value="Mid-level">Mid-level</option>
            <option value="Senior">Senior</option>
            <option value="Lead">Lead</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Required Skills (comma-separated)
          </label>
          <input
            type="text"
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            placeholder="e.g., React, TypeScript, Node.js"
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Number of Questions
          </label>
          <input
            type="number"
            name="numQuestions"
            value={formData.numQuestions}
            onChange={handleChange}
            min="1"
            max="10"
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 rounded text-white ${
            loading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? 'Creating...' : 'Create Interview'}
        </button>
      </form>
    </div>
  );
} 