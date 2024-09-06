'use server'

import prisma from './client'
import { revalidatePath } from 'next/cache'
import { auth } from '@clerk/nextjs/server'
import { z } from 'zod'

export const switchFollow = async (userId: string) => {
	const { userId: currentUserId } = auth()

	if (!currentUserId) {
		throw new Error('User is not authenticated!')
	}

	try {
		// Checking for a subscription or subscription request
		const existingFollow = await prisma.follower.findFirst({
			where: {
				followerId: currentUserId,
				followingId: userId,
			},
		})

		const existingFollowRequest = existingFollow
			? null
			: await prisma.followRequest.findFirst({
					where: {
						senderId: currentUserId,
						receiverId: userId,
					},
			  })

		if (existingFollow) {
			// Delete the subscription if it exists
			await prisma.follower.delete({
				where: {
					id: existingFollow.id,
				},
			})
		} else if (existingFollowRequest) {
			// Delete the subscription request if it exists
			await prisma.followRequest.delete({
				where: {
					id: existingFollowRequest.id,
				},
			})
		} else {
			// Create a new subscription request if there is no subscription or request
			await prisma.followRequest.create({
				data: {
					senderId: currentUserId,
					receiverId: userId,
				},
			})
		}
	} catch (err) {
		console.error('Error in switchFollow:', err)
		throw new Error('Something went wrong during follow/unfollow process!')
	}
}

export const switchBlock = async (userId: string) => {
	const { userId: currentUserId } = auth()

	if (!currentUserId) {
		throw new Error('User is not authenticated!')
	}

	try {
		// Checking if there is a block
		const existingBlock = await prisma.block.findFirst({
			where: {
				blockerId: currentUserId,
				blockedId: userId,
			},
		})

		if (existingBlock) {
			// Remove the block if it exists
			await prisma.block.delete({
				where: {
					id: existingBlock.id,
				},
			})
		} else {
			// Create a new block if it doesn't exist
			await prisma.block.create({
				data: {
					blockerId: currentUserId,
					blockedId: userId,
				},
			})
		}
	} catch (err) {
		console.error('Error in switchBlock:', err)
		throw new Error(`Failed to toggle block status for user with ID ${userId}.`)
	}
}

export const acceptFollowRequest = async (userId: string) => {
	const { userId: currentUserId } = auth()

	if (!currentUserId) {
		throw new Error('User is not authenticated!')
	}

	try {
		// Checking for a subscription request
		const existingFollowRequest = await prisma.followRequest.findFirst({
			where: {
				senderId: userId,
				receiverId: currentUserId,
			},
		})

		if (!existingFollowRequest) {
			throw new Error('Follow request does not exist.')
		}

		// Use a transaction to delete the request and create a subscription
		await prisma.$transaction([
			prisma.followRequest.delete({
				where: {
					id: existingFollowRequest.id,
				},
			}),
			prisma.follower.create({
				data: {
					followerId: userId,
					followingId: currentUserId,
				},
			}),
		])
	} catch (err) {
		console.error('Error in acceptFollowRequest:', err)
		throw new Error('Failed to accept follow request.')
	}
}

export const declineFollowRequest = async (userId: string) => {
	const { userId: currentUserId } = auth()

	if (!currentUserId) {
		throw new Error('User is not authenticated!')
	}

	try {
		// Checking for a subscription request
		const existingFollowRequest = await prisma.followRequest.findFirst({
			where: {
				senderId: userId,
				receiverId: currentUserId,
			},
		})

		if (!existingFollowRequest) {
			console.warn(`No follow request found from user ${userId} to ${currentUserId}.`)
			return
		}

		// Removing the subscription request
		await prisma.followRequest.delete({
			where: {
				id: existingFollowRequest.id,
			},
		})

		console.log(`Follow request from user ${userId} to ${currentUserId} declined.`)
	} catch (err) {
		console.error('Error in declineFollowRequest:', err)
		throw new Error('Failed to decline follow request.')
	}
}

export const updateProfile = async (
	prevState: { success: boolean; error: boolean },
	payload: { formData: FormData; cover: string },
) => {
	const { formData, cover } = payload
	const fields = Object.fromEntries(formData)

	// Filtering empty values
	const filteredFields = Object.fromEntries(Object.entries(fields).filter(([_, value]) => value !== ''))

	// Profile validation scheme
	const Profile = z.object({
		cover: z.string().optional(),
		name: z.string().max(60).optional(),
		surname: z.string().max(60).optional(),
		description: z.string().max(255).optional(),
		city: z.string().max(60).optional(),
		school: z.string().max(60).optional(),
		work: z.string().max(60).optional(),
		website: z.string().max(60).optional(),
	})

	// Checking user authentication
	const { userId } = auth()
	if (!userId) {
		return { success: false, error: true, message: 'User is not authenticated.' }
	}

	// Validating profile fields
	const validatedFields = Profile.safeParse({ cover, ...filteredFields })
	if (!validatedFields.success) {
		console.error('Validation errors:', validatedFields.error.flatten().fieldErrors)
		return {
			success: false,
			error: true,
			message: 'Invalid profile data.',
			errors: validatedFields.error.flatten().fieldErrors,
		}
	}

	try {
		// Updating user profile
		await prisma.user.update({
			where: {
				id: userId,
			},
			data: validatedFields.data,
		})

		return { success: true, error: false }
	} catch (err) {
		console.error('Error updating profile:', err)
		return { success: false, error: true, message: 'Failed to update profile.' }
	}
}

