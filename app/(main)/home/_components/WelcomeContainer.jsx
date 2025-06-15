'use client'
import React from 'react'
import { useUser } from '@/context/UserDetailContext'

const WelcomeContainer = () => {
  const { user } = useUser();

  return (
    <div className='w-full p-7 rounded-lg bg-white'>
      <h2 className='text-2xl font-bold'>Welcome back, {user?.name || 'User'}!</h2>
      <p className='text-gray-500 mt-2'>Here's what's happening with your interviews today.</p>
    </div>
  )
}

export default WelcomeContainer 