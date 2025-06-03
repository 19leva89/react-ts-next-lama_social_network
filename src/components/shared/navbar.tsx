import Link from 'next/link'
import Image from 'next/image'
import { ClerkLoaded, ClerkLoading, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'

import { MobileMenu } from '@/components/shared'

export const Navbar = () => {
	return (
		<div className='flex h-24 items-center justify-between'>
			{/* LEFT */}
			<div className='w-[20%] md:hidden lg:block'>
				<Link href='/' className='text-xl font-bold text-blue-600'>
					DIMASOCIAL
				</Link>
			</div>

			{/* CENTER */}
			<div className='hidden w-[50%] items-center justify-between text-sm md:flex'>
				{/* LINKS */}
				<div className='flex gap-6 text-gray-600'>
					<Link
						href='/'
						className='flex cursor-pointer items-center gap-2 transition-transform duration-300 ease-in-out hover:scale-110'
					>
						<Image
							src='/img/home.png'
							alt='home page'
							width={16}
							height={16}
							className='size-4'
							loading='lazy'
						/>
						<span>Homepage</span>
					</Link>

					<Link
						href='/'
						className='flex cursor-pointer items-center gap-2 transition-transform duration-300 ease-in-out hover:scale-110'
					>
						<Image
							src='/img/friends.png'
							alt='friends'
							width={16}
							height={16}
							className='size-4'
							loading='lazy'
						/>
						<span>Friends</span>
					</Link>

					<Link
						href='/'
						className='flex cursor-pointer items-center gap-2 transition-transform duration-300 ease-in-out hover:scale-110'
					>
						<Image
							src='/img/stories.png'
							alt='stories'
							width={16}
							height={16}
							className='size-4'
							loading='lazy'
						/>
						<span>Stories</span>
					</Link>
				</div>

				<div className='hidden items-center rounded-xl bg-slate-100 p-2 xl:flex'>
					<input type='text' placeholder='search...' className='bg-transparent outline-hidden' />
					<Image
						src='/img/search.png'
						alt='search'
						width={14}
						height={14}
						className='cursor-pointer transition-transform duration-300 ease-in-out hover:scale-125'
						loading='lazy'
					/>
				</div>
			</div>

			{/* RIGHT */}
			<div className='flex w-[30%] items-center justify-end gap-4 xl:gap-8'>
				<ClerkLoading>
					<div className='text-surface inline-block size-4 animate-spin rounded-full border-2 border-solid border-gray-500 border-e-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white' />
				</ClerkLoading>

				<ClerkLoaded>
					<SignedIn>
						<div className='cursor-pointer transition-transform duration-300 ease-in-out hover:scale-125'>
							<Image src='/img/people.png' alt='people' width={24} height={24} loading='lazy' />
						</div>

						<div className='cursor-pointer transition-transform duration-300 ease-in-out hover:scale-125'>
							<Image src='/img/messages.png' alt='messages' width={20} height={20} loading='lazy' />
						</div>

						<div className='cursor-pointer transition-transform duration-300 ease-in-out hover:scale-125'>
							<Image src='/img/notifications.png' alt='notifications' width={20} height={20} loading='lazy' />
						</div>

						<UserButton />
					</SignedIn>

					<SignedOut>
						<div className='flex items-center gap-2 text-sm'>
							<Link href='/sign-in'>
								<Image src='/img/login.png' alt='login' width={20} height={20} loading='lazy' />
							</Link>

							<Link href='/sign-in'>Login/Register</Link>
						</div>
					</SignedOut>
				</ClerkLoaded>

				<MobileMenu />
			</div>
		</div>
	)
}
