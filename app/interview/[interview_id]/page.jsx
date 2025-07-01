'use client'
import React, { useContext, useEffect, useState } from 'react'
import Image from 'next/image'
import { Clock, Loader2Icon, Video } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { supabase } from '@/services/supabaseClient'
import { useRouter, useParams } from 'next/navigation'
import { toast } from 'sonner'
import { InterviewDataContext } from '@/context/InterviewDataContext'

function Interview() {
    const { interview_id } = useParams();
    const [interviewData, setInterviewData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userName, setUserName] = useState('');
    const {interviewInfo,setInterviewInfo}=useContext(InterviewDataContext)
    const router=useRouter();
    

    useEffect(() => {
        interview_id && GetInterviewDetails();
    }, [interview_id])
    const GetInterviewDetails = async () => {
        setLoading(true)
        try {
            let { data: Interviews, error } = await supabase
                .from('interviews')
                .select("jobPosition,jobDescription,duration,type")
                .eq('interview_id', interview_id)
            setInterviewData(Interviews[0]);
            if(Interviews?.length==0){
                toast('Incorrect Interview Link')
            }
            setLoading(false)
        } catch (e) {
            setLoading(false)
            toast('Incorrect Interview Link')
        }
    }

    const onJoinInterview= async()=> {
        setLoading(true)
        let { data: Interviews, error } = await supabase
        .from('interviews')
        .select('*')
        .eq('interview_id',interview_id)

        if (error) {
           console.error('Supabase error fetching interview for join:', error);
           toast.error('Failed to join interview. Please try again.');
           setLoading(false);
           return;
        }

        if (!Interviews || Interviews.length === 0) {
           console.warn('No interview data found for onJoinInterview', interview_id);
           toast.error('Interview not found or invalid. Please check the link.');
           setLoading(false);
           return;
        }
        
        setInterviewInfo({
            userName: userName,
            interviewData: Interviews[0]
        })
        router.push('/interview/'+interview_id+'/start')
        setLoading(false)
    }


    const params = useParams();

    useEffect(() => {
        if (params?.interview_id) {
            fetchInterviewData();
        } else {
            setError('Invalid interview link');
            setLoading(false);
        }
    }, [params?.interview_id]);

    const fetchInterviewData = async () => {
        try {
            const { data: interviews, error } = await supabase
                .from('interviews')
                .select('*')
                .eq('interview_id', params.interview_id)
                .single();

            if (error) {
                console.error('Error fetching interview data:', error);
                setError('Failed to load interview data');
                setLoading(false);
                return;
            }

            if (!interviews) {
                setError('Interview not found');
                setLoading(false);
                return;
            }

            setInterviewData(interviews);
            setLoading(false);
        } catch (error) {
            console.error('Unexpected error:', error);
            setError('An unexpected error occurred');
            setLoading(false);
        }
    };

    const handleStartInterview = () => {
        if (!candidateName.trim()) {
            toast.error('Please enter your name');
            return;
        }
        // Store candidate name and proceed to questions
        localStorage.setItem('candidateName', candidateName);
        router.push(`/interview/${params.interview_id}/questions`);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading interview...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-red-500">Error</h2>
                    <p className="text-gray-500 mt-2">{error}</p>
                    <Button
                        className="mt-4"
                        onClick={() => router.push('/')}
                    >
                        Return to Home
                    </Button>
                </div>
            </div>
        );
    }

    if (!interviewData) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-red-500">Interview Not Found</h2>
                    <p className="text-gray-500 mt-2">The interview link may be invalid or expired.</p>
                    <Button
                        className="mt-4"
                        onClick={() => router.push('/')}
                    >
                        Return to Home
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className='flex flex-col items-center justify-center w-full min-h-screen p-4'>
            <div className='w-full max-w-4xl border rounded-lg bg-white p-6 flex flex-col items-center'>
                <Image src={'/logo.png'} alt='logo' width={200} height={100}
                className='w-[140px] mx-auto' />
                <h2 className='mt-4 text-xl font-semibold text-center'>AI-Powered Interview Platform</h2>
                <Image src={'/Interview.png'} alt="interview"
                width={500}
                height={500}
                className='w-[280px] my-6 mx-auto' />
                <h2 className='font-bold text-xl text-center'>{interviewData?.jobPosition}</h2>
                <h2 className='flex gap-2 items-center text-gray-500 mt-3 text-center'>
                    <Clock className='h-4 w-4' />
                    {interviewData?.duration}
                </h2>
                <div className='w-full mt-6'>
                    <h2 className='font-medium mb-2'>Enter your Full Name</h2>
                    <Input
                        placeholder='e.g. Arun Kumar'
                        value={userName}
                        onChange={(event) => setUserName(event.target.value)}
                    />
                    <div>
                        <h2>Before you begin</h2>
                        <ul>
                            <li>Test you camera and microphone</li>
                            <li>Ensure you have a suitable internet connection</li>
                            <li>Find a Quiet place for interview</li>

                        </ul>
                    </div>
                    <Button
                        className='w-full mt-4 font-bold'
                        disabled={loading || !userName }
                        onClick={()=> onJoinInterview()}
                    ><Video /> {loading && <Loader2Icon />} 
                        Join Interview
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default Interview