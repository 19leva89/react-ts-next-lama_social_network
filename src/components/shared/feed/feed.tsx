'use server'

import { auth } from '@clerk/nextjs/server'

import { prisma } from '@/lib/prisma'
import { Post } from '@/components/shared/feed/post'

interface Props {
	username?: string
}

export const Feed = async ({ username }: Props) => {
	const { userId } = await auth()

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
		<div className='rounded-lg bg-white'>
			<div className='flex flex-col gap-8 bg-slate-100'>
				{posts.length ? posts.map((post) => <Post key={post.id} post={post} />) : 'No posts found!'}
			</div>
		</div>
	)
}
