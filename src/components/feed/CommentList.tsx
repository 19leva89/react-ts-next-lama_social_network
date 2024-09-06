// 'use client'

// import { useOptimistic, useState } from 'react'
// import { useAuth } from '@clerk/nextjs'
// import { deleteComment, switchLikeForComment } from '@/lib/actions'

// import Link from 'next/link'
// import { FeedCommentType } from './Comments'

// import Image from 'next/image'
// import LikeButton from '../LikeButton'

// const CommentList = ({ comments }: { comments: FeedCommentType[] }) => {
// 	const { isLoaded, userId } = useAuth()
// 	const [commentList, setCommentList] = useState(comments)
// 	const [openCommentId, setOpenCommentId] = useState<number | null>(null) // Для хранения ID открытого комментария

// 	const toggleMenu = (commentId: number) => {
// 		setOpenCommentId((prevId) => (prevId === commentId ? null : commentId)) // Переключение открытия
// 	}

// 	const [likeState, setLikeState] = useState(
// 		comments.map(({ id, likes }) => ({
// 			id,
// 			likeCount: likes.length,
// 			isLiked: userId ? likes.some((like) => like.userId === userId) : false,
// 		})),
// 	)

// 	const [optimisticLike, switchOptimisticLike] = useOptimistic(likeState, (state, id) => {
// 		return state.map((item) => {
// 			if (item.id === id) {
// 				return {
// 					...item,
// 					likeCount: item.isLiked ? item.likeCount - 1 : item.likeCount + 1,
// 					isLiked: !item.isLiked,
// 				}
// 			}
// 			return item
// 		})
// 	})

// 	const likeAction = async (commentId: number) => {
// 		// If the user tries to like his own comment, do nothing
// 		if (comments.find((comment) => comment.id === commentId)?.userId === userId) {
// 			return
// 		}

// 		switchOptimisticLike(commentId)

// 		try {
// 			await switchLikeForComment(commentId)

// 			setLikeState((prevState) =>
// 				prevState.map((item) => {
// 					if (item.id === commentId) {
// 						return {
// 							...item,
// 							likeCount: item.isLiked ? item.likeCount - 1 : item.likeCount + 1,
// 							isLiked: !item.isLiked,
// 						}
// 					}
// 					return item
// 				}),
// 			)
// 		} catch (err) {
// 			setLikeState(likeState)
// 		}
// 	}

// 	const handleDeleteComment = async (commentId: number) => {
// 		try {
// 			const response = await deleteComment(commentId)

// 			if (response.success) {
// 				// Удаляем комментарий из состояния
// 				setCommentList((prevComments) => prevComments.filter((comment) => comment.id !== commentId))
// 			} else {
// 				console.error(response.error || 'Failed to delete comment')
// 			}
// 		} catch (err) {
// 			console.error('Error deleting comment:', err)
// 		}
// 	}

// 	return (
// 		<div className="">
// 			{/* COMMENT */}
// 			{comments.map(({ id, user, desc }) => {
// 				const likeInfo = optimisticLike.find((like) => like.id === id)

// 				return (
// 					<div className="flex gap-4 justify-between mt-3 p-3 bg-slate-100 rounded-lg" key={id}>
// 						{/* AVATAR */}
// 						<Link href={`/profile/${user.username}`}>
// 							<Image
// 								src={user.avatar || 'noAvatar.png'}
// 								alt="avatar"
// 								width={40}
// 								height={40}
// 								className="w-10 h-10 rounded-full transition-transform duration-300 ease-in-out cursor-pointer hover:scale-110 hover:shadow-lg hover:shadow-gray-600/50"
// 							/>
// 						</Link>

// 						{/* DESC */}
// 						<div className="flex flex-col gap-2 flex-1">
// 							<div>
// 								<Link href={`/profile/${user.username}`}>
// 									<span className="font-medium hover:text-blue-500 opacity-80 hover:opacity-100 transition duration-200">
// 										{user.name && user.surname ? `${user.name} ${user.surname}` : user.username}
// 									</span>
// 								</Link>
// 							</div>

// 							<p>{desc}</p>

// 							<div className="flex items-center gap-8 text-xs text-gray-500 mt-2">
// 								<div className="flex items-center gap-4">
// 									<LikeButton isLiked={likeInfo?.isLiked} likeAction={() => likeAction(id)} />

// 									<span className="text-gray-300">|</span>

// 									<span className="text-gray-500">
// 										{likeInfo?.likeCount || 0}
// 										<span className="hidden md:inline"> Likes</span>
// 									</span>
// 								</div>

// 								<div>Reply</div>
// 							</div>
// 						</div>

// 						{/* ICON */}
// 						{userId === user.id && (
// 							<div className="relative">
// 								<Image
// 									src="/more.png"
// 									alt="more"
// 									width={26}
// 									height={26}
// 									onClick={() => toggleMenu(id)}
// 									className="cursor-pointer w-6 h-6 p-1 border border-transparent rounded-md hover:opacity-80 hover:border-gray-600 hover:rounded-md hover:border-opacity-80 transition-all duration-200"
// 								/>
// 								{openCommentId === id && (
// 									<div className="absolute top-5 right-5 bg-white p-4 w-32 rounded-lg flex flex-col gap-2 text-xs shadow-lg z-30">
// 										<span className="cursor-pointer">View</span>

// 										<span className="cursor-pointer">Re-post</span>

// 										<form action={() => handleDeleteComment(id)}>
// 											<button type="submit" className="text-red-500">
// 												Delete
// 											</button>
// 										</form>
// 									</div>
// 								)}
// 							</div>
// 						)}
// 					</div>
// 				)
// 			})}
// 		</div>
// 	)
// }

// export default CommentList
