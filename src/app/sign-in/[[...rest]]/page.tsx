import { SignIn } from '@clerk/nextjs'

const SignInPage = () => {
	return (
		<div className="flex items-center justify-center h-[calc(100vh-96px)]">
			<SignIn />
		</div>
	)
}

export default SignInPage
