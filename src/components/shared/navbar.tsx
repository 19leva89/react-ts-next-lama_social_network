import Link from 'next/link'
import Image from 'next/image'
import { ClerkLoaded, ClerkLoading, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'

import { MobileMenu } from '@/components/shared'

export const Navbar = () => {
	return (
		<div className="h-24 flex items-center justify-between">
			{/* LEFT */}
			<div className="md:hidden lg:block w-[20%]">
				<Link href="/" className="font-bold text-xl text-blue-600">
					DIMASOCIAL
				</Link>
			</div>

			{/* CENTER */}
			<div className="hidden md:flex w-[50%] text-sm items-center justify-between">
				{/* LINKS */}
				<div className="flex gap-6 text-gray-600">
					<Link
						href="/"
						className="flex items-center gap-2 cursor-pointer transition-transform duration-300 ease-in-out hover:scale-110"
					>
						<Image
							src="/img/home.png"
							alt="home page"
							width={16}
							height={16}
							className="w-4 h-4"
							loading="lazy"
						/>
						<span>Homepage</span>
					</Link>

					<Link
						href="/"
						className="flex items-center gap-2 cursor-pointer transition-transform duration-300 ease-in-out hover:scale-110"
					>
						<Image
							src="/img/friends.png"
							alt="friends"
							width={16}
							height={16}
							className="w-4 h-4"
							loading="lazy"
						/>
						<span>Friends</span>
					</Link>

					<Link
						href="/"
						className="flex items-center gap-2 cursor-pointer transition-transform duration-300 ease-in-out hover:scale-110"
					>
						<Image
							src="/img/stories.png"
							alt="stories"
							width={16}
							height={16}
							className="w-4 h-4"
							loading="lazy"
						/>
						<span>Stories</span>
					</Link>
				</div>

				<div className="hidden xl:flex p-2 bg-slate-100 items-center rounded-xl">
					<input type="text" placeholder="search..." className="bg-transparent outline-hidden" />
					<Image
						src="/img/search.png"
						alt="search"
						width={14}
						height={14}
						className="cursor-pointer transition-transform duration-300 ease-in-out hover:scale-125"
						loading="lazy"
					/>
				</div>
			</div>

			{/* RIGHT */}
			<div className="w-[30%] flex items-center gap-4 xl:gap-8 justify-end">
				<ClerkLoading>
					<div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-gray-500 border-solid border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white" />
				</ClerkLoading>

				<ClerkLoaded>
					<SignedIn>
						<div className="cursor-pointer transition-transform duration-300 ease-in-out hover:scale-125">
							<Image src="/img/people.png" alt="people" width={24} height={24} loading="lazy" />
						</div>

						<div className="cursor-pointer transition-transform duration-300 ease-in-out hover:scale-125">
							<Image src="/img/messages.png" alt="messages" width={20} height={20} loading="lazy" />
						</div>

						<div className="cursor-pointer transition-transform duration-300 ease-in-out hover:scale-125">
							<Image src="/img/notifications.png" alt="notifications" width={20} height={20} loading="lazy" />
						</div>

						<UserButton />
					</SignedIn>

					<SignedOut>
						<div className="flex items-center gap-2 text-sm">
							<Link href="/sign-in">
								<Image src="/img/login.png" alt="login" width={20} height={20} loading="lazy" />
							</Link>

							<Link href="/sign-in">Login/Register</Link>
						</div>
					</SignedOut>
				</ClerkLoaded>

				<MobileMenu />
			</div>
		</div>
	)
}
