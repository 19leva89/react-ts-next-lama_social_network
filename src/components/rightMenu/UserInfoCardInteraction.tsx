'use client'

import { FC, useOptimistic, useState } from 'react'
import { switchBlock, switchFollow } from '@/lib/actions'

type UserInfoCardInteractionProps = {
	userId: string
	isUserBlocked: boolean
	isFollowing: boolean
	isFollowingSent: boolean
}

type UserState = {
	following: boolean
	blocked: boolean
	followingRequestSent: boolean
}

const UserInfoCardInteraction: FC<UserInfoCardInteractionProps> = ({
	userId,
	isUserBlocked,
	isFollowing,
	isFollowingSent,
}) => {
	const [userState, setUserState] = useState<UserState>({
		following: isFollowing,
		blocked: isUserBlocked,
		followingRequestSent: isFollowingSent,
	})

	const [optimisticState, switchOptimisticState] = useOptimistic(
		userState,
		(state, value: 'follow' | 'block') =>
			value === 'follow'
				? {
						...state,
						following: state.following && false,
						followingRequestSent: !state.following && !state.followingRequestSent ? true : false,
				  }
				: { ...state, blocked: !state.blocked },
	)

	const [isHovered, setIsHovered] = useState<boolean>(false)

	const follow = async () => {
		switchOptimisticState('follow')

		try {
			await switchFollow(userId)

			setUserState((prev) => ({
				...prev,
				following: prev.following && false,
				followingRequestSent: !prev.following && !prev.followingRequestSent ? true : false,
			}))
		} catch (err) {}
	}

	const block = async () => {
		switchOptimisticState('block')

		try {
			await switchBlock(userId)

			setUserState((prev) => ({
				...prev,
				blocked: !prev.blocked,
			}))
		} catch (err) {}
	}

	const switchButtonText = (state: UserState, hovered: boolean) => {
		if (state.following && hovered) {
			return 'Unfollowing'
		}
		if (state.followingRequestSent && hovered) {
			return 'Friend Request Canceled'
		}
		if (state.following) {
			return 'Following'
		}
		if (state.followingRequestSent) {
			return 'Friend Request Sent'
		}
		return 'Follow'
	}

	return (
		<>
			<form action={follow}>
				<button
					className="w-full bg-blue-500 text-white text-sm rounded-md p-2 hover:opacity-80 transition-opacity duration-200"
					onMouseEnter={() => setIsHovered(true)}
					onMouseLeave={() => setIsHovered(false)}
				>
					{switchButtonText(optimisticState, isHovered)}
				</button>
			</form>

			<form action={block} className="self-end ">
				<button className="p-1 border border-transparent rounded-md hover:opacity-80 hover:border-red-400 hover:rounded-md hover:border-opacity-80 transition-all duration-200">
					<span className="text-red-400 text-xs cursor-pointer">
						{optimisticState.blocked ? 'Unblock User' : 'Block User'}
					</span>
				</button>
			</form>
		</>
	)
}

export default UserInfoCardInteraction
