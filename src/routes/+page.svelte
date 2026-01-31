<script lang="ts">
	import { browser } from "$app/environment"
	import { resolve } from "$app/paths"
	import ContactForm from "$components/ContactForm.svelte"
	import OpenStreetMapMap from "$components/maps/OpenStreetMapMap.svelte"
	import type { ContactRequestJSON } from "$lib/domain/ContactMessage"
	import { pageHeadStore } from "$lib/stores/PageHeadStore"
	import { faLocationDot } from "@fortawesome/free-solid-svg-icons"
	import Fa from "svelte-fa"
	import Carousel from "$components/carousel/Carousel.svelte"

	let windowWidth = 0
	$: mapHeight = windowWidth >= 640 ? 618 : 400

	const images = !browser
		? []
		: [
				{ name: "", imageUrl: `${location.href}carousel/NVDJBG_Klaar.webp` },
				{ name: "", imageUrl: `${location.href}carousel/NVDJBG_2.webp` },
				{ name: "", imageUrl: `${location.href}carousel/NVDJBG_Mensen.webp` },
				{
					name: "",
					imageUrl: `${location.href}carousel/OogappelReunie_Klaar.webp`,
				},
				{ name: "", imageUrl: `${location.href}carousel/Soundgarden23.webp` },
				{ name: "", imageUrl: `${location.href}carousel/Lodejardin23.webp` },
				{
					name: "",
					imageUrl: `${location.href}carousel/Gentbrugge-feest.webp`,
				},
			]

	// -- Contact --
	let firstName: string = ""
	let lastName: string = ""
	let emailAddress: string = ""
	let subject: string = ""
	let message: string = ""

	type ResultType = {
		type: "error" | "success"
		detailedError?: string
		error?: { message: string }
	}

	async function send() {
		const body: ContactRequestJSON = {
			firstName,
			lastName,
			emailAddress,
			subject,
			message,
		}
		const response = await fetch("/api/contact", {
			method: "POST",
			body: JSON.stringify(body),
		})
		const responseJson: ResultType = await response.json()

		if (!response.ok) {
			if (responseJson.detailedError)
				throw new Error(
					`HTTP error: ${response.status} (${response.statusText}), ${responseJson.detailedError}`
				)

			throw new Error(`HTTP error: ${response.status} ${response.statusText}`)
		}
		console.log("Email sent successfully")
	}

	// -- Page title --
	pageHeadStore.updatePageTitle("")
</script>

<svelte:window bind:innerWidth={windowWidth} />

<!-- Static image -->
<div class="md:fixed inset-0 z-0">
	<img src="/camonigrava.jpg" alt="Foto Camonigrava" class="w-full" />
</div>

<!-- Scrollable content -->
<div class="relative z-10">
	<!-- Welcome card -->
	<div class="xl:h-162.5 lg:h-137.5 md:h-87.5 w-full relative">
		<!-- Large Welcome card -->
		<div
			class="absolute right-0 bottom-0 xl:mr-45 xl:mb-30 lg:mr-20 lg:mb-15 mx-10 mb-7 hidden xs:block"
		>
			<div class="card bg-base-100 sm:w-137.5 shadow-sm">
				<div class="card-body">
					<h2 class="card-title text-2xl font-bold">
						TRBL - Passie voor licht en geluid!
					</h2>
					<p class="text-[15px]">
						Van het maken en ontwerpen van custom luidspreker- en lichtsystemen,
						tot het voorzien van mobiele installaties en technische
						ondersteuning op fuiven en evenementen!
					</p>
					<div class="card-actions justify-start mt-3">
						<a class="btn btn-primary px-6 text-[16px]" href="/#contact">
							Contact
						</a>
						<a class="btn btn-soft px-6 text-[16px]" href={resolve("/products")}>
							Producten
						</a>
					</div>
				</div>
			</div>
		</div>

		<!-- Mini Welcome card -->
		<div class="w-full absolute bottom-0 p-10 mx-auto mb-5 xs:hidden">
			<div class="card bg-base-100 shadow-sm opacity-90">
				<div class="card-body mx-auto">
					<h2 class="card-title text-center font-bold">
						TRBL - Passie voor licht en geluid!
					</h2>
				</div>
			</div>
		</div>
	</div>

	<div class="w-full bg-gray-600 flex justify-center align-middle">
		<div class="text-4xl font-semibold text-white my-12 text-center">
			Aanbod Verhuur:
		</div>
	</div>
	<div
		class="w-full bg-base-100 flex flex-col justify-center items-center gap-10 py-8"
	>
		<div class="flex flex-wrap gap-4 md:gap-12 lg:gap-16 justify-center mx-5">
			<div class="flex flex-col items-center gap-2">
				<a class="avatar w-70 h-70" href="products?filter=Sound" tabindex={-1}>
					<img src="/sound.webp" alt="temp" class="rounded-lg" />
				</a>
				<a
					class="text-xl font-semibold link link-hover"
					href="products?filter=Sound">Geluid</a
				>
			</div>
			<div class="flex flex-col items-center gap-2">
				<a class="avatar w-70 h-70" href="products?filter=Light" tabindex={-1}>
					<img src="/light.webp" alt="temp" class="rounded-lg" />
				</a>
				<a
					class="text-xl font-semibold link link-hover"
					href="products?filter=Light">Verlichting</a
				>
			</div>
			<div class="flex flex-col items-center gap-2">
				<a class="avatar w-70 h-70" href="products?filter=Truss" tabindex={-1}>
					<img src="/truss.webp" alt="temp" class="rounded-lg" />
				</a>
				<a
					class="text-xl font-semibold link link-hover"
					href="products?filter=Truss">Truss en Statief</a
				>
			</div>
			<div class="flex flex-col items-center gap-2">
				<a class="avatar w-70 h-70" href="products?filter=Media" tabindex={-1}>
					<img src="/media.webp" alt="temp" class="rounded-lg" />
				</a>
				<a
					class="text-xl font-semibold link link-hover"
					href="products?filter=Media">Media</a
				>
			</div>
		</div>
		<a href={resolve("/products")} class="btn btn-primary w-fit"
			>Meer producten tonen</a
		>
	</div>

	<div class="w-full bg-gray-600 flex justify-center align-middle">
		<div class="text-4xl font-semibold text-white my-12 text-center">
			Enkele van onze projecten:
		</div>
	</div>
	<div class="h-125 overflow-hidden flex relative">
		<img
			src="/scheveneken.jpg"
			alt="Foto Scheveneken"
			class="w-full h-full object-cover"
		/>
		<div class="absolute inset-0 flex items-center justify-center">
			<Carousel {images} loop />
		</div>
	</div>

	<!-- Contact -->
	<div class="w-full bg-gray-600 flex justify-center align-middle">
		<div
			id="contact"
			class="text-4xl font-semibold text-white my-12 text-center"
		>
			Contact:
		</div>
	</div>
	<div class="w-full bg-base-100 pb-10">
		<div
			class="flex flex-col md:flex-row justify-center mx-10 pt-5 gap-10 lg:max-w-6xl xl:mx-auto"
		>
			<div class="text-xl flex-1">
				<div class="text-xl font-semibold mb-1 flex items-center gap-2">
					<Fa icon={faLocationDot} />
					Locatie
				</div>
				<OpenStreetMapMap height={mapHeight} />
			</div>
			<div class="flex-1 flex md:block justify-center">
				<div class="w-full max-w-lg">
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

<style lang="postcss">
	:global(html) {
		scroll-behavior: smooth !important;
	}
</style>
