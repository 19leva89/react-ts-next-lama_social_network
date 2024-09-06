'use client'

import { useOptimistic, useState } from 'react'

import { useUser } from '@clerk/nextjs'
import { addComment } from '@/lib/actions'

import { FeedCommentType } from './feed/Comments'

import Image from 'next/image'
import CommentList from './feed/CommentList'

type AddCommentProps = {
	postId: number
	comments: FeedCommentType[]
}

const AddComment = ({ postId, comments }: AddCommentProps) => {
	const { user } = useUser()
	const [desc, setDesc] = useState('')
	const [commentState, setCommentState] = useState(comments)

	const [optimisticComments, addOptimisticComment] = useOptimistic(
		commentState,
		(state, value: FeedCommentType) => [value, ...state],
	)

	const add = async () => {
		if (!user || !desc) return

		const comment = {
			id: Math.random(),
			desc,
			createdAt: new Date(Date.now()),
			updatedAt: new Date(Date.now()),
			userId: user.id,
			postId: postId,
			user: {
				id: user.id,
				username: 'Sending Please Wait...',
				avatar: user.imageUrl || '/noAvatar.png',
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
		}

		addOptimisticComment(comment)

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
			<div className="flex items-center gap-4">
				<Image
					src={user?.imageUrl || '/noAvatar.png'}
					alt="avatar"
					width={32}
					height={32}
					className="w-8 h-8 rounded-full"
				/>

				<form
					action={add}
					className="flex-1 flex items-center justify-between bg-slate-100 rounded-xl text-sm px-6 py-2 w-full"
				>
					<input
						type="text"
						placeholder="Write a comment..."
						className="bg-transparent outline-none flex-1"
						value={desc}
						onChange={(e) => setDesc(e.target.value)}
					/>

					<button type="submit">
						<Image src="/emoji.png" alt="emoji" width={16} height={16} className="cursor-pointer" />
					</button>
				</form>
			</div>

			<CommentList comments={optimisticComments} />
		</>
	)
}

export default AddComment
