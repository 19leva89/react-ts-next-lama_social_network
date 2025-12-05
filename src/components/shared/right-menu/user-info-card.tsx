'use server'

import Link from 'next/link'
import Image from 'next/image'
import { auth } from '@clerk/nextjs/server'

import { prisma } from '@/lib/prisma'
import { User } from '@/generated/prisma/client'
import { UpdateUser, UserInfoCardActions } from '@/components/shared/right-menu'

interface Props {
	user: User
}

export const UserInfoCard = async ({ user }: Props) => {
	const createdAtDate = new Date(user.createdAt)

	const formattedDate = createdAtDate.toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	})
	let isUserBlocked = false

	let isFollowing = false
	let isFollowingSent = false

	const { userId: currentUserId } = await auth()

	if (currentUserId) {
		const blockRes = await prisma.block.findFirst({
			where: {
				blockerId: currentUserId,
				blockedId: user.id,
			},
		})
		isUserBlocked = Boolean(blockRes)

		const followRes = await prisma.follower.findFirst({
			where: {
				followerId: currentUserId,
				followingId: user.id,
			},
		})
		isFollowing = Boolean(followRes)

		const followReqRes = await prisma.followRequest.findFirst({
			where: {
				senderId: currentUserId,
				receiverId: user.id,
			},
		})
		isFollowingSent = Boolean(followReqRes)
	}

	return (
		<div className='flex flex-col gap-4 rounded-lg bg-white p-4 text-sm shadow-md'>
			{/* TOP */}
			<div className='flex items-center justify-between font-medium'>
				<span className='text-gray-500'>User Information</span>

				{currentUserId === user.id ? (
					<UpdateUser user={user} />
				) : (
					<Link
						href='/'
						className='hover:border-opacity-80 rounded-md border border-transparent p-1 text-xs text-blue-500 transition-all duration-200 hover:rounded-md hover:border-blue-500 hover:opacity-80'
					>
						See all
					</Link>
				)}
			</div>

			{/* BOTTOM */}
			<div className='flex flex-col gap-4 text-gray-500'>
				<div className='flex items-center gap-2'>
					<span className='text-xl text-black'>
						{' '}
						{user.name && user.surname ? user.name + ' ' + user.surname : user.username}
					</span>

					<span className='text-sm'>@{user.username}</span>
				</div>

				{user.description && <p>{user.description}</p>}

				{user.city && (
					<div className='flex items-center gap-2'>
						<Image src='/img/map.png' alt='map' width={16} height={16} loading='lazy' />

						<span>
							Living in <b>{user.city}</b>
						</span>
					</div>
				)}

				{user.school && (
					<div className='flex items-center gap-2'>
						<Image src='/img/school.png' alt='school' width={16} height={16} loading='lazy' />

						<span>
							Went to <b>{user.school}</b>
						</span>
					</div>
				)}

				{user.work && (
					<div className='flex items-center gap-2'>
						<Image src='/img/work.png' alt='work' width={16} height={16} loading='lazy' />

						<span>
							Works at <b>{user.work}</b>
						</span>
					</div>
				)}

				{user.website && (
					<div className='flex items-center gap-2'>
						<Image src='/img/link.png' alt='link' width={16} height={16} loading='lazy' />

						<Link
							href={user.website}
							className='font-medium text-blue-500'
							target='_blank'
							rel='noopener noreferrer'
						>
							{user.website}
						</Link>
					</div>
				)}

				{user.createdAt && (
					<div className='flex items-center gap-2'>
						<Image src='/img/date.png' alt='date' width={16} height={16} loading='lazy' />

						<span>Joined {formattedDate}</span>
					</div>
				)}

				{currentUserId && currentUserId !== user.id && (
					<UserInfoCardActions
						userId={user.id}
						isUserBlocked={isUserBlocked}
						isFollowing={isFollowing}
						isFollowingSent={isFollowingSent}
					/>
				)}
			</div>
		</div>
	)
}
