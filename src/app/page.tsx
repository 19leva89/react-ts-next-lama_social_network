import { Feed } from '@/components/shared/feed'
import { AddPost } from '@/components/shared/add-post'
import { Stories } from '@/components/shared/stories'
import { LeftMenu } from '@/components/shared/left-menu/left-menu'
import { RightMenu } from '@/components/shared/right-menu/right-menu'

const HomePage = () => {
	return (
		<div className='flex gap-6 pt-6'>
			<div className='hidden w-[20%] xl:block'>
				<LeftMenu type='home' />
			</div>

			<div className='w-full lg:w-[70%] xl:w-[50%]'>
				<div className='flex flex-col gap-6'>
					<Stories />

					<AddPost />

					<Feed />
				</div>
			</div>

			<div className='hidden w-[30%] lg:block'>
				<RightMenu />
			</div>
		</div>
	)
}

export default HomePage
