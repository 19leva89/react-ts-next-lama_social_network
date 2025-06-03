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
				className='hover:border-opacity-80 cursor-pointer rounded-md border border-transparent p-1 text-xs text-blue-500 transition-all duration-200 hover:rounded-md hover:border-blue-500 hover:opacity-80'
				onClick={() => setOpen(true)}
			>
				Update
			</span>

			{open && (
				<div className='bg-opacity-65 absolute top-0 left-0 z-50 flex h-screen w-screen items-center justify-center bg-black '>
					<form
						action={(formData) => formAction({ formData, cover: getCoverUrl(cover) })}
						className='relative flex w-full flex-col gap-2 rounded-lg bg-white p-12 shadow-md md:w-1/2 xl:w-1/3'
					>
						{/* TITLE */}
						<h1>Update Profile</h1>

						<div className='mt-4 text-xs text-gray-500'>
							Use the navbar profile to change the avatar or username.
						</div>

						{/* COVER PIC UPLOAD */}
						<CldUploadWidget uploadPreset='next-social' onSuccess={(result) => setCover(result.info)}>
							{({ open }) => {
								return (
									<div className='my-4 flex flex-col gap-4' onClick={() => open()}>
										<label htmlFor=''>Cover Picture</label>

										<div className='flex cursor-pointer items-center gap-2'>
											<Image
												src={user.cover || '/img/no-cover.png'}
												alt='cover'
												width={48}
												height={32}
												className='h-8 w-12 rounded-md object-cover'
												loading='lazy'
											/>
											<span className='text-xs text-gray-600 underline'>Change</span>
										</div>
									</div>
								)
							}}
						</CldUploadWidget>

						{/* WRAPPER */}
						<div className='flex flex-wrap justify-between gap-2 xl:gap-4'>
							{/* INPUT */}
							<div className='flex flex-col gap-4'>
								<label htmlFor='' className='text-xs text-gray-500'>
									First Name
								</label>

								<input
									type='text'
									placeholder={user.name || 'John'}
									className='rounded-md p-[13px] text-sm ring-1 ring-gray-300'
									name='name'
								/>
							</div>

							<div className='flex flex-col gap-4'>
								<label htmlFor='' className='text-xs text-gray-500'>
									Surname
								</label>

								<input
									type='text'
									placeholder={user.surname || 'Doe'}
									className='rounded-md p-[13px] text-sm ring-1 ring-gray-300'
									name='surname'
								/>
							</div>

							{/* INPUT */}
							<div className='flex flex-col gap-4'>
								<label htmlFor='' className='text-xs text-gray-500'>
									Description
								</label>

								<input
									type='text'
									placeholder={user.description || 'Life is beautiful...'}
									className='rounded-md p-[13px] text-sm ring-1 ring-gray-300'
									name='description'
								/>
							</div>

							{/* INPUT */}
							<div className='flex flex-col gap-4'>
								<label htmlFor='' className='text-xs text-gray-500'>
									City
								</label>

								<input
									type='text'
									placeholder={user.city || 'New York'}
									className='rounded-md p-[13px] text-sm ring-1 ring-gray-300'
									name='city'
								/>
							</div>

							{/* INPUT */}
							<div className='flex flex-col gap-4'>
								<label htmlFor='' className='text-xs text-gray-500'>
									School
								</label>

								<input
									type='text'
									placeholder={user.school || 'MIT'}
									className='rounded-md p-[13px] text-sm ring-1 ring-gray-300'
									name='school'
								/>
							</div>

							{/* INPUT */}
							<div className='flex flex-col gap-4'>
								<label htmlFor='' className='text-xs text-gray-500'>
									Work
								</label>

								<input
									type='text'
									placeholder={user.work || 'Apple Inc.'}
									className='rounded-md p-[13px] text-sm ring-1 ring-gray-300'
									name='work'
								/>
							</div>

							{/* INPUT */}
							<div className='flex flex-col gap-4'>
								<label htmlFor='' className='text-xs text-gray-500'>
									Website
								</label>

								<input
									type='text'
									placeholder={user.website || 'website.dev'}
									className='rounded-md p-[13px] text-sm ring-1 ring-gray-300'
									name='website'
								/>
							</div>
						</div>

						<UpdateButton />

						{state.success && <span className='text-green-500'>Profile has been updated!</span>}

						{state.error && <span className='text-red-500'>Something went wrong!</span>}

						<div
							className='hover:border-opacity-80 absolute top-3 right-3 cursor-pointer rounded-md border border-transparent p-1 text-xl transition-all duration-200 hover:rounded-md hover:border-black hover:opacity-80'
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
