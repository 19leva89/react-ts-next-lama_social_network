import { SignUp } from '@clerk/nextjs'

const SignUpPage = () => {
	return (
		<div className="flex items-center justify-center h-[calc(100vh-96px)]">
			<SignUp />
		</div>
	)
}

export default SignUpPage
