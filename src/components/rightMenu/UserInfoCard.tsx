import prisma from '@/lib/client'
import Link from 'next/link'

import { auth } from '@clerk/nextjs/server'
import { User } from '@prisma/client'

import UserInfoCardActions from './UserInfoCardActions'
import UpdateUser from './UpdateUser'

import Image from 'next/image'

const UserInfoCard = async ({ user }: { user: User }) => {
	const createdAtDate = new Date(user.createdAt)

	const formattedDate = createdAtDate.toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	})

	let isUserBlocked = false
	let isFollowing = false
	let isFollowingSent = false

	const { userId: currentUserId } = auth()

	if (currentUserId) {
		const blockRes = await prisma.block.findFirst({
			where: {
				blockerId: currentUserId,
				blockedId: user.id,
			},
		})

		blockRes ? (isUserBlocked = true) : (isUserBlocked = false)
		const followRes = await prisma.follower.findFirst({
			where: {
				followerId: currentUserId,
				followingId: user.id,
			},
		})

		followRes ? (isFollowing = true) : (isFollowing = false)
		const followReqRes = await prisma.followRequest.findFirst({
			where: {
				senderId: currentUserId,
				receiverId: user.id,
			},
		})

		followReqRes ? (isFollowingSent = true) : (isFollowingSent = false)
	}

	return (
		<div className="p-4 bg-white rounded-lg shadow-md text-sm flex flex-col gap-4">
			{/* TOP */}
			<div className="flex justify-between items-center font-medium">
				<span className="text-gray-500">User Information</span>

				{currentUserId === user.id ? (
					<UpdateUser user={user} />
				) : (
					<Link
						href="/"
						className="text-blue-500 text-xs p-1 border border-transparent rounded-md hover:opacity-80 hover:border-blue-500 hover:rounded-md hover:border-opacity-80 transition-all duration-200"
					>
						See all
					</Link>
				)}
			</div>

			{/* BOTTOM */}
			<div className="flex flex-col gap-4 text-gray-500">
				<div className="flex items-center gap-2">
					<span className="text-xl text-black">
						{' '}
						{user.name && user.surname ? user.name + ' ' + user.surname : user.username}
					</span>

					<span className="text-sm">@{user.username}</span>
				</div>

				{user.description && <p>{user.description}</p>}

				{user.city && (
					<div className="flex items-center gap-2">
						<Image src="/map.png" alt="map" width={16} height={16} loading="lazy" />

						<span>
							Living in <b>{user.city}</b>
						</span>
					</div>
				)}

				{user.school && (
					<div className="flex items-center gap-2">
						<Image src="/school.png" alt="school" width={16} height={16} loading="lazy" />

						<span>
							Went to <b>{user.school}</b>
						</span>
					</div>
				)}

				{user.work && (
					<div className="flex items-center gap-2">
						<Image src="/work.png" alt="work" width={16} height={16} loading="lazy" />

						<span>
							Works at <b>{user.work}</b>
						</span>
					</div>
				)}

				{user.website && (
					<div className="flex items-center gap-2">
						<Image src="/link.png" alt="link" width={16} height={16} loading="lazy" />

						<Link
							href={user.website}
							className="text-blue-500 font-medium"
							target="_blank"
							rel="noopener noreferrer"
						>
							{user.website}
						</Link>
					</div>
				)}

				{user.createdAt && (
					<div className="flex items-center gap-2">
						<Image src="/date.png" alt="date" width={16} height={16} loading="lazy" />

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

export default UserInfoCard
