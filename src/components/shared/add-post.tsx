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
		<div className="p-4 bg-white shadow-md rounded-lg flex gap-4 justify-between text-sm">
			{/* AVATAR */}
			<Image
				src={user?.imageUrl || '/img/no-avatar.png'}
				alt="avatar"
				width={48}
				height={48}
				className="size-12 object-cover rounded-full"
				loading="lazy"
			/>

			{/* POST */}
			<div className="flex-1">
				{img?.secure_url && (
					<div className="w-full min-h-96 relative mb-4">
						<Image
							src={img.secure_url}
							fill
							className="object-cover rounded-md"
							alt="post img"
							sizes="(max-width: 640px) 100vw, (max-width: 768px) 75vw, 50vw"
							loading="lazy"
						/>
					</div>
				)}

				{/* TEXT INPUT */}
				<form
					className="flex gap-4"
					onSubmit={(e) => {
						e.preventDefault()

						const formData = new FormData(e.target as HTMLFormElement)
						handleSubmit(formData)
					}}
				>
					<textarea
						placeholder="What's on your mind?"
						className="flex-1 bg-slate-100 rounded-lg p-2"
						name="desc"
						value={desc}
						onChange={(e) => setDesc(e.target.value)}
					/>

					<div>
						<Image
							src="/img/emoji.png"
							alt="emoji"
							width={20}
							height={20}
							className="size-5 cursor-pointer self-end"
							loading="lazy"
						/>

						<AddPostButton />
					</div>
				</form>

				{error && <div className="text-red-500 mt-2">{error}</div>}

				{/* POST OPTIONS */}
				<div className="flex items-center gap-4 mt-4 text-gray-400 flex-wrap">
					<CldUploadWidget
						uploadPreset="next-social"
						onSuccess={(result, { widget }) => {
							setImg(result.info)
							widget.close()
						}}
					>
						{({ open }) => {
							return (
								<div
									onClick={() => open()}
									className="flex items-center gap-2 cursor-pointer transition-transform duration-300 ease-in-out hover:scale-110"
								>
									<Image src="/img/add-image.png" alt="add image" width={20} height={20} loading="lazy" />
									Photo
								</div>
							)
						}}
					</CldUploadWidget>

					<div className="flex items-center gap-2 cursor-pointer transition-transform duration-300 ease-in-out hover:scale-110">
						<Image src="/img/add-video.png" alt="add video" width={20} height={20} loading="lazy" />
						Video
					</div>

					<div className="flex items-center gap-2 cursor-pointer transition-transform duration-300 ease-in-out hover:scale-110">
						<Image src="/img/poll.png" alt="poll" width={20} height={20} loading="lazy" />
						Poll
					</div>

					<div className="flex items-center gap-2 cursor-pointer transition-transform duration-300 ease-in-out hover:scale-110">
						<Image src="/img/add-event.png" alt="add event" width={20} height={20} loading="lazy" />
						Event
					</div>
				</div>
			</div>
		</div>
	)
}
