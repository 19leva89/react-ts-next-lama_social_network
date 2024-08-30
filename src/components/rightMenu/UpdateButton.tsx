'use client'

import { useFormStatus } from 'react-dom'

const UpdateButton = () => {
	const { pending } = useFormStatus()

	return (
		<button
			className="bg-blue-500 p-2 mt-2 rounded-md text-white disabled:bg-opacity-50 disabled:cursor-not-allowed hover:opacity-80 transition-opacity duration-200"
			disabled={pending}
		>
			{pending ? 'Updating...' : 'Update'}
		</button>
	)
}

export default UpdateButton
