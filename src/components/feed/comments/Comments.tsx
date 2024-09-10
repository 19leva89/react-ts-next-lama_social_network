import prisma from '@/lib/client'
import { Comment as CommentType, User } from '@prisma/client'

import CommentsList from './CommentsList'

export type FeedCommentType = CommentType & {
	user: User
} & {
	likes: { userId: string }[]
}

const Comments = async ({ postId }: { postId: number }) => {
	const comments = await prisma.comment.findMany({
		where: {
			postId,
		},
		include: {
			user: true,
			likes: {
				select: {
					userId: true,
				},
			},
		},
	})

	return (
		<div>
			<CommentsList postId={postId} comments={comments} />
		</div>
	)
}

export default Comments
