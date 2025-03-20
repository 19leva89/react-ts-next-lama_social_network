import { Comment as CommentType, User } from '@prisma/client'

import { prisma } from '@/lib/prisma'
import { CommentsList } from '@/components/shared/feed/comments'

interface Props {
	postId: number
}

export type FeedCommentType = CommentType & {
	user: User
} & {
	likes: { userId: string }[]
}

export const Comments = async ({ postId }: Props) => {
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
