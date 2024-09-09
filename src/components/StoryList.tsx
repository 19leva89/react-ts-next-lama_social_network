'use client'

import { useOptimistic, useState } from 'react'
import { Story, User } from '@prisma/client'
import { addStory } from '@/lib/actions'
import { useUser } from '@clerk/nextjs'
import { CldUploadWidget } from 'next-cloudinary'

import Image from 'next/image'

type StoryWithUser = Story & {
	user: User
}

type StoryListProps = {
	stories: StoryWithUser[]
	userId: string
}

const StoryList = ({ stories, userId }: StoryListProps) => {
	const { isLoaded, user } = useUser()
	const [storyList, setStoryList] = useState(stories)
	const [img, setImg] = useState<any>()
	const [optimisticStories, addOptimisticStory] = useOptimistic(storyList, (state, value: StoryWithUser) => [
		value,
		...state,
	])

	const add = async () => {
		if (!img?.secure_url) return

		addOptimisticStory({
			id: Math.random(),
			img: img.secure_url,
			createdAt: new Date(Date.now()),
			expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
			userId: userId,
			user: {
				id: userId,
				username: 'Sending...',
				avatar: user?.imageUrl || '/noAvatar.png',
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
		})

		try {
			const createdStory = await addStory(img.secure_url)

			if (createdStory && 'id' in createdStory) {
				setStoryList((prev) => [createdStory, ...prev])
			}

			setImg(null)
		} catch (err) {
			console.error('Error while adding story:', err)
		}
	}

	if (!user && !isLoaded) return 'Loading...'
	if (!user && isLoaded) return null

	return (
		<>
			<CldUploadWidget
				uploadPreset="next-social"
				onSuccess={(result, { widget }) => {
					setImg(result.info)
					widget.close()
				}}
			>
				{({ open }) => {
					return (
						<div className="flex flex-col items-center gap-2 cursor-pointer relative transition-transform duration-300 ease-in-out hover:scale-110">
							<Image
								src={img?.secure_url || user?.imageUrl || '/noAvatar.png'}
								alt="avatar"
								width={80}
								height={80}
								className="w-20 h-20 rounded-full ring-2 object-cover"
								onClick={() => open()}
							/>

							{img ? (
								<form action={add}>
									<button className="text-xs bg-blue-500 p-1 rounded-md text-white disabled:bg-blue-300 disabled:cursor-not-allowed hover:opacity-80 transition-opacity duration-200">
										Send
									</button>
								</form>
							) : (
								<span onClick={() => open()} className="font-medium">
									Add a Story
								</span>
							)}

							<div onClick={() => open()} className="absolute text-6xl text-gray-200 top-1">
								+
							</div>
						</div>
					)
				}}
			</CldUploadWidget>

			{/* STORY */}
			{optimisticStories.map(({ id, user }) => (
				<div className="flex flex-col items-center gap-2 cursor-pointer" key={id}>
					<Image
						src={user.avatar || '/noAvatar.png'}
						alt="avatar"
						width={80}
						height={80}
						className="w-20 h-20 rounded-full ring-2"
					/>

					<span className="font-medium">{user.name || user.username}</span>
				</div>
			))}
		</>
	)
}

export default StoryList
