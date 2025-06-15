'use client'
import React, { useEffect, useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
// Removed Textarea as it's no longer needed for voice interface
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { useToast } from "@/components/ui/use-toast"
import { use } from 'react'
import Vapi from '@vapi-ai/web';

const VAPI_PUBLIC_API_KEY = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY;

export default function InterviewQuestions({ params }) {
    const router = useRouter();
    const { toast } = useToast();
    const [interview, setInterview] = useState(null);
    const [loading, setLoading] = useState(true);
    const unwrappedParams = use(params);

    const [vapi, setVapi] = useState(null);
    const [isVapiConnected, setIsVapiConnected] = useState(false);
    const [transcript, setTranscript] = useState([]);
    const [currentSpeaker, setCurrentSpeaker] = useState('');

    const currentQuestionIndex = useRef(0);
    const interviewQuestions = useRef([]);

    useEffect(() => {
        if (!VAPI_PUBLIC_API_KEY) {
            console.error("VAPI_PUBLIC_API_KEY is not set. Please set it in your .env.local file.");
            toast({
                title: "Error",
                description: "Vapi API key not configured.",
                variant: "destructive",
            });
            return;
        }

        const vapiInstance = new Vapi(VAPI_PUBLIC_API_KEY);
        setVapi(vapiInstance);

        vapiInstance.on('speech-start', () => {
            console.log('Speech started');
        });
        vapiInstance.on('speech-end', () => {
            console.log('Speech ended');
        });
        vapiInstance.on('volume-level', (volume) => {
            // console.log('Volume level:', volume);
        });
        vapiInstance.on('call-start', () => {
            setIsVapiConnected(true);
            toast({
                title: "Interview Started",
                description: "Vapi AI assistant is ready to ask questions.",
            });
        });
        vapiInstance.on('call-end', () => {
            setIsVapiConnected(false);
            toast({
                title: "Interview Ended",
                description: "Vapi AI assistant has disconnected.",
            });
            handleSubmit();
        });
        vapiInstance.on('message', (message) => {
            console.log('Vapi message:', message);
            if (message.type === 'transcript') {
                setTranscript(prev => [...prev, { speaker: message.role === 'assistant' ? 'ai' : 'user', text: message.transcript }]);
                setCurrentSpeaker(message.role === 'assistant' ? 'ai' : 'user');
            } else if (message.type === 'call-status' && message.status === 'connected') {
                // This might indicate the initial connection successful
            }
        });
        vapiInstance.on('error', (e) => {
            console.error('Vapi error:', e);
            // Log additional details if available, e.g., from network response
            if (e.response) {
                console.error('Vapi error response data:', e.response.data);
                console.error('Vapi error response status:', e.response.status);
                console.error('Vapi error response headers:', e.response.headers);
            } else if (e.request) {
                console.error('Vapi error request:', e.request);
            } else {
                console.error('Vapi error message:', e.message);
                console.error('Vapi error JSON:', JSON.stringify(e, null, 2));
            }
            toast({
                title: "Vapi Error",
                description: e.message || "An error occurred with the Vapi assistant.",
                variant: "destructive",
            });
            setIsVapiConnected(false);
        });

        return () => {
            if (vapiInstance) {
                vapiInstance.stop();
            }
        };
    }, [toast]);

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

                let parsedQuestionList;
                try {
                    parsedQuestionList = typeof data.questionList === 'string' 
                        ? JSON.parse(data.questionList) 
                        : data.questionList;
                    
                    if (!Array.isArray(parsedQuestionList)) {
                        console.error('questionList is not an array:', parsedQuestionList);
                        parsedQuestionList = [];
                    }
                } catch (parseError) {
                    console.error('Error parsing questionList:', parseError);
                    parsedQuestionList = [];
                }

                const parsedData = {
                    ...data,
                    questionList: parsedQuestionList
                };

                setInterview(parsedData);
                interviewQuestions.current = parsedQuestionList;

            } catch (error) {
                console.error('Error fetching interview:', error);
                toast({
                    title: "Error",
                    description: "Failed to load interview details. Please try again.",
                    variant: "destructive",
                });
                router.push('/');
            } finally {
                setLoading(false);
            }
        };

        fetchInterview();
    }, [unwrappedParams.interview_id, router, toast]);

    const startCall = async () => {
        if (vapi && !isVapiConnected) {
            try {
                const assistantConfig = {
                    model: {
                        provider: "openai",
                        modelId: "gpt-3.5-turbo",
                        systemPrompt: `You are an interview assistant. The user is a candidate for ${interview?.jobPosition || 'a role'}. You need to ask questions from the following list sequentially: ${interviewQuestions.current.map(q => q.question).join('\n')}. After each user response, provide brief feedback or acknowledge, then ask the next question. Do not ask all questions at once. Start with the first question from the list.`,
                    },
                    voice: {
                        provider: "vapi",
                        voiceId: "mia-20",
                    },
                };
                
                console.log('Vapi assistantConfig being sent:', JSON.stringify(assistantConfig, null, 2));
                await vapi.start(assistantConfig);
                setTranscript([]);
                currentQuestionIndex.current = 0;
            } catch (e) {
                console.error("Error starting Vapi call:", e);
                toast({
                    title: "Error",
                    description: "Failed to start AI interview. Please try again.",
                    variant: "destructive",
                });
            }
        }
    };

    const stopCall = () => {
        if (vapi && isVapiConnected) {
            vapi.stop();
            toast({
                title: "Interview Stopped",
                description: "You have ended the AI interview.",
            });
            handleSubmit();
        }
    };

    const handleSubmit = async () => {
        try {
            if (transcript.length === 0) {
                toast({
                    title: "Info",
                    description: "No conversation recorded to submit.",
                    variant: "info",
                });
                router.push(`/interview/${unwrappedParams.interview_id}/complete`);
                return;
            }

            const answers = transcript.reduce((acc, msg, index) => {
                acc[`conversation_segment_${index}`] = `${msg.speaker}: ${msg.text}`;
                return acc;
            }, {});

            console.log('Submitting answers (transcript):', {
                interview_id: unwrappedParams.interview_id,
                answers: answers
            });

            const { data, error } = await supabase
                .from('interviews')
                .update({
                    answers: answers,
                    status: 'completed',
                    updated_at: new Date().toISOString()
                })
                .eq('interview_id', unwrappedParams.interview_id)
                .select()
                .single();

            if (error) {
                console.error('Supabase Error Details (transcript submission):', {
                    message: error.message,
                    details: error.details,
                    hint: error.hint,
                    code: error.code
                });
                throw new Error(error.message || 'Failed to save interview transcript');
            }

            if (!data) {
                console.error('No data returned from transcript update operation');
                throw new Error('Failed to save interview transcript - no data returned');
            }

            console.log('Successfully updated interview with transcript:', data);

            toast({
                title: "Success",
                description: "Your interview transcript has been saved!",
            });

            router.push(`/interview/${unwrappedParams.interview_id}/complete`);
        } catch (error) {
            console.error('Error submitting transcript:', error);
            toast({
                title: "Error",
                description: error.message || "Failed to save interview transcript. Please try again.",
                variant: "destructive",
            });
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="text-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <h2 className="text-2xl font-semibold text-gray-800">Loading interview...</h2>
                </div>
            </div>
        );
    }

    if (!interview) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="text-center space-y-6 p-8 bg-white rounded-xl shadow-lg max-w-md">
                    <h2 className="text-2xl font-semibold text-gray-800">Interview Not Found</h2>
                    <p className="text-gray-600">The interview you're looking for doesn't exist or has been removed.</p>
                    <Button 
                        onClick={() => router.push('/')}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                    >
                        Return Home
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl p-8 space-y-8">
                    <div className="border-b pb-6">
                        <h1 className="text-3xl font-bold text-gray-900">AI Voice Interview</h1>
                        <p className="mt-2 text-gray-600">Interact with the AI assistant. Click "Start Call" to begin.</p>
                        <p className={`mt-2 text-sm font-medium ${isVapiConnected ? 'text-green-600' : 'text-red-600'}`}>
                            Status: {isVapiConnected ? 'Connected' : 'Disconnected'}
                        </p>
                    </div>

                    <div className="flex justify-center space-x-4">
                        <Button
                            onClick={startCall}
                            disabled={isVapiConnected || !vapi}
                            className="bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg text-lg font-semibold transition-colors shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Start Call
                        </Button>
                        <Button
                            onClick={stopCall}
                            disabled={!isVapiConnected}
                            className="bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg text-lg font-semibold transition-colors shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            End Call
                        </Button>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-gray-900">Conversation Transcript</h2>
                        <div className="bg-gray-50 p-6 rounded-xl min-h-[300px] max-h-[500px] overflow-y-auto border border-gray-200">
                            {transcript.length === 0 ? (
                                <p className="text-gray-500 italic">No conversation yet. Start the call to begin!</p>
                            ) : (
                                transcript.map((msg, index) => (
                                    <div key={index} className={`mb-2 ${msg.speaker === 'user' ? 'text-right' : 'text-left'}`}>
                                        <span className={`inline-block px-4 py-2 rounded-lg ${msg.speaker === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                                            <strong>{msg.speaker === 'user' ? 'You' : 'AI'}:</strong> {msg.text}
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 