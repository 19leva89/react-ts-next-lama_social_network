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
		<div className='relative'>
			<Image
				src='/img/more.png'
				alt='more'
				width={26}
				height={26}
				onClick={() => setOpen((prev) => !prev)}
				className='hover:border-opacity-80 cursor-pointer rounded-md border border-transparent p-1 transition-all duration-200 hover:rounded-md hover:border-gray-600 hover:opacity-80'
				loading='lazy'
			/>
			{open && (
				<div className='absolute top-5 right-5 z-30 flex w-32 flex-col gap-2 rounded-lg bg-white p-4 text-xs shadow-lg'>
					<span className='cursor-pointer'>View</span>

					<span className='cursor-pointer'>Re-post</span>

					<form onSubmit={deletePostWithId}>
						<button className='cursor-pointer text-red-500'>Delete</button>
					</form>
				</div>
			)}
		</div>
	)
}
