'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useActionState, useState } from 'react'
import { CldUploadWidget } from 'next-cloudinary'

import { User } from '@prisma/client'
import { updateProfile } from '@/app/api/actions'
import { UpdateButton } from '@/components/shared/right-menu'

interface Props {
	user: User
}

export const UpdateUser = ({ user }: Props) => {
	const [open, setOpen] = useState<boolean>(false)
	const [cover, setCover] = useState<any>(false)
	const [state, formAction] = useActionState(updateProfile, { success: false, error: false })

	const router = useRouter()

	const handleClose = () => {
		setOpen(false)

		state.success && router.refresh()
	}

	const getCoverUrl = (cover: any): string => {
		if (typeof cover === 'string') return cover
		if (cover?.secure_url) return cover.secure_url
		return ''
	}

	return (
		<div>
			<span
				className="text-blue-500 text-xs cursor-pointer p-1 border border-transparent rounded-md hover:opacity-80 hover:border-blue-500 hover:rounded-md hover:border-opacity-80 transition-all duration-200"
				onClick={() => setOpen(true)}
			>
				Update
			</span>

			{open && (
				<div className="absolute w-screen h-screen top-0 left-0 bg-black bg-opacity-65 flex items-center justify-center z-50 ">
					<form
						action={(formData) => formAction({ formData, cover: getCoverUrl(cover) })}
						className="p-12 bg-white rounded-lg shadow-md flex flex-col gap-2 w-full md:w-1/2 xl:w-1/3 relative"
					>
						{/* TITLE */}
						<h1>Update Profile</h1>

						<div className="mt-4 text-xs text-gray-500">
							Use the navbar profile to change the avatar or username.
						</div>

						{/* COVER PIC UPLOAD */}
						<CldUploadWidget uploadPreset="next-social" onSuccess={(result) => setCover(result.info)}>
							{({ open }) => {
								return (
									<div className="flex flex-col gap-4 my-4" onClick={() => open()}>
										<label htmlFor="">Cover Picture</label>

										<div className="flex items-center gap-2 cursor-pointer">
											<Image
												src={user.cover || '/img/no-cover.png'}
												alt="cover"
												width={48}
												height={32}
												className="w-12 h-8 rounded-md object-cover"
												loading="lazy"
											/>
											<span className="text-xs underline text-gray-600">Change</span>
										</div>
									</div>
								)
							}}
						</CldUploadWidget>

						{/* WRAPPER */}
						<div className="flex flex-wrap justify-between gap-2 xl:gap-4">
							{/* INPUT */}
							<div className="flex flex-col gap-4">
								<label htmlFor="" className="text-xs text-gray-500">
									First Name
								</label>

								<input
									type="text"
									placeholder={user.name || 'John'}
									className="ring-1 ring-gray-300 p-[13px] rounded-md text-sm"
									name="name"
								/>
							</div>

							<div className="flex flex-col gap-4">
								<label htmlFor="" className="text-xs text-gray-500">
									Surname
								</label>

								<input
									type="text"
									placeholder={user.surname || 'Doe'}
									className="ring-1 ring-gray-300 p-[13px] rounded-md text-sm"
									name="surname"
								/>
							</div>

							{/* INPUT */}
							<div className="flex flex-col gap-4">
								<label htmlFor="" className="text-xs text-gray-500">
									Description
								</label>

								<input
									type="text"
									placeholder={user.description || 'Life is beautiful...'}
									className="ring-1 ring-gray-300 p-[13px] rounded-md text-sm"
									name="description"
								/>
							</div>

							{/* INPUT */}
							<div className="flex flex-col gap-4">
								<label htmlFor="" className="text-xs text-gray-500">
									City
								</label>

								<input
									type="text"
									placeholder={user.city || 'New York'}
									className="ring-1 ring-gray-300 p-[13px] rounded-md text-sm"
									name="city"
								/>
							</div>

							{/* INPUT */}
							<div className="flex flex-col gap-4">
								<label htmlFor="" className="text-xs text-gray-500">
									School
								</label>

								<input
									type="text"
									placeholder={user.school || 'MIT'}
									className="ring-1 ring-gray-300 p-[13px] rounded-md text-sm"
									name="school"
								/>
							</div>

							{/* INPUT */}
							<div className="flex flex-col gap-4">
								<label htmlFor="" className="text-xs text-gray-500">
									Work
								</label>

								<input
									type="text"
									placeholder={user.work || 'Apple Inc.'}
									className="ring-1 ring-gray-300 p-[13px] rounded-md text-sm"
									name="work"
								/>
							</div>

							{/* INPUT */}
							<div className="flex flex-col gap-4">
								<label htmlFor="" className="text-xs text-gray-500">
									Website
								</label>

								<input
									type="text"
									placeholder={user.website || 'website.dev'}
									className="ring-1 ring-gray-300 p-[13px] rounded-md text-sm"
									name="website"
								/>
							</div>
						</div>

						<UpdateButton />

						{state.success && <span className="text-green-500">Profile has been updated!</span>}

						{state.error && <span className="text-red-500">Something went wrong!</span>}

						<div
							className="absolute text-xl right-3 top-3 cursor-pointer p-1 border border-transparent rounded-md hover:opacity-80 hover:border-black hover:rounded-md hover:border-opacity-80 transition-all duration-200"
							onClick={handleClose}
						>
							X
						</div>
					</form>
				</div>
			)}
		</div>
	)
}
