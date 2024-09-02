import prisma from '@/lib/client'
import { User } from '@prisma/client'

import Link from 'next/link'
import Image from 'next/image'

const UserMediaCard = async ({ user }: { user: User }) => {
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
		<div className="p-4 bg-white rounded-lg shadow-md text-sm flex flex-col gap-4">
			{/* TOP */}
			<div className="flex justify-between items-center font-medium">
				<span className="text-gray-500">User Media</span>

				<Link
					href="/"
					className="text-blue-500 text-xs p-1 border border-transparent rounded-md hover:opacity-80 hover:border-blue-500 hover:rounded-md hover:border-opacity-80 transition-all duration-200"
				>
					See all
				</Link>
			</div>

			{/* BOTTOM */}
			<div className="flex gap-4 justify-between flex-wrap">
				{postsWithMedia.length
					? postsWithMedia.map((post) => (
							<div className="relative w-1/5 h-24" key={post.id}>
								<Image
									src={post.img!}
									alt="post img"
									fill
									className="object-cover rounded-md"
									sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
								/>
							</div>
					  ))
					: 'No media found!'}
			</div>
		</div>
	)
}

export default UserMediaCard
