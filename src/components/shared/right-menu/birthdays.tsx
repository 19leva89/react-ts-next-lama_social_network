import Link from 'next/link'
import Image from 'next/image'

export const Birthdays = () => {
	return (
		<div className='flex flex-col gap-4 rounded-lg bg-white p-4 text-sm shadow-md'>
			{/* TOP */}
			<div className='flex items-center justify-between font-medium'>
				<span className='text-gray-500'>Birthdays</span>
			</div>

			{/* USER */}
			<div className='flex items-center justify-between'>
				<div className='flex items-center gap-4'>
					<Image
						src='https://images.pexels.com/photos/18207381/pexels-photo-18207381/free-photo-of-window-in-bar.jpeg?auto=compress&cs=tinysrgb&w=800'
						alt=''
						width={40}
						height={40}
						className='size-10 rounded-full object-cover transition-transform duration-300 ease-in-out hover:scale-110 hover:shadow-lg hover:shadow-gray-600/50'
						loading='lazy'
					/>

					<span className='font-semibold'>Wayne Burton</span>
				</div>

				<div className='flex justify-end gap-3'>
					<button className='cursor-pointer rounded-md bg-blue-500 px-2 py-1 text-xs text-white transition-opacity duration-200 hover:opacity-80'>
						Celebrate
					</button>
				</div>
			</div>

			{/* UPCOMING */}
			<div className='flex items-center gap-4 rounded-lg bg-slate-100 p-4'>
				<Image src='/img/gift.png' alt='gift' width={24} height={24} loading='lazy' />

				<Link href='/' className='flex flex-col gap-1 text-xs'>
					<span className='font-semibold text-gray-700'>Upcoming Birthdays</span>

					<span className='text-gray-500'>See other 16 have upcoming birthdays</span>
				</Link>
			</div>
		</div>
	)
}
