'use client'

import Link from 'next/link'
import { useState } from 'react'

export const MobileMenu = () => {
	const [isOpen, setIsOpen] = useState<boolean>(false)

	return (
		<div className='md:hidden'>
			<div onClick={() => setIsOpen((prev) => !prev)} className='flex cursor-pointer flex-col gap-[4.5px]'>
				<div
					className={`h-1 w-6 origin-left rounded-sm bg-blue-500 duration-500 ease-in-out ${
						isOpen ? 'rotate-45' : ''
					}`}
				/>

				<div
					className={`h-1 w-6 rounded-xs bg-blue-500 duration-500 ease-in-out ${isOpen ? 'opacity-0' : ''}`}
				/>

				<div
					className={`h-1 w-6 origin-left rounded-sm bg-blue-500 duration-500 ease-in-out ${
						isOpen ? '-rotate-45' : ''
					}`}
				/>
			</div>

			{isOpen && (
				<div className='absolute top-24 left-0 z-10 flex h-[calc(100vh-96px)] w-full flex-col items-center justify-center gap-8 bg-white text-xl font-medium'>
					<Link href='/'>Home</Link>
					<Link href='/'>Friends</Link>
					<Link href='/'>Groups</Link>
					<Link href='/'>Stories</Link>
					<Link href='/'>Login</Link>
				</div>
			)}
		</div>
	)
}
