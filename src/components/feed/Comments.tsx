import prisma from '@/lib/client'
import { Comment as CommentType, User } from '@prisma/client'

import AddComment from '../AddComment'

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
			<AddComment postId={postId} comments={comments} />
		</div>
	)
}

export default Comments
