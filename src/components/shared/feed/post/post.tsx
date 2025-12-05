'use server'

import { Suspense } from 'react'

import Link from 'next/link'
import Image from 'next/image'
import { auth } from '@clerk/nextjs/server'

import { Post as PostType, User } from '@/generated/prisma/client'
import { Comments } from '@/components/shared/feed/comments/comments'
import { PostActions, PostInfo } from '@/components/shared/feed/post'

interface Props {
	post: FeedPostType
}

type FeedPostType = PostType & { user: User } & {
	likes: [{ userId: string }]
} & {
	_count: { comments: number }
}

export const Post = async ({ post }: Props) => {
	const { userId } = await auth()

	return (
		<div className='flex flex-col gap-4 rounded-lg bg-white p-4'>
			{/* USER */}
			<div className='flex items-center justify-between'>
				<div className='flex items-center gap-4'>
					<Link href={`/profile/${post.user.username}`}>
						<Image
							src={post.user.avatar || '/img/no-avatar.png'}
							width={40}
							height={40}
							alt='avatar'
							className='size-10 cursor-pointer rounded-full transition-transform duration-300 ease-in-out hover:scale-110 hover:shadow-lg hover:shadow-gray-600/50'
							loading='lazy'
						/>
					</Link>

					<Link href={`/profile/${post.user.username}`}>
						<span className='font-medium opacity-80 transition duration-200 hover:text-blue-500 hover:opacity-100'>
							{post.user.name && post.user.surname
								? post.user.name + ' ' + post.user.surname
								: post.user.username}
						</span>
					</Link>
				</div>

				{userId === post.user.id && <PostInfo postId={post.id} />}
			</div>

			{/* DESC */}
			<div className='flex flex-col gap-4'>
				{post.img && (
					<div className='relative min-h-96 w-full'>
						<Image
							src={post.img}
							fill
							className='rounded-md object-cover'
							alt='post img'
							sizes='(max-width: 640px) 100vw, (max-width: 768px) 75vw, 50vw'
							loading='lazy'
						/>
					</div>
				)}

				<p>{post.desc}</p>
			</div>

			{/* ACTIONS */}
			<Suspense fallback='Loading...'>
				<PostActions
					postId={post.id}
					userId={post.user.id}
					likes={post.likes.map((like) => like.userId)}
					commentNumber={post._count.comments}
				/>
			</Suspense>

			<Suspense fallback='Loading...'>
				<Comments postId={post.id} />
			</Suspense>
		</div>
	)
}
