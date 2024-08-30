import { Suspense } from 'react'

import { Post as PostType, User } from '@prisma/client'
import { auth } from '@clerk/nextjs/server'

import Comments from './Comments'
import PostInfo from './PostInfo'
import PostInteraction from './PostInteraction'

import Image from 'next/image'

type FeedPostType = PostType & { user: User } & {
	likes: [{ userId: string }]
} & {
	_count: { comments: number }
}

const Post = ({ post }: { post: FeedPostType }) => {
	const { userId } = auth()

	return (
		<div className="flex flex-col gap-4 bg-white p-4 rounded-lg">
			{/* USER */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-4">
					<Image
						src={post.user.avatar || '/noAvatar.png'}
						width={40}
						height={40}
						alt="avatar"
						className="w-10 h-10 rounded-full transition-transform duration-300 ease-in-out hover:scale-110 hover:shadow-lg hover:shadow-gray-600/50"
					/>

					<span className="font-medium">
						{post.user.name && post.user.surname
							? post.user.name + ' ' + post.user.surname
							: post.user.username}
					</span>
				</div>

				{userId === post.user.id && <PostInfo postId={post.id} />}
			</div>

			{/* DESC */}
			<div className="flex flex-col gap-4">
				{post.img && (
					<div className="w-full min-h-96 relative">
						<Image src={post.img} fill className="object-cover rounded-md" alt="post img" />
					</div>
				)}

				<p>{post.desc}</p>
			</div>

			{/* INTERACTION */}
			<Suspense fallback="Loading...">
				<PostInteraction
					postId={post.id}
					likes={post.likes.map((like) => like.userId)}
					commentNumber={post._count.comments}
				/>
			</Suspense>

			<Suspense fallback="Loading...">
				<Comments postId={post.id} />
			</Suspense>
		</div>
	)
}

export default Post
