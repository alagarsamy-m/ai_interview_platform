'use client'

import React, { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from "@/components/ui/use-toast";
import { FaCopy, FaEnvelope, FaWhatsapp, FaLinkedin } from 'react-icons/fa';

export default function ShareInterview({ params }) {
    const router = useRouter();
    const { toast } = useToast();
    const unwrappedParams = use(params);
    const [interviewLink, setInterviewLink] = useState('');

    useEffect(() => {
        if (unwrappedParams.interview_id) {
            // Construct the interview link
            // Assuming the base URL is the current origin
            const origin = typeof window !== 'undefined' ? window.location.origin : '';
            setInterviewLink(`${origin}/interview/${unwrappedParams.interview_id}/questions`);
        }
    }, [unwrappedParams.interview_id]);

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(interviewLink);
            toast({
                title: "Copied!",
                description: "Interview link copied to clipboard.",
            });
        } catch (err) {
            console.error('Failed to copy link:', err);
            toast({
                title: "Error",
                description: "Failed to copy link. Please try manually.",
                variant: "destructive",
            });
        }
    };

    const handleShareEmail = () => {
        const subject = encodeURIComponent('Your AI Interview Link');
        const body = encodeURIComponent(`Hello,\n\nPlease use the following link to start your AI interview: ${interviewLink}\n\nGood luck!`);
        window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
    };

    const handleShareWhatsApp = () => {
        const text = encodeURIComponent(`Hello! Here is your AI interview link: ${interviewLink}. Good luck!`);
        window.open(`https://wa.me/?text=${text}`, '_blank');
    };

    const handleShareLinkedIn = () => {
        // LinkedIn share URL for a post
        const url = encodeURIComponent(interviewLink);
        const title = encodeURIComponent('AI Interview Opportunity!');
        const summary = encodeURIComponent('Exciting AI-powered interview for a job role. Click the link to start!');
        // You might need to refine this based on LinkedIn's precise sharing API if a direct message is desired
        window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}&summary=${summary}`, '_blank');
    };

    if (!unwrappedParams.interview_id) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="text-center space-y-6 p-8 bg-white rounded-xl shadow-lg max-w-md">
                    <h2 className="text-2xl font-semibold text-gray-800">Link Not Found</h2>
                    <p className="text-gray-600">The interview link could not be generated. Please try creating a new interview.</p>
                    <Button 
                        onClick={() => router.push('/interview/create')}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                    >
                        Create New Interview
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl p-8 space-y-8 text-center">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold text-gray-900">Interview Created!</h1>
                        <p className="text-gray-600">Share this link with your candidate to start the AI-powered voice interview.</p>
                    </div>

                    <div className="space-y-4">
                        <label className="block text-sm font-medium text-gray-700">Interview Link</label>
                        <div className="flex items-center space-x-2">
                            <Input
                                type="text"
                                value={interviewLink}
                                readOnly
                                className="flex-grow px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-800"
                            />
                            <Button
                                onClick={handleCopyLink}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                            >
                                <FaCopy />
                                <span>Copy</span>
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Button
                            onClick={handleShareEmail}
                            className="bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg flex items-center justify-center space-x-2 transition-colors shadow-sm"
                        >
                            <FaEnvelope />
                            <span>Email</span>
                        </Button>
                        <Button
                            onClick={handleShareWhatsApp}
                            className="bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg flex items-center justify-center space-x-2 transition-colors shadow-sm"
                        >
                            <FaWhatsapp />
                            <span>WhatsApp</span>
                        </Button>
                        <Button
                            onClick={handleShareLinkedIn}
                            className="bg-blue-800 hover:bg-blue-900 text-white py-3 rounded-lg flex items-center justify-center space-x-2 transition-colors shadow-sm"
                        >
                            <FaLinkedin />
                            <span>LinkedIn</span>
                        </Button>
                        <Button
                            onClick={() => router.push('/')}
                            variant="outline"
                            className="border-gray-300 text-gray-700 hover:bg-gray-50 py-3 rounded-lg flex items-center justify-center space-x-2 transition-colors shadow-sm"
                        >
                            Return Home
                        </Button>
                    </div>

                    <p className="text-sm text-gray-500 mt-4">
                        Note: Opening the generated link will start the AI-powered voice interview.
                    </p>
                </div>
            </div>
        </div>
    );
} 