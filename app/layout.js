import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full w-full">
      <body className={`${inter.className} h-full w-full`}>
        <Providers>
          <main className="h-full w-full">
            {children}
            <Toaster />
          </main>
        </Providers>
      </body>
    </html>
  )
}
