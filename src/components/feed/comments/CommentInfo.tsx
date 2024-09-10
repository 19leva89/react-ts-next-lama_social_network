'use client'

import Image from 'next/image'

type CommentActionsProps = {
	commentId: number
	openCommentId: number | null
	toggleMenu: (commentId: number) => void
	deleteCommentWithId: (commentId: number) => Promise<void>
}

const CommentInfo = ({ commentId, openCommentId, toggleMenu, deleteCommentWithId }: CommentActionsProps) => {
	return (
		<div className="relative">
			<Image
				src="/more.png"
				alt="more"
				width={26}
				height={26}
				onClick={() => toggleMenu(commentId)}
				className="cursor-pointer w-6 h-6 p-1 border border-transparent rounded-md hover:opacity-80 hover:border-gray-600 hover:rounded-md hover:border-opacity-80 transition-all duration-200"
				loading="lazy"
			/>
			{openCommentId === commentId && (
				<div className="absolute top-5 right-5 bg-white p-4 w-32 rounded-lg flex flex-col gap-2 text-xs shadow-lg z-30">
					<span className="cursor-pointer">View</span>

					<span className="cursor-pointer">Re-post</span>

					<form action={() => deleteCommentWithId(commentId)}>
						<button type="submit" className="text-red-500">
							Delete
						</button>
					</form>
				</div>
			)}
		</div>
	)
}

export default CommentInfo
