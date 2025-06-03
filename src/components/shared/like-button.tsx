import Image from 'next/image'

interface Props {
	isLiked?: boolean
	likeAction: () => void
}

export const LikeButton = ({ isLiked = false, likeAction }: Props) => {
	return (
		<form action={likeAction}>
			<button>
				<Image
					src={isLiked ? '/img/liked.png' : '/img/like.png'}
					alt='like'
					width={16}
					height={16}
					className='cursor-pointer transition-transform duration-300 ease-in-out hover:scale-125'
					loading='lazy'
				/>
			</button>
		</form>
	)
}
