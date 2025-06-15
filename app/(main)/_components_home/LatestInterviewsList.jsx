'use client'
import { Button } from '@/components/ui/button';
import { Video } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { supabase } from '@/services/supabaseClient';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserDetailContext';
import { toast } from 'sonner';

const LatestInterviewsList = () => {
    const [interviewList, setInterviewList] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const { user } = useUser();

    useEffect(() => {
        if (user) {
            fetchInterviews();
        }
    }, [user]);

    const fetchInterviews = async () => {
        try {
            const { data, error } = await supabase
                .from('interviews')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(5);

            if (error) throw error;
            setInterviewList(data || []);
        } catch (error) {
            console.error('Error fetching interviews:', error);
            toast.error('Failed to load interviews');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className='my-5'>
                <h2 className='font-bold text-2xl'>Previously Created Interviews</h2>
                <div className='p-5 flex flex-col gap-3 items-center mt-5'>
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                    <p>Loading interviews...</p>
                </div>
            </div>
        );
    }

    return (
        <div className='my-5'>
            <h2 className='font-bold text-2xl'>Previously Created Interviews</h2>
            {interviewList.length === 0 ? (
                <div className='p-5 text-center text-gray-500'>
                    No interviews created yet
                </div>
            ) : (
                <div className='mt-5 space-y-4'>
                    {interviewList.map((interview) => (
                        <div key={interview.id} className='bg-white p-4 rounded-lg shadow'>
                            <div className='flex items-center justify-between'>
                                <div>
                                    <h3 className='font-semibold'>{interview.title}</h3>
                                    <p className='text-sm text-gray-500'>
                                        Created on {new Date(interview.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                                <Button
                                    onClick={() => router.push(`/interview/${interview.id}`)}
                                    className='flex items-center gap-2'
                                >
                                    <Video className='h-4 w-4' />
                                    View Interview
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LatestInterviewsList;