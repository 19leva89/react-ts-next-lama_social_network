'use server'

import Link from 'next/link'
import { auth } from '@clerk/nextjs/server'

import { prisma } from '@/lib/prisma'
import { FriendRequestList } from '@/components/shared/right-menu'

export const FriendRequests = async () => {
	const { userId } = await auth()

	if (!userId) return null

	const requests = await prisma.followRequest.findMany({
		where: {
			receiverId: userId,
		},
		include: {
			sender: true,
		},
	})

	if (requests.length === 0) return null

	return (
		<div className="p-4 bg-white rounded-lg shadow-md text-sm flex flex-col gap-4">
			{/* TOP */}
			<div className="flex justify-between items-center font-medium">
				<span className="text-gray-500">Friend Requests</span>

				<Link
					href="/"
					className="text-blue-500 text-xs p-1 border border-transparent rounded-md hover:opacity-80 hover:border-blue-500 hover:rounded-md hover:border-opacity-80 transition-all duration-200"
				>
					See all
				</Link>
			</div>

			{/* USER */}
			<FriendRequestList requests={requests} />
		</div>
	)
}
