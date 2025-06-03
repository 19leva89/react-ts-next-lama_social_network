'use client'

import Image from 'next/image'
import { useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { CldUploadWidget } from 'next-cloudinary'

import { addPost } from '@/app/api/actions'
import { AddPostButton } from '@/components/shared'

export const AddPost = () => {
	const { isLoaded, user } = useUser()

	const [img, setImg] = useState<any>()
	const [desc, setDesc] = useState<string>('')
	const [error, setError] = useState<string | null>(null)

	const handleSubmit = async (formData: FormData) => {
		setError(null)

		const result = await addPost(formData, img?.secure_url || '')

		if (!result.success) {
			setError(result.error || 'An unexpected error occurred')

			if (result.error) {
				console.log(result.error)
			}

			if (result.warning) {
				console.log(result.warning)
			}
		} else {
			setDesc('')
		}

		setDesc('')
		setImg('')
	}

	if (!isLoaded) {
		return 'Loading...'
	}

	return (
		<div className='flex justify-between gap-4 rounded-lg bg-white p-4 text-sm shadow-md'>
			{/* AVATAR */}
			<Image
				src={user?.imageUrl || '/img/no-avatar.png'}
				alt='avatar'
				width={48}
				height={48}
				className='size-12 rounded-full object-cover'
				loading='lazy'
			/>

			{/* POST */}
			<div className='flex-1'>
				{img?.secure_url && (
					<div className='relative mb-4 min-h-96 w-full'>
						<Image
							src={img.secure_url}
							fill
							className='rounded-md object-cover'
							alt='post img'
							sizes='(max-width: 640px) 100vw, (max-width: 768px) 75vw, 50vw'
							loading='lazy'
						/>
					</div>
				)}

				{/* TEXT INPUT */}
				<form
					className='flex gap-4'
					onSubmit={(e) => {
						e.preventDefault()

						const formData = new FormData(e.target as HTMLFormElement)
						handleSubmit(formData)
					}}
				>
					<textarea
						placeholder="What's on your mind?"
						className='flex-1 rounded-lg bg-slate-100 p-2'
						name='desc'
						value={desc}
						onChange={(e) => setDesc(e.target.value)}
					/>

					<div>
						<Image
							src='/img/emoji.png'
							alt='emoji'
							width={20}
							height={20}
							className='size-5 cursor-pointer self-end'
							loading='lazy'
						/>

						<AddPostButton />
					</div>
				</form>

				{error && <div className='mt-2 text-red-500'>{error}</div>}

				{/* POST OPTIONS */}
				<div className='mt-4 flex flex-wrap items-center gap-4 text-gray-400'>
					<CldUploadWidget
						uploadPreset='next-social'
						onSuccess={(result, { widget }) => {
							setImg(result.info)
							widget.close()
						}}
					>
						{({ open }) => {
							return (
								<div
									onClick={() => open()}
									className='flex cursor-pointer items-center gap-2 transition-transform duration-300 ease-in-out hover:scale-110'
								>
									<Image src='/img/add-image.png' alt='add image' width={20} height={20} loading='lazy' />
									Photo
								</div>
							)
						}}
					</CldUploadWidget>

					<div className='flex cursor-pointer items-center gap-2 transition-transform duration-300 ease-in-out hover:scale-110'>
						<Image src='/img/add-video.png' alt='add video' width={20} height={20} loading='lazy' />
						Video
					</div>

					<div className='flex cursor-pointer items-center gap-2 transition-transform duration-300 ease-in-out hover:scale-110'>
						<Image src='/img/poll.png' alt='poll' width={20} height={20} loading='lazy' />
						Poll
					</div>

					<div className='flex cursor-pointer items-center gap-2 transition-transform duration-300 ease-in-out hover:scale-110'>
						<Image src='/img/add-event.png' alt='add event' width={20} height={20} loading='lazy' />
						Event
					</div>
				</div>
			</div>
		</div>
	)
}
