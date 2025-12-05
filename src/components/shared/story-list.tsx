'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useUser } from '@clerk/nextjs'
import { useOptimistic, useState } from 'react'
import { CldUploadWidget } from 'next-cloudinary'

import { addStory } from '@/app/api/actions'
import { Story, User } from '@/generated/prisma/client'

type StoryWithUser = Story & {
	user: User
}

interface Props {
	stories: StoryWithUser[]
	userId: string
}

export const StoryList = ({ stories, userId }: Props) => {
	const { isLoaded, user } = useUser()
	const [img, setImg] = useState<any>()
	const [storyList, setStoryList] = useState(stories)
	const [optimisticStories, addOptimisticStory] = useOptimistic(storyList, (state, value: StoryWithUser) => [
		value,
		...state,
	])

	const add = async () => {
		if (!img.secure_url) return

		addOptimisticStory({
			id: Math.random(),
			img: img.secure_url,
			createdAt: new Date(Date.now()),
			expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
			userId: userId,
			user: {
				id: userId,
				username: 'Sending...',
				avatar: user?.imageUrl || '/img/no-avatar.png',
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
				uploadPreset='next-social'
				onSuccess={(result, { widget }) => {
					setImg(result.info)
					widget.close()
				}}
			>
				{({ open }) => {
					return (
						<div className='relative flex cursor-pointer flex-col items-center gap-2 transition-transform duration-300 ease-in-out hover:scale-110'>
							<Image
								src={img?.secure_url || user?.imageUrl || '/img/no-avatar.png'}
								alt='avatar'
								width={80}
								height={80}
								className='size-20 rounded-full object-cover ring-2'
								loading='lazy'
								onClick={() => open()}
							/>

							{img ? (
								<form action={add}>
									<button className='cursor-pointer rounded-md bg-blue-500 p-1 text-xs text-white transition-opacity duration-200 hover:opacity-80 disabled:cursor-not-allowed disabled:bg-blue-300'>
										Send
									</button>
								</form>
							) : (
								<span onClick={() => open()} className='font-medium'>
									Add a Story
								</span>
							)}

							<div onClick={() => open()} className='absolute top-1 text-6xl text-gray-200'>
								+
							</div>
						</div>
					)
				}}
			</CldUploadWidget>

			{/* STORY */}
			{optimisticStories.map(({ id, user, img }) => (
				<Link href={'/'} key={id}>
					<div className='relative flex cursor-pointer flex-col items-center gap-2 transition-transform duration-300 ease-in-out hover:scale-110'>
						<Image
							src={img}
							alt='avatar'
							width={80}
							height={80}
							className='size-20 rounded-full ring-2'
							loading='lazy'
						/>

						<span className='font-medium'>{user.name || user.username}</span>
					</div>
				</Link>
			))}
		</>
	)
}
