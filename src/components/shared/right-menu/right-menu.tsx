import { Suspense } from 'react'
import { User } from '@prisma/client'

import { Ad } from '@/components/shared/ad'
import { Birthdays, UserMediaCard } from '@/components/shared/right-menu'
import { UserInfoCard } from '@/components/shared/right-menu/user-info-card'
import { FriendRequests } from '@/components/shared/right-menu/friend-requests'

interface Props {
	user?: User
}

export const RightMenu = ({ user }: Props) => {
	return (
		<div className='flex flex-col gap-6'>
			{user ? (
				<>
					<Suspense fallback='loading...'>
						<UserInfoCard user={user} />
					</Suspense>

					<Suspense fallback='loading...'>
						<UserMediaCard user={user} />
					</Suspense>
				</>
			) : null}

			<FriendRequests />

			<Birthdays />

			<Ad size='md' />
		</div>
	)
}
