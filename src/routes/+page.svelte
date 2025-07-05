<script lang="ts">
	const imageUrl =
		"https://mlhqzqapatk4.i.optimole.com/cb:UGQh.37d8a/w:300/h:300/q:90/rt:fill/g:ce/f:best/https://trbl.be/files/2023/01/SpeakSet1_Blurred-BG.jpg"
</script>

<!-- Static image -->
<div class="fixed inset-0 z-0">
	<img src="Camonigrava.jpg" alt="Foto Camonigrava" class="w-full" />
</div>

<!-- Scrollable content -->
<div class="relative z-10">
	<div class="h-[650px] w-full relative">
		<div class="absolute card bg-base-100 w-[550px] shadow-sm right-80 bottom-36">
			<div class="card-body">
				<h2 class="card-title">TRBL - Passie voor licht en geluid!</h2>
				<p>
					Van het maken en ontwerpen van custom luidspreker- en lichtsystemen,
					tot het voorzien van mobiele installaties en technische ondersteuning
					op fuiven en evenementen!
				</p>
				<div class="card-actions justify-start mt-4">
					<button class="btn btn-primary px-6">Contact</button>
				</div>
			</div>
		</div>
	</div>

	<div class="w-full bg-gray-600 flex justify-center align-middle">
		<div class="text-4xl font-semibold text-white my-12">Aanbod Verhuur:</div>
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
		<div class="text-4xl font-semibold text-white my-12">
			Enkele van onze projecten:
		</div>
	</div>
	<div class="h-[500px] overflow-hidden flex">
		<img
			src="Scheveneken.jpg"
			alt="Foto Camonigrava"
			class="w-full h-full object-cover"
		/>
	</div>

	<div class="w-full bg-gray-600 flex justify-center align-middle">
		<div class="text-4xl font-semibold text-white my-12">Contact:</div>
	</div>
	<div class="w-full h-[500px] bg-base-100 flex items-center justify-center">
		<div class="text-xl">TODO Contactformulier</div>
	</div>
</div>
