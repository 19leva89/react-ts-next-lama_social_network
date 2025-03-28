'use client'

import Image from 'next/image'
import { useState } from 'react'

import { deletePost } from '@/app/api/actions'

interface Props {
	postId: number
}

export const PostInfo = ({ postId }: Props) => {
	const [open, setOpen] = useState<boolean>(false)

	const deletePostWithId = deletePost.bind(null, postId)

	return (
		<div className="relative">
			<Image
				src="/img/more.png"
				alt="more"
				width={26}
				height={26}
				onClick={() => setOpen((prev) => !prev)}
				className="cursor-pointer p-1 border border-transparent rounded-md hover:opacity-80 hover:border-gray-600 hover:rounded-md hover:border-opacity-80 transition-all duration-200"
				loading="lazy"
			/>
			{open && (
				<div className="absolute top-5 right-5 bg-white p-4 w-32 rounded-lg flex flex-col gap-2 text-xs shadow-lg z-30">
					<span className="cursor-pointer">View</span>

					<span className="cursor-pointer">Re-post</span>

					<form onSubmit={deletePostWithId}>
						<button className="text-red-500 cursor-pointer">Delete</button>
					</form>
				</div>
			)}
		</div>
	)
}
