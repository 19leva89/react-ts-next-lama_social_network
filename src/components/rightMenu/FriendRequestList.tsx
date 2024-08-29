'use client'

import { useOptimistic, useState } from 'react'
import { FollowRequest, User } from '@prisma/client'

import { acceptFollowRequest, declineFollowRequest } from '@/lib/actions'

import Image from 'next/image'
import Link from 'next/link'

type RequestWithUser = FollowRequest & {
	sender: User
}

const FriendRequestList = ({ requests }: { requests: RequestWithUser[] }) => {
	const [requestState, setRequestState] = useState(requests)

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

	const [optimisticRequests, removeOptimisticRequest] = useOptimistic(requestState, (state, value: number) =>
		state.filter((req) => req.id !== value),
	)

	return (
		<div className="">
			{optimisticRequests.map((request) => (
				<div className="flex items-center justify-between" key={request.id}>
					<div className="flex items-center gap-4">
						<Link href={`/profile/${request.sender.username}`}>
							<Image
								src={request.sender.avatar || '/noAvatar.png'}
								alt="avatar"
								width={40}
								height={40}
								className="w-10 h-10 rounded-full object-cover"
							/>
						</Link>

						<Link href={`/profile/${request.sender.username}`}>
							<span className="font-semibold">
								{request.sender.name && request.sender.surname
									? request.sender.name + ' ' + request.sender.surname
									: request.sender.username}
							</span>
						</Link>
					</div>

					<div className="flex gap-3 justify-end">
						<form action={() => accept(request.id, request.sender.id)}>
							<button>
								<Image src="/accept.png" alt="accept" width={20} height={20} className="cursor-pointer" />
							</button>
						</form>

						<form action={() => decline(request.id, request.sender.id)}>
							<button>
								<Image src="/reject.png" alt="reject" width={20} height={20} className="cursor-pointer" />
							</button>
						</form>
					</div>
				</div>
			))}
		</div>
	)
}

export default FriendRequestList
