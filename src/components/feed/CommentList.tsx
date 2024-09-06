'use client'

import { useOptimistic, useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import { switchLikeForComment } from '@/lib/actions'

import Link from 'next/link'
import { FeedCommentType } from './Comments'

import Image from 'next/image'

const CommentList = ({ comments }: { comments: FeedCommentType[] }) => {
	const { isLoaded, userId } = useAuth()

	const [likeState, setLikeState] = useState(
		comments.map(({ id, likes }) => ({
			id,
			likeCount: likes.length,
			isLiked: userId ? likes.some((like) => like.userId === userId) : false,
		})),
	)

	const [optimisticLike, switchOptimisticLike] = useOptimistic(likeState, (state, id) => {
		return state.map((item) => {
			if (item.id === id) {
				return {
					...item,
					likeCount: item.isLiked ? item.likeCount - 1 : item.likeCount + 1,
					isLiked: !item.isLiked,
				}
			}
			return item
		})
	})

	const likeAction = async (commentId: number) => {
		// If the user tries to like his own comment, do nothing
		if (comments.find((comment) => comment.id === commentId)?.userId === userId) {
			return
		}

		switchOptimisticLike(commentId)

		try {
			await switchLikeForComment(commentId)

			setLikeState((prevState) =>
				prevState.map((item) => {
					if (item.id === commentId) {
						return {
							...item,
							likeCount: item.isLiked ? item.likeCount - 1 : item.likeCount + 1,
							isLiked: !item.isLiked,
						}
					}
					return item
				}),
			)
		} catch (err) {
			setLikeState(likeState)
		}
	}

	return (
		<div>
			{comments.map((comment) => {
				const likeInfo = optimisticLike.find((like) => like.id === comment.id)

				return (
					<div className="flex gap-4 justify-between mt-3 p-3 bg-slate-100 rounded-lg" key={comment.id}>
						{/* AVATAR */}
						<Link href={`/profile/${comment.user.username}`}>
							<Image
								src={comment.user.avatar || 'noAvatar.png'}
								alt="avatar"
								width={40}
								height={40}
								className="w-10 h-10 rounded-full transition-transform duration-300 ease-in-out cursor-pointer hover:scale-110 hover:shadow-lg hover:shadow-gray-600/50"
							/>
						</Link>

						{/* DESC */}
						<div className="flex flex-col gap-2 flex-1">
							<Link href={`/profile/${comment.user.username}`}>
								<span className="font-medium hover:text-blue-500 opacity-80 hover:opacity-100 transition duration-200">
									{comment.user.name && comment.user.surname
										? `${comment.user.name} ${comment.user.surname}`
										: comment.user.username}
								</span>
							</Link>

							<p>{comment.desc}</p>

							<div className="flex items-center gap-8 text-xs text-gray-500 mt-2">
								<div className="flex items-center gap-4">
									<form action={() => likeAction(comment.id)}>
										<button>
											<Image
												src={likeInfo?.isLiked ? '/liked.png' : '/like.png'}
												alt="like"
												width={12}
												height={12}
												className="cursor-pointer w-4 h-4 transition-transform duration-300 ease-in-out hover:scale-125"
											/>
										</button>
									</form>

									<span className="text-gray-300">|</span>

									<span className="text-gray-500">
										{likeInfo?.likeCount || 0}
										<span className="hidden md:inline"> Likes</span>
									</span>
								</div>

								<div>Reply</div>
							</div>
						</div>

						{/* ICON */}
						<Image src="/more.png" alt="more" width={16} height={16} className="cursor-pointer w-4 h-4" />
					</div>
				)
			})}
		</div>
	)
}

export default CommentList
