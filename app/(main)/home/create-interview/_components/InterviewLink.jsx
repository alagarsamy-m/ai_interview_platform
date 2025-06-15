import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft, Calendar, Check, Clock, Copy, List, Mail, Plus } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { toast } from 'sonner'

function InterviewLink({ interview_id, formData }) {
    const url = process.env.NEXT_PUBLIC_HOST_URL + '/' + interview_id
    const GetInterviewUrl = () => {
        return url;
    }

    const onCopyLink = async () => {
        await navigator.clipboard.writeText(url);
        toast("Link Copied")
    }

    return (
        <div className='flex flex-col items-center justify-center mt-10'>
            <div className='bg-green-500 rounded-full p-2 inline-flex items-center justify-center'>
                <Check className='text-white w-8 h-8' strokeWidth={3} />
            </div>
            <h2 className='font-bold text-lg mt-4'>Your AI Interview is Ready!</h2>
            <p className='mt-3'>Share this link with your candidates to start the interview process</p>
            <div className='w-full p-7 mt-6 rounded-lg bg-white flex flex-col'>
                <div className='flex justify-between items-center'>
                    <h2 className='font-bold'>
                        Interview Link
                    </h2>
                    <h2 className='p-1 px-2 text-primary bg-blue-50'>Valid for 30 Days  </h2>
                </div>
                <div className='mt-3 flex gap-3 items-center'>
                    <Input defaultValue={GetInterviewUrl()} disabled={true} />
                    <Button onClick={() => onCopyLink()}><Copy /> Copy Link</Button>
                </div>
                <hr className='my-7' />
                <div className='flex gap-5'>
                    <h2 className='text-sm text-gray-500 flex gap-2 items-center'><Clock className='h-4 w-4' /> {formData?.duration}</h2>
                    <h2 className='text-sm text-gray-500 flex gap-2 items-center'><List className='h-4 w-4' /> 10 Questions</h2>
                </div>
            </div>
            <div className='mt-7 bg-white p-5 rounded-lg w-full'>
                <h2 className='font-bold'>Share Via</h2>
                <div className='flex gap-7 mt-2'>
                    <div><Button variant={'outline'} className='w-full' ><Mail />Email</Button></div>
                    <div><Button variant={'outline'} className='w-full' ><Mail />Slack</Button></div>
                    <div><Button variant={'outline'} className='w-full'><Mail />Whatsapp</Button></div>
                </div>
            </div>
            <div className='flex w-full gap-5 justify-between mt-6'>
                <Link href='/dashboard' className='w-full'>
                    <Button variant={'outline'} className='w-full'><ArrowLeft className='mr-2' />Back to Dashboard</Button>
                </Link>
                <Link href='/dashboard/create-interview' className='w-full'>
                    <Button className='w-full'><Plus className='mr-2' />Create New Interview</Button>
                </Link>
            </div>
        </div>
    )
}

export default InterviewLink