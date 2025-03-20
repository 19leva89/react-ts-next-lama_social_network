'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useOptimistic, useState } from 'react'
import { FollowRequest, User } from '@prisma/client'

import { acceptFollowRequest, declineFollowRequest } from '@/app/api/actions'

type RequestWithUser = FollowRequest & {
	sender: User
}

interface Props {
	requests: RequestWithUser[]
}

export const FriendRequestList = ({ requests }: Props) => {
	const [requestState, setRequestState] = useState(requests)

	const [optimisticRequests, removeOptimisticRequest] = useOptimistic(requestState, (state, value: number) =>
		state.filter((req) => req.id !== value),
	)

	const accept = async (requestId: number, userId: string) => {
		removeOptimisticRequest(requestId)

		try {
			await acceptFollowRequest(userId)

			setRequestState((prev) => prev.filter((req) => req.id !== requestId))
		} catch (err) {}
	}

	const decline = async (requestId: number, userId: string) => {
		removeOptimisticRequest(requestId)

		try {
			await declineFollowRequest(userId)

			setRequestState((prev) => prev.filter((req) => req.id !== requestId))
		} catch (err) {}
	}

	return (
		<div>
			{optimisticRequests.map(({ id, sender }) => (
				<div className="flex items-center justify-between" key={id}>
					<div className="flex items-center gap-4">
						<Link href={`/profile/${sender.username}`}>
							<Image
								src={sender.avatar || '/img/no-avatar.png'}
								alt="avatar"
								width={40}
								height={40}
								className="w-10 h-10 rounded-full object-cover transition-transform duration-300 ease-in-out hover:scale-110 hover:shadow-lg hover:shadow-blue-500/50"
								loading="lazy"
							/>
						</Link>

						<Link href={`/profile/${sender.username}`}>
							<span className="font-semibold hover:text-blue-500 opacity-80 hover:opacity-100 transition duration-200">
								{sender.name && sender.surname ? sender.name + ' ' + sender.surname : sender.username}
							</span>
						</Link>
					</div>

					<div className="flex gap-3 justify-end">
						<form action={() => accept(id, sender.id)}>
							<button>
								<Image
									src="/img/accept.png"
									alt="accept"
									width={22}
									height={22}
									className="border border-transparent cursor-pointer hover:opacity-80 transition-opacity duration-200"
									loading="lazy"
								/>
							</button>
						</form>

						<form action={() => decline(id, sender.id)}>
							<button>
								<Image
									src="/img/reject.png"
									alt="reject"
									width={22}
									height={22}
									className="border border-transparent cursor-pointer opacity-80 hover:opacity-100 transition-opacity duration-200"
									loading="lazy"
								/>
							</button>
						</form>
					</div>
				</div>
			))}
		</div>
	)
}
