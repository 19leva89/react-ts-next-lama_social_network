import Link from 'next/link'
import Image from 'next/image'

import { Ad } from '@/components/shared/ad'
import { ProfileCard } from '@/components/shared/left-menu/profile-card'

interface Props {
	type: 'home' | 'profile'
}

export const LeftMenu = ({ type }: Props) => {
	return (
		<div className='flex flex-col gap-6'>
			{type === 'home' && <ProfileCard />}

			<div className='flex flex-col gap-2 rounded-lg bg-white p-4 text-sm text-gray-500 shadow-md'>
				<Link href='/' className='flex items-center gap-4 rounded-lg p-2 hover:bg-slate-100'>
					<Image src='/img/posts.png' alt='posts' width={20} height={20} loading='lazy' />
					<span>My Posts</span>
				</Link>

				<hr className='w-36 self-center border-t border-gray-50' />

				<Link href='/' className='flex items-center gap-4 rounded-lg p-2 hover:bg-slate-100'>
					<Image src='/img/activity.png' alt='activity' width={20} height={20} loading='lazy' />
					<span>Activity</span>
				</Link>

				<hr className='w-36 self-center border-t border-gray-50' />

				<Link href='/' className='flex items-center gap-4 rounded-lg p-2 hover:bg-slate-100'>
					<Image src='/img/market.png' alt='market' width={20} height={20} loading='lazy' />
					<span>Marketplace</span>
				</Link>

				<hr className='w-36 self-center border-t border-gray-50' />

				<Link href='/' className='flex items-center gap-4 rounded-lg p-2 hover:bg-slate-100'>
					<Image src='/img/events.png' alt='events' width={20} height={20} loading='lazy' />
					<span>Events</span>
				</Link>

				<hr className='w-36 self-center border-t border-gray-50' />

				<Link href='/' className='flex items-center gap-4 rounded-lg p-2 hover:bg-slate-100'>
					<Image src='/img/albums.png' alt='albums' width={20} height={20} loading='lazy' />
					<span>Albums</span>
				</Link>

				<hr className='w-36 self-center border-t border-gray-50' />

				<Link href='/' className='flex items-center gap-4 rounded-lg p-2 hover:bg-slate-100'>
					<Image src='/img/videos.png' alt='videos' width={20} height={20} loading='lazy' />
					<span>Videos</span>
				</Link>

				<hr className='w-36 self-center border-t border-gray-50' />

				<Link href='/' className='flex items-center gap-4 rounded-lg p-2 hover:bg-slate-100'>
					<Image src='/img/news.png' alt='news' width={20} height={20} loading='lazy' />
					<span>News</span>
				</Link>

				<hr className='w-36 self-center border-t border-gray-50' />

				<Link href='/' className='flex items-center gap-4 rounded-lg p-2 hover:bg-slate-100'>
					<Image src='/img/courses.png' alt='courses' width={20} height={20} loading='lazy' />
					<span>Courses</span>
				</Link>

				<hr className='w-36 self-center border-t border-gray-50' />

				<Link href='/' className='flex items-center gap-4 rounded-lg p-2 hover:bg-slate-100'>
					<Image src='/img/lists.png' alt='lists' width={20} height={20} loading='lazy' />
					<span>Lists</span>
				</Link>

				<hr className='w-36 self-center border-t border-gray-50' />

				<Link href='/' className='flex items-center gap-4 rounded-lg p-2 hover:bg-slate-100'>
					<Image src='/img/settings.png' alt='settings' width={20} height={20} loading='lazy' />
					<span>Settings</span>
				</Link>
			</div>

			<Ad size='sm' />
		</div>
	)
}
