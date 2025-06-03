import Image from 'next/image'

interface Props {
	size: 'sm' | 'md' | 'lg'
}

export const Ad = ({ size }: Props) => {
	return (
		<div className='rounded-lg bg-white p-4 text-sm shadow-md '>
			{/* TOP */}
			<div className='flex items-center justify-between font-medium text-gray-500'>
				<span>Sponsored Ads</span>

				<Image src='/img/more.png' alt='more' width={16} height={16} loading='lazy' />
			</div>

			{/* BOTTOM */}
			<div className={`mt-4 flex flex-col ${size === 'sm' ? 'gap-2' : 'gap-4'}`}>
				<div className={`relative w-full ${size === 'sm' ? 'h-24' : size === 'md' ? 'h-36' : 'h-48'}`}>
					<Image
						src='https://images.pexels.com/photos/23193135/pexels-photo-23193135.jpeg?auto=compress&cs=tinysrgb&w=800'
						alt=''
						fill
						className='rounded-lg object-cover'
						loading='lazy'
						sizes={
							size === 'sm'
								? '(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw'
								: size === 'md'
									? '(max-width: 768px) 50vw, 25vw'
									: '100vw'
						}
					/>
				</div>

				<div className='flex items-center gap-4'>
					<Image
						src='https://images.pexels.com/photos/23193135/pexels-photo-23193135.jpeg?auto=compress&cs=tinysrgb&w=800'
						alt=''
						width={24}
						height={24}
						className='size-6 rounded-full object-cover'
						loading='lazy'
						sizes={
							size === 'sm'
								? '(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw'
								: size === 'md'
									? '(max-width: 768px) 50vw, 25vw'
									: '100vw'
						}
					/>

					<span className='font-medium text-blue-500'>BigChef Lounge</span>
				</div>

				<p className={size === 'sm' ? 'text-xs' : 'text-sm'}>
					{size === 'sm'
						? 'Lorem ipsum dolor sit amet consectetur adipisicing elit.'
						: size === 'md'
							? 'Lorem ipsum dolor sit amet consectetur adipisicing elit.  Lorem ipsum dolor sit amet consectetur adipisicing elit.'
							: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.  Lorem ipsum dolor sit amet consectetur adipisicing elit.  Lorem ipsum dolor sit amet consectetur adipisicing elit.'}
				</p>

				<button className='cursor-pointer rounded-lg bg-gray-300 p-2 text-xs text-gray-600 opacity-80 transition-opacity duration-200 hover:opacity-100'>
					Learn more
				</button>
			</div>
		</div>
	)
}
