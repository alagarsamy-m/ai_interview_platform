import { Phone, Video } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

const CreateOptions = () => {
  const router = useRouter()

  const handlePhoneScreening = () => {
    toast.info('Phone screening feature coming soon!')
  }

  return (
    <div className='grid grid-cols-2 gap-5'>
      <Link 
        href={'/dashboard/create-interview'} 
        className='bg-white border-gray-200 rounded-lg p-5 flex flex-col gap-2 cursor-pointer hover:shadow-md transition-shadow'
      >
        <Video className="p-3 text-primary bg-blue-50 rounded-lg h-12 w-12" />
        <h2 className='font-bold'>Create New Interview</h2>
        <p className='text-gray-500'>Create AI Interviews and schedule them with Candidates</p>
      </Link>
      <button 
        onClick={handlePhoneScreening}
        className='bg-white border-gray-200 rounded-lg p-5 flex flex-col gap-2 cursor-pointer hover:shadow-md transition-shadow text-left'
      >
        <Phone className="p-3 text-primary bg-blue-50 rounded-lg h-12 w-12" />
        <h2 className='font-bold'>Create Phone Screening Call</h2>
        <p className='text-gray-500'>Schedule phone screening call with candidates</p>
      </button>
    </div>
  )
}

export default CreateOptions