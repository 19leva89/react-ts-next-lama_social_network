import { Suspense } from 'react'
import { User } from '@prisma/client'

import Ad from '../Ad'
import Birthdays from './Birthdays'
import UserInfoCard from './UserInfoCard'
import UserMediaCard from './UserMediaCard'
import FriendRequests from './FriendRequests'

const RightMenu = ({ user }: { user?: User }) => {
	return (
		<div className="flex flex-col gap-6">
			{user ? (
				<>
					<Suspense fallback="loading...">
						<UserInfoCard user={user} />
					</Suspense>

					<Suspense fallback="loading...">
						<UserMediaCard user={user} />
					</Suspense>
				</>
			) : null}
			<FriendRequests />

			<Birthdays />

			<Ad size="md" />
		</div>
	)
}

export default RightMenu
