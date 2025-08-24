<script lang="ts">
	import { faEnvelope, faLocationDot } from "@fortawesome/free-solid-svg-icons"
	import Carousel from "../components/Carousel.svelte"
	import Fa from "svelte-fa"

	const imageUrl =
		"https://mlhqzqapatk4.i.optimole.com/cb:UGQh.37d8a/w:300/h:300/q:90/rt:fill/g:ce/f:best/https://trbl.be/files/2023/01/SpeakSet1_Blurred-BG.jpg"

	const images = [
		{
			name: "a",
			imageUrl:
				"https://mlhqzqapatk4.i.optimole.com/cb:UGQh.37d8a/w:1620/h:1080/q:90/f:best/https://trbl.be/files/2023/01/NVDJB_Klaar.jpg",
		},
		{
			name: "b",
			imageUrl:
				"https://mlhqzqapatk4.i.optimole.com/cb:UGQh.37d8a/w:1619/h:1080/q:90/f:best/https://trbl.be/files/2023/10/20231020_203312496_iOS-scaled.jpg",
		},
		{
			name: "b",
			imageUrl:
				"https://mlhqzqapatk4.i.optimole.com/cb:UGQh.37d8a/w:756/h:504/q:90/f:best/https://trbl.be/files/2023/01/NVDJBG_Mensen.jpg",
		},
		{
			name: "b",
			imageUrl:
				"https://mlhqzqapatk4.i.optimole.com/cb:UGQh.37d8a/w:1620/h:1080/q:90/f:best/https://trbl.be/files/2023/01/OogappelReunie_Klaar.jpg",
		},
		{
			name: "b",
			imageUrl:
				"https://mlhqzqapatk4.i.optimole.com/cb:UGQh.37d8a/w:746/h:504/q:90/f:best/https://trbl.be/files/2023/08/Soundgarden23.jpg",
		},
		{
			name: "b",
			imageUrl:
				"https://mlhqzqapatk4.i.optimole.com/cb:UGQh.37d8a/w:756/h:504/q:90/f:best/https://trbl.be/files/2023/08/Lodejardin23.jpg",
		},
		{
			name: "b",
			imageUrl:
				"https://mlhqzqapatk4.i.optimole.com/cb:UGQh.37d8a/w:1620/h:1080/q:90/f:best/https://trbl.be/files/2023/01/Gentbrugge-feest.jpg",
		},
	]
</script>

<!-- Static image -->
<div class="md:fixed inset-0 z-0">
	<img src="Camonigrava.jpg" alt="Foto Camonigrava" class="w-full" />
</div>

<!-- Scrollable content -->
<div class="relative z-10">
	<!-- Welcome card -->
	<div class="xl:h-[650px] lg:h-[550px] md:h-[350px] w-full relative">
		<!-- Large Welcome card -->
		<div
			class="absolute right-0 bottom-0 xl:mr-45 xl:mb-30 lg:mr-20 lg:mb-15 mx-10 mb-7 hidden xs:block"
		>
			<div class="card bg-base-100 sm:w-[550px] shadow-sm">
				<div class="card-body">
					<h2 class="card-title text-xl font-bold">
						TRBL - Passie voor licht en geluid!
					</h2>
					<p class="text-[15px]">
						Van het maken en ontwerpen van custom luidspreker- en lichtsystemen,
						tot het voorzien van mobiele installaties en technische
						ondersteuning op fuiven en evenementen!
					</p>
					<div class="card-actions justify-start mt-4">
						<button class="btn btn-primary px-6 uppercase text-[16px]">
							Contact
						</button>
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
		<div class="flex gap-16">
			<div class="flex flex-col items-center gap-2">
				<img src={imageUrl} alt="temp" />
				<div class="text-xl font-semibold">Geluid</div>
			</div>
			<div class="flex flex-col items-center gap-2">
				<img src={imageUrl} alt="temp" />
				<div class="text-xl font-semibold">Verlichting</div>
			</div>
			<div class="flex flex-col items-center gap-2">
				<img src={imageUrl} alt="temp" />
				<div class="text-xl font-semibold">Truss en Statief</div>
			</div>
			<div class="flex flex-col items-center gap-2">
				<img src={imageUrl} alt="temp" />
				<div class="text-xl font-semibold">Media</div>
			</div>
		</div>
		<a href="/todo" class="btn btn-primary w-fit">Meer producten tonen</a>
	</div>

	<div class="w-full bg-gray-600 flex justify-center align-middle">
		<div class="text-4xl font-semibold text-white my-12 text-center">
			Enkele van onze projecten:
		</div>
	</div>
	<div class="h-[500px] overflow-hidden flex relative">
		<img
			src="Scheveneken.jpg"
			alt="Foto Camonigrava"
			class="w-full h-full object-cover"
		/>
		<div class="absolute inset-0 flex items-center justify-center">
			<Carousel {images} />
		</div>
	</div>

	<!-- Contact -->
	<div class="w-full bg-gray-600 flex justify-center align-middle">
		<div class="text-4xl font-semibold text-white my-12 text-center">
			Contact:
		</div>
	</div>
	<div class="w-full bg-base-100 pb-10">
		<div class="flex max-w-3/4 mx-auto pt-5 gap-10">
			<div class="text-xl flex-1">
				<div class="text-xl font-semibold mb-1 flex items-center gap-2">
					<Fa icon={faLocationDot} class="" />
					Locatie
				</div>

				<iframe
					src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d5015.902493986725!2d3.7271249999999996!3d51.053988!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c3711e66de30cf%3A0xfd4288790b25d4d3!2sTRBL%20Sound%20and%20Light!5e0!3m2!1sen!2sus!4v1751834187894!5m2!1sen!2sus"
					class="w-full pt-4"
					height="405"
					loading="lazy"
					referrerpolicy="no-referrer-when-downgrade"
					title="Google Maps"
				></iframe>
			</div>
			<div class="flex-1">
				<div class="max-w-lg">
					<div class="text-xl font-semibold mb-1 flex items-center gap-2">
						<Fa icon={faEnvelope} class="" />
						Stuur een bericht
					</div>
					<div class="flex gap-6">
						<fieldset class="fieldset text-[15px] w-full">
							<legend class="fieldset-legend">Voornaam</legend>
							<input type="text" class="input" placeholder="Voornaam" />
						</fieldset>
						<fieldset class="fieldset text-[15px] w-full">
							<legend class="fieldset-legend">Achternaam</legend>
							<input type="text" class="input" placeholder="Achternaam" />
						</fieldset>
					</div>
					<fieldset class="fieldset text-[15px]">
						<legend class="fieldset-legend">Email</legend>
						<input type="email" class="input w-full" placeholder="Email" />
					</fieldset>
					<fieldset class="fieldset text-[15px]">
						<legend class="fieldset-legend">Onderwerp</legend>
						<input type="text" class="input w-full" placeholder="Onderwerp" />
					</fieldset>
					<fieldset class="fieldset text-[15px]">
						<legend class="fieldset-legend">Onderwerp</legend>
						<textarea class="input w-full h-30" placeholder="Onderwerp"
						></textarea>
					</fieldset>
					<button type="submit" class="btn btn-primary mt-3"
						>Verstuur bericht</button
					>
				</div>
			</div>
		</div>
	</div>
</div>
