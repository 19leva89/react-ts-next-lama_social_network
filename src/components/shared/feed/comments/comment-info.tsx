'use client'

import Image from 'next/image'

interface Props {
	commentId: number
	openCommentId: number | null
	toggleMenu: (commentId: number) => void
	deleteCommentWithId: (commentId: number) => Promise<void>
}

export const CommentInfo = ({ commentId, openCommentId, toggleMenu, deleteCommentWithId }: Props) => {
	return (
		<div className='relative'>
			<Image
				src='/img/more.png'
				alt='more'
				width={26}
				height={26}
				onClick={() => toggleMenu(commentId)}
				className='hover:border-opacity-80 size-6 cursor-pointer rounded-md border border-transparent p-1 transition-all duration-200 hover:rounded-md hover:border-gray-600 hover:opacity-80'
				loading='lazy'
			/>
			{openCommentId === commentId && (
				<div className='absolute top-5 right-5 z-30 flex w-32 flex-col gap-2 rounded-lg bg-white p-4 text-xs shadow-lg'>
					<span className='cursor-pointer'>View</span>

					<span className='cursor-pointer'>Re-post</span>

					<form action={() => deleteCommentWithId(commentId)}>
						<button type='submit' className='cursor-pointer text-red-500'>
							Delete
						</button>
					</form>
				</div>
			)}
		</div>
	)
}
