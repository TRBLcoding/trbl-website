<script lang="ts">
	import ContactForm from "$components/ContactForm.svelte"
	import type { ContactRequestJSON } from "$lib/domain/ContactMessage"
	import { pageHeadStore } from "$lib/stores/PageHeadStore"
	import type { ContactResponseJSON } from "../api/contact/+server"

	// -- Contact --
	let firstName: string = ""
	let lastName: string = ""
	let emailAddress: string = ""
	let subject: string = ""
	let message: string = ""

	async function send() {
		const body: ContactRequestJSON = {
			firstName,
			lastName,
			emailAddress,
			subject,
			message: `[Op maat] ${message}`,
		}
		const response = await fetch("/api/contact", {
			method: "POST",
			body: JSON.stringify(body),
		})
		const responseJson: ContactResponseJSON = await response.json()

		if (!response.ok) {
			if (responseJson.message)
				throw new Error(
					`HTTP error: ${response.status} (${response.statusText}), ${responseJson.message}`,
				)

			throw new Error(`HTTP error: ${response.status} ${response.statusText}`)
		}
		console.log("Email sent successfully")
	}

	// -- Page title --
	pageHeadStore.updatePageTitle("Op maat")
</script>

<div class="bg-linear-to-br from-base-100 via-base-200 to-base-100">
	<div class="px-4 py-6">
		<div class="max-w-7xl mx-auto">
			<!-- Side by Side Layout -->
			<div class="flex gap-4 flex-col lg:flex-row items-center lg:items-start">
				<!-- Left Side - Content -->
				<div class="text-center lg:text-left">
					<h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-base-content mb-6">
						Oplossingen op maat
					</h1>
					<div class="w-20 h-1 bg-primary mb-6 mx-auto lg:mx-0"></div>
					<p class="text-lg md:text-xl text-base-content/80 leading-relaxed mb-6">
						Groter evenement, of niet zeker wat u allemaal nodig hebt? 
						Neem vrijblijvend contact op en we komen zo snel mogelijk tot u terug!
					</p>
					<p class="text-base-content/60 text-sm">
						We streven ernaar om binnen 24 uur te reageren op uw aanvraag.
					</p>
				</div>

				<!-- Right Side - Contact Form -->
				<div class="bg-base-100 rounded-2xl shadow-2xl p-6 md:p-10 border border-base-300 w-full max-w-lg">
					<ContactForm
						bind:firstName
						bind:lastName
						bind:emailAddress
						bind:subject
						bind:message
						{send}
					/>
				</div>
			</div>
		</div>
	</div>
</div>
