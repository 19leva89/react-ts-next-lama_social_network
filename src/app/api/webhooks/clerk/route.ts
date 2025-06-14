import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'

import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
	// You can find this in the Clerk Dashboard -> Webhooks -> choose the endpoint
	const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET

	if (!WEBHOOK_SECRET) {
		throw new Error('Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local')
	}

	// Get the headers
	const headerPayload = headers()
	const svix_id = (await headerPayload).get('svix-id')
	const svix_timestamp = (await headerPayload).get('svix-timestamp')
	const svix_signature = (await headerPayload).get('svix-signature')

	// If there are no headers, error out
	if (!svix_id || !svix_timestamp || !svix_signature) {
		return new NextResponse('Error occurred -- no svix headers', {
			status: 400,
		})
	}

	// Get the body
	const payload = await req.json()
	const body = JSON.stringify(payload)

	// Create a new Svix instance with your secret.
	const wh = new Webhook(WEBHOOK_SECRET)

	let evt: WebhookEvent

	// Verify the payload with the headers
	try {
		evt = wh.verify(body, {
			'svix-id': svix_id,
			'svix-timestamp': svix_timestamp,
			'svix-signature': svix_signature,
		}) as WebhookEvent
	} catch (err) {
		console.error('Error verifying webhook:', err)
		return new NextResponse('Error occurred', {
			status: 400,
		})
	}

	// Do something with the payload
	// For this guide, you simply log the payload to the console
	const eventType = evt.type


	if (eventType === 'user.created') {
		try {
			await prisma.user.create({
				data: {
					id: evt.data.id,
					username: JSON.parse(body).data.username,
					avatar: JSON.parse(body).data.image_url || '/img/no-avatar.png',
					cover: '/img/no-cover.png',
				},
			})

			return new NextResponse('User has been created!', { status: 200 })
		} catch (err) {
			console.log(err)
			return new NextResponse('Failed to create the user!', { status: 500 })
		}
	}

	if (eventType === 'user.updated') {
		try {
			await prisma.user.update({
				where: {
					id: evt.data.id,
				},
				data: {
					username: JSON.parse(body).data.username,
					avatar: JSON.parse(body).data.image_url || '/img/no-avatar.png',
				},
			})

			return new NextResponse('User has been updated!', { status: 200 })
		} catch (err) {
			console.log(err)
			return new NextResponse('Failed to update the user!', { status: 500 })
		}
	}

	return new NextResponse('Webhook received', { status: 200 })
}
