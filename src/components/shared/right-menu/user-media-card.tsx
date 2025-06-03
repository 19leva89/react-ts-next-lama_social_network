import Link from 'next/link'
import Image from 'next/image'
import { User } from '@prisma/client'

import { prisma } from '@/lib/prisma'

interface Props {
	user: User
}

export const UserMediaCard = async ({ user }: Props) => {
	const postsWithMedia = await prisma.post.findMany({
		where: {
			userId: user.id,
			img: {
				not: null,
			},
		},
		take: 8,
		orderBy: {
			createdAt: 'desc',
		},
	})

	return (
		<div className='flex flex-col gap-4 rounded-lg bg-white p-4 text-sm shadow-md'>
			{/* TOP */}
			<div className='flex items-center justify-between font-medium'>
				<span className='text-gray-500'>User Media</span>

				<Link
					href='/'
					className='hover:border-opacity-80 rounded-md border border-transparent p-1 text-xs text-blue-500 transition-all duration-200 hover:rounded-md hover:border-blue-500 hover:opacity-80'
				>
					See all
				</Link>
			</div>

			{/* BOTTOM */}
			<div className='flex flex-wrap justify-between gap-4'>
				{postsWithMedia.length > 0
					? postsWithMedia
							.filter(({ img }) => img)
							.map(({ id, img }) => (
								<div className='relative h-24 w-1/5' key={id}>
									<Image
										src={img!}
										alt='post img'
										fill
										className='rounded-md object-cover'
										sizes='(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw'
										loading='lazy'
									/>
								</div>
							))
					: 'No media found!'}
			</div>
		</div>
	)
}
