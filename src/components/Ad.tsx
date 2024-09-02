import Image from 'next/image'

const Ad = ({ size }: { size: 'sm' | 'md' | 'lg' }) => {
	return (
		<div className="p-4 bg-white rounded-lg shadow-md text-sm ">
			{/* TOP */}
			<div className="flex items-center justify-between text-gray-500 font-medium">
				<span>Sponsored Ads</span>

				<Image src="/more.png" alt="more" width={16} height={16} />
			</div>

			{/* BOTTOM */}
			<div className={`flex flex-col mt-4 ${size === 'sm' ? 'gap-2' : 'gap-4'}`}>
				<div className={`relative w-full ${size === 'sm' ? 'h-24' : size === 'md' ? 'h-36' : 'h-48'}`}>
					<Image
						src="https://images.pexels.com/photos/23193135/pexels-photo-23193135.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load"
						alt=""
						fill
						className="rounded-lg object-cover"
						sizes={
							size === 'sm'
								? '(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw'
								: size === 'md'
								? '(max-width: 768px) 50vw, 25vw'
								: '100vw'
						}
					/>
				</div>

				<div className="flex items-center gap-4">
					<Image
						src="https://images.pexels.com/photos/23193135/pexels-photo-23193135.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load"
						alt=""
						width={24}
						height={24}
						className="rounded-full w-6 h-6 object-cover"
						sizes={
							size === 'sm'
								? '(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw'
								: size === 'md'
								? '(max-width: 768px) 50vw, 25vw'
								: '100vw'
						}
					/>

					<span className="text-blue-500 font-medium">BigChef Lounge</span>
				</div>

				<p className={size === 'sm' ? 'text-xs' : 'text-sm'}>
					{size === 'sm'
						? 'Lorem ipsum dolor sit amet consectetur adipisicing elit.'
						: size === 'md'
						? 'Lorem ipsum dolor sit amet consectetur adipisicing elit.  Lorem ipsum dolor sit amet consectetur adipisicing elit.'
						: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.  Lorem ipsum dolor sit amet consectetur adipisicing elit.  Lorem ipsum dolor sit amet consectetur adipisicing elit.'}
				</p>

				<button className="bg-gray-300 text-gray-600 p-2 text-xs rounded-lg opacity-80 hover:opacity-100 transition-opacity duration-200">
					Learn more
				</button>
			</div>
		</div>
	)
}

export default Ad
