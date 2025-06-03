'use server'

import Link from 'next/link'
import Image from 'next/image'
import { auth } from '@clerk/nextjs/server'

import { prisma } from '@/lib/prisma'

export const ProfileCard = async () => {
	const { userId } = await auth()

	if (!userId) return null

	const user = await prisma.user.findFirst({
		where: {
			id: userId,
		},
		include: {
			_count: {
				select: {
					followers: true,
				},
			},
			followers: {
				include: {
					following: {
						select: {
							avatar: true,
							username: true,
						},
					},
				},
			},
		},
	})

	if (!user) return null

	return (
		<div className='flex flex-col gap-6 rounded-lg bg-white p-4 text-sm shadow-md'>
			<div className='relative h-20'>
				<Image
					src={user.cover || '/img/no-cover.png'}
					alt='cover'
					fill
					className='rounded-md object-cover'
					sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
					loading='lazy'
				/>

				<Image
					src={user.avatar || '/img/no-avatar.png'}
					alt='avatar'
					width={48}
					height={48}
					className='absolute right-0 -bottom-6 left-0 z-10 m-auto size-12 rounded-full object-cover ring-1 ring-white'
					sizes='(max-width: 640px) 10vw, 48px'
					loading='lazy'
				/>
			</div>

			<div className='flex h-20 flex-col items-center gap-2'>
				<span className='font-semibold'>
					{user.name && user.surname ? user.name + ' ' + user.surname : user.username}
				</span>

				<div className='flex items-center gap-4'>
					{user.followers && user.followers.length > 0 && (
						<div className='flex'>
							{user.followers.slice(0, 3).map(({ following }) => (
								<Image
									key={following.username}
									src={following.avatar || '/img/no-avatar.png'}
									alt={following.username}
									width={12}
									height={12}
									className='size-3 rounded-full object-cover'
									sizes='(max-width: 640px) 5vw, (max-width: 768px) 3vw, 2vw'
									loading='lazy'
								/>
							))}
						</div>
					)}

					<span className='text-xs text-gray-500'>{user._count.followers} Followers</span>
				</div>

				<Link href={`/profile/${user.username}`}>
					<button className='cursor-pointer rounded-md bg-blue-500 p-2 text-xs text-white transition-opacity duration-200 hover:opacity-80'>
						My Profile
					</button>
				</Link>
			</div>
		</div>
	)
}
