import { auth } from '@clerk/nextjs/server'
import prisma from '@/lib/client'

import Post from './post/Post'

const Feed = async ({ username }: { username?: string }) => {
	const { userId } = auth()

	let posts: any[] = []

	if (username) {
		posts = await prisma.post.findMany({
			where: {
				user: {
					username: username,
				},
			},
			include: {
				user: true,
				likes: {
					select: {
						userId: true,
					},
				},
				_count: {
					select: {
						comments: true,
					},
				},
			},
			orderBy: {
				createdAt: 'desc',
			},
		})
	}

	if (!username && userId) {
		const following = await prisma.follower.findMany({
			where: {
				followerId: userId,
			},
			select: {
				followingId: true,
			},
		})

		const followingIds = following.map((f) => f.followingId)
		const ids = [userId, ...followingIds]

		posts = await prisma.post.findMany({
			where: {
				userId: {
					in: ids,
				},
			},
			include: {
				user: true,
				likes: {
					select: {
						userId: true,
					},
				},
				_count: {
					select: {
						comments: true,
					},
				},
			},
			orderBy: {
				createdAt: 'desc',
			},
		})
	}

	return (
		<div className="bg-white rounded-lg">
			<div className="bg-slate-100 flex flex-col gap-8">
				{posts.length ? posts.map((post) => <Post key={post.id} post={post} />) : 'No posts found!'}
			</div>
		</div>
	)
}

export default Feed
