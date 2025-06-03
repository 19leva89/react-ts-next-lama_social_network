'use client'

import { useFormStatus } from 'react-dom'

export const AddPostButton = () => {
	const { pending } = useFormStatus()

	return (
		<button
			className='mt-2 cursor-pointer rounded-md bg-blue-500 p-2 text-white transition-opacity duration-200 hover:opacity-80 disabled:cursor-not-allowed disabled:bg-blue-300'
			disabled={pending}
		>
			{pending ? (
				<div className='flex items-center gap-2'>
					<div className='border-white-300 text-surface inline-block size-[10px] animate-spin rounded-full border-2 border-solid border-current border-e-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]' />
					Sending
				</div>
			) : (
				'Send'
			)}
		</button>
	)
}
