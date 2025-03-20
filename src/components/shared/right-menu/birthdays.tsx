import Link from 'next/link'
import Image from 'next/image'

export const Birthdays = () => {
	return (
		<div className="p-4 bg-white rounded-lg shadow-md text-sm flex flex-col gap-4">
			{/* TOP */}
			<div className="flex justify-between items-center font-medium">
				<span className="text-gray-500">Birthdays</span>
			</div>

			{/* USER */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-4">
					<Image
						src="https://images.pexels.com/photos/18207381/pexels-photo-18207381/free-photo-of-window-in-bar.jpeg?auto=compress&cs=tinysrgb&w=800"
						alt=""
						width={40}
						height={40}
						className="w-10 h-10 rounded-full object-cover transition-transform duration-300 ease-in-out hover:scale-110 hover:shadow-lg hover:shadow-gray-600/50"
						loading="lazy"
					/>

					<span className="font-semibold">Wayne Burton</span>
				</div>

				<div className="flex gap-3 justify-end">
					<button className="bg-blue-500 text-white text-xs px-2 py-1 rounded-md cursor-pointer hover:opacity-80 transition-opacity duration-200">
						Celebrate
					</button>
				</div>
			</div>

			{/* UPCOMING */}
			<div className="p-4 bg-slate-100 rounded-lg flex items-center gap-4">
				<Image src="/img/gift.png" alt="gift" width={24} height={24} loading="lazy" />

				<Link href="/" className="flex flex-col gap-1 text-xs">
					<span className="text-gray-700 font-semibold">Upcoming Birthdays</span>

					<span className="text-gray-500">See other 16 have upcoming birthdays</span>
				</Link>
			</div>
		</div>
	)
}
