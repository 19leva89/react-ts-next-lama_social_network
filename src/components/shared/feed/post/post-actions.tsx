'use client'

import Image from 'next/image'
import { useAuth } from '@clerk/nextjs'
import { useOptimistic, useState } from 'react'

import { switchLikeForPost } from '@/app/api/actions'
import { LikeButton } from '@/components/shared/like-button'

interface Props {
	postId: number
	likes: string[]
	commentNumber: number
	userId: string
}

export const PostActions = ({ postId, likes, commentNumber, userId: postUserId }: Props) => {
	const { userId } = useAuth()

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
		} catch {
			setLikeState(likeState)
		}
	}

	return (
		<div className='my-4 flex items-center justify-between text-sm'>
			<div className='flex gap-8'>
				<div className='flex items-center gap-4 rounded-xl bg-slate-50 p-2'>
					<LikeButton isLiked={optimisticLike.isLiked} likeAction={() => likeAction()} />

					<span className='text-gray-300'>|</span>

					<span className='text-gray-500'>
						{optimisticLike.likeCount || 0}
						<span className='hidden md:inline'> Likes</span>
					</span>
				</div>

				<div className='flex items-center gap-4 rounded-xl bg-slate-50 p-2'>
					<Image
						src='/img/comment.png'
						width={16}
						height={16}
						alt='comment'
						className='cursor-pointer transition-transform duration-300 ease-in-out hover:scale-125'
						loading='lazy'
					/>

					<span className='text-gray-300'>|</span>

					<span className='text-gray-500'>
						{commentNumber}
						<span className='hidden md:inline'> Comments</span>
					</span>
				</div>
			</div>

			<div className='flex items-center gap-4 rounded-xl bg-slate-50 p-2'>
				<Image
					src='/img/share.png'
					width={16}
					height={16}
					alt='share'
					className='cursor-pointer transition-transform duration-300 ease-in-out hover:scale-125'
					loading='lazy'
				/>

				<span className='text-gray-300'>|</span>

				<span className='text-gray-500'>
					<span className='hidden md:inline'> Share</span>
				</span>
			</div>
		</div>
	)
}
