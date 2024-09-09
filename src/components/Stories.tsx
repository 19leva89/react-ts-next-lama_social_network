import { auth } from '@clerk/nextjs/server'
import prisma from '@/lib/client'

import StoryList from './StoryList'

const Stories = async () => {
	const { userId: currentUserId } = auth()

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
		<div className="p-4 bg-white rounded-lg shadow-md overflow-scroll text-xs scrollbar-hide">
			<div className="flex gap-8 w-max">
				<StoryList stories={stories} userId={currentUserId} />
			</div>
		</div>
	)
}

export default Stories
