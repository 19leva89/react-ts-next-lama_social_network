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
		<div className="p-4 bg-white rounded-lg shadow-md text-sm flex flex-col gap-6">
			<div className="h-20 relative">
				<Image
					src={user.cover || '/img/no-cover.png'}
					alt="cover"
					fill
					className="rounded-md object-cover"
					sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
					loading="lazy"
				/>

				<Image
					src={user.avatar || '/img/no-avatar.png'}
					alt="avatar"
					width={48}
					height={48}
					className="rounded-full object-cover w-12 h-12 absolute left-0 right-0 m-auto -bottom-6 ring-1 ring-white z-10"
					sizes="(max-width: 640px) 10vw, 48px"
					loading="lazy"
				/>
			</div>

			<div className="h-20 flex flex-col gap-2 items-center">
				<span className="font-semibold">
					{user.name && user.surname ? user.name + ' ' + user.surname : user.username}
				</span>

				<div className="flex items-center gap-4">
					{user.followers && user.followers.length > 0 && (
						<div className="flex">
							{user.followers.slice(0, 3).map(({ following }) => (
								<Image
									key={following.username}
									src={following.avatar || '/img/no-avatar.png'}
									alt={following.username}
									width={12}
									height={12}
									className="rounded-full object-cover w-3 h-3"
									sizes="(max-width: 640px) 5vw, (max-width: 768px) 3vw, 2vw"
									loading="lazy"
								/>
							))}
						</div>
					)}

					<span className="text-xs text-gray-500">{user._count.followers} Followers</span>
				</div>

				<Link href={`/profile/${user.username}`}>
					<button className="bg-blue-500 text-white text-xs p-2 rounded-md cursor-pointer hover:opacity-80 transition-opacity duration-200">
						My Profile
					</button>
				</Link>
			</div>
		</div>
	)
}
