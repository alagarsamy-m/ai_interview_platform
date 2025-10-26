'use client'

//fonts style

import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export default function GeistProvider({ children }) {
  return (
    <div className={`${inter.variable} font-sans`}>
      {children}
    </div>
  )
} 