export const switchLikeForPost = async (postId: number) => {
	const { userId } = auth()

	if (!userId) throw new Error('User is not authenticated!')

	try {
		const existingLike = await prisma.like.findFirst({
			where: {
				postId,
				userId,
			},
		})

		if (existingLike) {
			await prisma.like.delete({
				where: {
					id: existingLike.id,
				},
			})
		} else {
			await prisma.like.create({
				data: {
					postId,
					userId,
				},
			})
		}
	} catch (err) {
		console.error('Error in switchLikeForPost:', err)
		throw new Error('Failed to toggle like status.')
	}
}

export const switchLikeForComment = async (commentId: number) => {
	const { userId } = auth()

	if (!userId) throw new Error('User is not authenticated!')

	try {
		const existingLike = await prisma.like.findFirst({
			where: {
				commentId,
				userId,
			},
		})

		if (existingLike) {
			await prisma.like.delete({
				where: {
					id: existingLike.id,
				},
			})
		} else {
			await prisma.like.create({
				data: {
					commentId,
					userId,
				},
			})
		}
	} catch (err) {
		console.error('Error in switchLikeForComment:', err)
		throw new Error('Failed to toggle like status.')
	}
}

export const addComment = async (postId: number, desc: string) => {
	const { userId } = auth()

	if (!userId) throw new Error('User is not authenticated!')

	// Validation of input data
	const CommentSchema = z.string().min(1, 'Comment cannot be empty').max(255, 'Comment is too long')
	const validation = CommentSchema.safeParse(desc)

	if (!validation.success) {
		console.error('Validation error:', validation.error.errors)
		throw new Error('Invalid comment description.')
	}

	try {
		// Create a comment
		const createdComment = await prisma.comment.create({
			data: {
				desc: validation.data,
				userId,
				postId,
			},
			include: {
				user: true,
				likes: true,
			},
		})

		return createdComment
	} catch (err) {
		console.error('Error creating comment:', err)
		throw new Error('Failed to create comment.')
	}
}

export const deleteComment = async (commentId: number) => {
	const { userId } = auth()

	if (!userId) throw new Error('User is not authenticated!')

	try {
		// Checking the existence of the post
		const existingComment = await prisma.comment.findUnique({
			where: {
				id: commentId,
			},
		})

		if (!existingComment) {
			throw new Error('Comment not found!')
		}

		if (existingComment.userId !== userId) {
			throw new Error('You are not authorized to delete this comment!')
		}

		// Deleting a comment
		await prisma.comment.delete({
			where: {
				id: commentId,
			},
		})

		// Path revalidation
		try {
			await revalidatePath('/')
		} catch (revalidationError) {
			console.error('Error during path revalidation:', revalidationError)
			return { success: true, warning: 'Comment deleted, but path revalidation failed' }
		}

		return { success: true }
	} catch (err) {
		console.error('Error deleting comment:', err)
		return { success: false, error: 'Failed to delete comment' }
	}
}

export const addPost = async (formData: FormData, img: string) => {
	const { userId } = auth()
	if (!userId) throw new Error('User is not authenticated!')

	// Data validation
	const desc = formData.get('desc') as string
	const PostSchema = z.string().min(1, 'Post cannot be empty').max(255, 'Post is too long')
	const validation = PostSchema.safeParse(desc)

	if (!validation.success) {
		console.error('Validation error:', validation.error.errors)
		throw new Error('Invalid post description.')
	}

	// Adding a post
	try {
		await prisma.post.create({
			data: {
				desc: validation.data,
				userId,
				img,
			},
		})

		// Path revalidation
		try {
			await revalidatePath('/')
		} catch (revalidationError) {
			console.error('Error during path revalidation:', revalidationError)
			return { success: true, warning: 'Post added, but path revalidation failed' }
		}

		return { success: true }
	} catch (err) {
		console.error('Error adding post:', err)
		return { success: false, error: 'Failed to add post' }
	}
}

export const deletePost = async (postId: number) => {
	const { userId } = auth()

	if (!userId) throw new Error('User is not authenticated!')

	try {
		// Checking the existence of the post
		const existingPost = await prisma.post.findUnique({
			where: {
				id: postId,
			},
		})

		if (!existingPost) {
			throw new Error('Post not found!')
		}

		// Deleting a post
		await prisma.post.delete({
			where: {
				id: postId,
				userId,
			},
		})

		// Path revalidation
		try {
			await revalidatePath('/')
		} catch (revalidationError) {
			console.error('Error during path revalidation:', revalidationError)
			return { success: true, warning: 'Post deleted, but path revalidation failed' }
		}

		return { success: true }
	} catch (err) {
		console.error('Error deleting post:', err)
		return { success: false, error: 'Failed to delete post' }
	}
}

export const addStory = async (img: string) => {
	const { userId } = auth()

	if (!userId) throw new Error('User is not authenticated!')

	try {
		// Deleting existing history and creating a new one in a transaction
		const createdStory = await prisma.$transaction(async (prisma) => {
			//  если не будет работать -> заменить deleteMany на delete
			await prisma.story.deleteMany({
				where: {
					userId,
				},
			})

			return await prisma.story.create({
				data: {
					userId,
					img,
					expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
				},
				include: {
					user: true,
				},
			})
		})

		return createdStory
	} catch (err) {
		console.error('Error adding story:', err)
		return { success: false, error: 'Failed to add story' }
	}
}
