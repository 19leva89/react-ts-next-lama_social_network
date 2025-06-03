'use server'

import { auth } from '@clerk/nextjs/server'

import { prisma } from '@/lib/prisma'
import { StoryList } from '@/components/shared'

export const Stories = async () => {
	const { userId: currentUserId } = await auth()

	if (!currentUserId) return null

	const followingIds = await prisma.follower
		.findMany({
			where: { followingId: currentUserId },
			select: { followerId: true },
		})
		.then((followers) => followers.map((f) => f.followerId))

	const stories = await prisma.story.findMany({
		where: {
			expiresAt: {
				gt: new Date(),
			},
			OR: [{ userId: currentUserId }, { userId: { in: followingIds } }],
		},
		include: {
			user: true,
		},
	})

	return (
		<div className='scrollbar-hide overflow-scroll rounded-lg bg-white p-4 text-xs shadow-md'>
			<div className='flex w-max gap-8'>
				<StoryList stories={stories} userId={currentUserId} />
			</div>
		</div>
	)
}
