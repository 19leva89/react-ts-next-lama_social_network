import Image from 'next/image'

type LikeButtonProps = {
	isLiked?: boolean
	likeAction: () => void
}

const LikeButton = ({ isLiked = false, likeAction }: LikeButtonProps) => {
	return (
		<form action={likeAction}>
			<button>
				<Image
					src={isLiked ? '/liked.png' : '/like.png'}
					alt="like"
					width={16}
					height={16}
					className="cursor-pointer transition-transform duration-300 ease-in-out hover:scale-125"
				/>
			</button>
		</form>
	)
}

export default LikeButton
