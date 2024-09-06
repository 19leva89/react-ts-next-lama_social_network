'use client'

import { useOptimistic, useState } from 'react'
import { switchLikeForPost } from '@/lib/actions'
import { useAuth } from '@clerk/nextjs'

import Image from 'next/image'

type PostInteractionProps = {
	postId: number
	likes: string[]
	commentNumber: number
	userId: string
}

const PostInteraction = ({ postId, likes, commentNumber, userId: postUserId }: PostInteractionProps) => {
	const { isLoaded, userId } = useAuth()
	const [likeState, setLikeState] = useState({
		likeCount: likes.length,
		isLiked: userId ? likes.includes(userId) : false,
	})

	const [optimisticLike, switchOptimisticLike] = useOptimistic(likeState, (state) => {
		return {
			likeCount: state.isLiked ? state.likeCount - 1 : state.likeCount + 1,
			isLiked: !state.isLiked,
		}
	})

	const likeAction = async () => {
		// If the user tries to like his own comment, do nothing
		if (postUserId === userId) {
			return
		}

		switchOptimisticLike('')

		try {
			await switchLikeForPost(postId)

			setLikeState((state) => ({
				likeCount: state.isLiked ? state.likeCount - 1 : state.likeCount + 1,
				isLiked: !state.isLiked,
			}))
		} catch (err) {
			setLikeState(likeState)
		}
	}

	return (
		<div className="flex items-center justify-between text-sm my-4">
			<div className="flex gap-8">
				<div className="flex items-center gap-4 bg-slate-50 p-2 rounded-xl">
					<form action={likeAction}>
						<button>
							<Image
								src={optimisticLike.isLiked ? '/liked.png' : '/like.png'}
								width={16}
								height={16}
								alt="like"
								className="cursor-pointer transition-transform duration-300 ease-in-out hover:scale-125"
							/>
						</button>
					</form>

					<span className="text-gray-300">|</span>

					<span className="text-gray-500">
						{optimisticLike.likeCount || 0}
						<span className="hidden md:inline"> Likes</span>
					</span>
				</div>

				<div className="flex items-center gap-4 bg-slate-50 p-2 rounded-xl">
					<Image
						src="/comment.png"
						width={16}
						height={16}
						alt="comment"
						className="cursor-pointer transition-transform duration-300 ease-in-out hover:scale-125"
					/>

					<span className="text-gray-300">|</span>

					<span className="text-gray-500">
						{commentNumber}
						<span className="hidden md:inline"> Comments</span>
					</span>
				</div>
			</div>

			<div className="flex items-center gap-4 bg-slate-50 p-2 rounded-xl">
				<Image
					src="/share.png"
					width={16}
					height={16}
					alt="share"
					className="cursor-pointer transition-transform duration-300 ease-in-out hover:scale-125"
				/>

				<span className="text-gray-300">|</span>

				<span className="text-gray-500">
					<span className="hidden md:inline"> Share</span>
				</span>
			</div>
		</div>
	)
}

export default PostInteraction
