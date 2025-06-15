'use client'
import { InterviewDataContext } from '@/context/InterviewDataContext'
import React, { useState } from 'react'

function InterviewLayout({ children }) {
    const [interviewInfo,setInterviewInfo]=useState()
    return (
        <InterviewDataContext.Provider value={{interviewInfo,setInterviewInfo}}>



            <div className="min-h-screen bg-gray-100 flex flex-col">
                {children}
            </div>
        </InterviewDataContext.Provider>
    )
}

export default InterviewLayout