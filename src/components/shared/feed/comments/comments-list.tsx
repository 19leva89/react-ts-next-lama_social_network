'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useOptimistic, useState } from 'react'
import { useAuth, useUser } from '@clerk/nextjs'

import { LikeButton } from '@/components/shared/like-button'
import { CommentInfo } from '@/components/shared/feed/comments'
import { FeedCommentType } from '@/components/shared/feed/comments/comments'
import { addComment, deleteComment, switchLikeForComment } from '@/app/api/actions'

interface Props {
	postId: number
	comments: FeedCommentType[]
}

export const CommentsList = ({ postId, comments }: Props) => {
	const { user } = useUser()
	const { userId } = useAuth()

	const [desc, setDesc] = useState<string>('')
	const [commentState, setCommentState] = useState(comments)
	const [openCommentId, setOpenCommentId] = useState<number | null>(null)

	const [optimisticComments, addOptimisticComment] = useOptimistic(
		commentState,
		(state, value: FeedCommentType) => [value, ...state],
	)

	const [likeState, setLikeState] = useState(
		optimisticComments.map(({ id, likes }) => ({
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

	const toggleMenu = (commentId: number) => {
		setOpenCommentId((prevId) => (prevId === commentId ? null : commentId))
	}

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
		} catch {
			setLikeState(likeState)
		}
	}

	const deleteCommentWithId = async (commentId: number) => {
		try {
			const response = await deleteComment(commentId)

			if (response.success) {
				setCommentState((prevComments) => prevComments.filter((comment) => comment.id !== commentId))
			} else {
				console.error(response.error || 'Failed to delete comment')
			}
		} catch (err) {
			console.error('Error deleting comment:', err)
		}
	}

	const add = async () => {
		if (!user || !desc) return

		addOptimisticComment({
			id: Math.floor(Math.random() * 1000000),
			desc,
			createdAt: new Date(Date.now()),
			updatedAt: new Date(Date.now()),
			userId: user.id,
			postId: postId,
			user: {
				id: user.id,
				username: 'Sending Please Wait...',
				avatar: user.imageUrl || '/img/no-avatar.png',
				cover: '',
				description: '',
				name: '',
				surname: '',
				city: '',
				work: '',
				school: '',
				website: '',
				createdAt: new Date(Date.now()),
			},
			likes: [],
		})

		try {
			const createdComment = await addComment(postId, desc)

			setCommentState((prev) => [createdComment, ...prev])

			setDesc('')
		} catch (err) {
			console.error('Error adding comment:', err)
		}
	}

	return (
		<>
			<div className='flex items-center gap-4'>
				<Image
					src={user?.imageUrl || '/img/no-avatar.png'}
					alt='avatar'
					width={32}
					height={32}
					className='size-8 rounded-full'
					loading='lazy'
				/>

				<form
					action={add}
					className='flex w-full flex-1 items-center justify-between rounded-xl bg-slate-100 px-6 py-2 text-sm'
				>
					<input
						type='text'
						placeholder='Write a comment...'
						className='flex-1 bg-transparent outline-hidden'
						value={desc}
						onChange={(e) => setDesc(e.target.value)}
					/>

					<button type='submit'>
						<Image
							src='/img/emoji.png'
							alt='emoji'
							width={16}
							height={16}
							className='cursor-pointer'
							loading='lazy'
						/>
					</button>
				</form>
			</div>

			<div>
				{/* COMMENT */}
				{optimisticComments.map(({ id, user, desc }) => {
					const likeInfo = optimisticLike.find((like) => like.id === id)

					return (
						<div className='mt-3 flex justify-between gap-4 rounded-lg bg-slate-100 p-3' key={id}>
							{/* AVATAR */}
							<Link href={`/profile/${user.username}`}>
								<Image
									src={user.avatar || '/img/no-avatar.png'}
									alt='avatar'
									width={40}
									height={40}
									className='size-10 cursor-pointer rounded-full transition-transform duration-300 ease-in-out hover:scale-110 hover:shadow-lg hover:shadow-gray-600/50'
									loading='lazy'
								/>
							</Link>

							{/* DESC */}
							<div className='flex flex-1 flex-col gap-2'>
								<div>
									<Link href={`/profile/${user.username}`}>
										<span className='font-medium opacity-80 transition duration-200 hover:text-blue-500 hover:opacity-100'>
											{user.name && user.surname ? `${user.name} ${user.surname}` : user.username}
										</span>
									</Link>
								</div>

								<p>{desc}</p>

								<div className='mt-2 flex items-center gap-8 text-xs text-gray-500'>
									<div className='flex items-center gap-4'>
										<LikeButton isLiked={likeInfo?.isLiked} likeAction={() => likeAction(id)} />

										<span className='text-gray-300'>|</span>

										<span className='text-gray-500'>
											{likeInfo?.likeCount || 0}
											<span className='hidden md:inline'> Likes</span>
										</span>
									</div>

									<div>Reply</div>
								</div>
							</div>

							{/* ICON */}
							{userId === user.id && (
								<CommentInfo
									commentId={id}
									openCommentId={openCommentId}
									toggleMenu={toggleMenu}
									deleteCommentWithId={deleteCommentWithId}
								/>
							)}
						</div>
					)
				})}
			</div>
		</>
	)
}
