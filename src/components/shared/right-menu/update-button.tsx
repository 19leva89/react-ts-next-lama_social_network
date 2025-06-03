'use client'

import { useFormStatus } from 'react-dom'

export const UpdateButton = () => {
	const { pending } = useFormStatus()

	return (
		<button
			className='disabled:bg-opacity-50 mt-2 cursor-pointer rounded-md bg-blue-500 p-2 text-white transition-opacity duration-200 hover:opacity-80 disabled:cursor-not-allowed'
			disabled={pending}
		>
			{pending ? 'Updating...' : 'Update'}
		</button>
	)
}
