import Image from 'next/image'
import { notFound } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'

import { prisma } from '@/lib/prisma'
import { Feed } from '@/components/shared/feed/feed'
import { LeftMenu } from '@/components/shared/left-menu/left-menu'
import { RightMenu } from '@/components/shared/right-menu/right-menu'

interface Props {
	params: Promise<{ username: string }>
}

const ProfilePage = async ({ params }: Props) => {
	const username = (await params).username

	const user = await prisma.user.findFirst({
		where: {
			username,
		},
		include: {
			_count: {
				select: {
					followers: true,
					followings: true,
					posts: true,
				},
			},
		},
	})

	if (!user) return notFound()

	const { userId: currentUserId } = await auth()

	let isBlocked

	if (currentUserId) {
		const res = await prisma.block.findFirst({
			where: {
				blockerId: user.id,
				blockedId: currentUserId,
			},
		})

		if (res) isBlocked = true
	} else {
		isBlocked = false
	}

	if (isBlocked) return notFound()

	return (
		<div className='flex gap-6 pt-6'>
			<div className='hidden w-[20%] xl:block'>
				<LeftMenu type='profile' />
			</div>

			<div className='w-full lg:w-[70%] xl:w-[50%]'>
				<div className='flex flex-col gap-6'>
					<div className='flex flex-col items-center justify-center'>
						<div className='relative h-64 w-full'>
							<Image
								src={user.cover || '/img/no-cover.png'}
								alt='cover'
								fill
								className='rounded-md object-cover'
								sizes='(max-width: 1024px) 100vw, (max-width: 1280px) 70vw, 50vw'
								loading='lazy'
							/>

							<Image
								src={user.avatar || '/img/no-avatar.png'}
								alt='avatar'
								width={128}
								height={128}
								className='absolute right-0 -bottom-16 left-0 m-auto size-32 rounded-full object-cover ring-4 ring-white'
								loading='lazy'
							/>
						</div>

						<h1 className='mt-20 mb-4 text-2xl font-medium'>
							{user.name && user.surname ? user.name + ' ' + user.surname : user.username}
						</h1>

						<div className='mb-4 flex items-center justify-center gap-12'>
							<div className='flex flex-col items-center'>
								<span className='font-medium'>{user._count.posts}</span>
								<span className='text-sm'>Posts</span>
							</div>

							<div className='flex flex-col items-center'>
								<span className='font-medium'>{user._count.followers}</span>
								<span className='text-sm'>Followers</span>
							</div>

							<div className='flex flex-col items-center'>
								<span className='font-medium'>{user._count.followings}</span>
								<span className='text-sm'>Following</span>
							</div>
						</div>
					</div>

					<Feed username={user.username} />
				</div>
			</div>

			<div className='hidden w-[30%] lg:block'>
				<RightMenu user={user} />
			</div>
		</div>
	)
}

export default ProfilePage
