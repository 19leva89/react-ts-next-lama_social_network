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
		<div className='flex flex-col gap-4 rounded-lg bg-white p-4 text-sm shadow-md'>
			{/* TOP */}
			<div className='flex items-center justify-between font-medium'>
				<span className='text-gray-500'>Friend Requests</span>

				<Link
					href='/'
					className='hover:border-opacity-80 rounded-md border border-transparent p-1 text-xs text-blue-500 transition-all duration-200 hover:rounded-md hover:border-blue-500 hover:opacity-80'
				>
					See all
				</Link>
			</div>

			{/* USER */}
			<FriendRequestList requests={requests} />
		</div>
	)
}
