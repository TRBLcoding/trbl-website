import { PrivacyUpdate } from '$lib/domain/PrivacyUpdate'
import transporter from '$lib/emailSetup.server'
import { getSupabaseClientFromToken } from '$lib/supabase/supabaseClient'
import { BadRequestError } from '$lib/utils/Errors'
import { json } from '@sveltejs/kit'
import type { RequestHandler } from '../$types'

export const POST: RequestHandler = async ({ request }) => {

	const authHeader = request.headers.get('Authorization')
	if (!authHeader)
		return json({ error: 'Missing authorization header' }, { status: 401 })

	try {
		const jwt = authHeader.replace('Bearer ', '')
		const supabase = getSupabaseClientFromToken(jwt)
		const { data: { user }, error: authError } = await supabase.auth.getUser(jwt)

		if (authError || !user)
			return json({ error: 'Invalid or expired token' }, { status: 401 })

		const { data: userData, error: userError } = await supabase
			.from('users')
			.select()
			.eq('auth_id', user.id)
			.single()

		if (userError || !userData)
			return json({ error: 'User not found' }, { status: 403 })
		if (userData.role !== 'Admin')
			return json({ error: 'Unauthorized. Admin access required.' }, { status: 403 })

		const { data: usersData, error: usersError } = await supabase
			.from("users")
			.select()
		if (usersError)
			return json({ error: 'Failed to fetch users' }, { status: 500 })
		const jsonBody = await request.json()

		const notableChanges = PrivacyUpdate.fromJSON(jsonBody)
		const errors = Array<{ user: string; error: string }>()
		const successes = Array<number>()

		for (let i = 0; i < usersData.length; i++) {
			const user = usersData[i]
			try {
				const response = await transporter.sendMail(
					notableChanges.toEmail(user.email, user.first_name, user.last_name)
				)
				console.log(`Email sent to user ${i}:`, response)
				successes.push(i)
			} catch (error) {
				console.error(`Failed to send email to user ${i}:`, error)

				const errorMessage = error instanceof Error ? error.message : "Unknown error"
				errors.push({
					user: `${user.first_name} ${user.last_name} (${user.email})`,
					error: errorMessage
				})
			}
		}

		if (errors.length > 0) {
			return json({
				success: false,
				message: `Failed to send ${errors.length} out of ${usersData.length} emails`,
				errors,
				successCount: successes.length
			}, { status: 207 }) // Multi-Status
		}

		return json({
			success: true,
			message: `Successfully sent ${successes.length} emails`,
			successCount: successes.length
		}, { status: 200 })
		// ...existing code...

	} catch (error) {
		console.error('Authentication error:', error)
		return json({ error: 'Internal server error' }, { status: 500 })
	}
}