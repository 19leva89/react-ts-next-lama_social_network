import type { Metadata } from 'next'
import { PropsWithChildren } from 'react'
import { ClerkProvider } from '@clerk/nextjs'
import { Analytics } from '@vercel/analytics/next'

import { Navbar } from '@/components/shared/navbar'

import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
	title: 'Social Media',
	description: 'Social media app',
}

export default function RootLayout({ children }: PropsWithChildren) {
	return (
		<ClerkProvider>
			<html lang='en'>
				<body className={inter.className}>
					<div className='w-full bg-white px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64'>
						<Navbar />
					</div>

					<div className='bg-slate-100 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64'>{children}</div>

					{/* Allow track page views for Vercel */}
					<Analytics />
				</body>
			</html>
		</ClerkProvider>
	)
}
