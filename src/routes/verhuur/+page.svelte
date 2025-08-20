<script lang="ts">
	import { Category, Product } from "$lib/domain/Product"
	import ProductCard from "../../components/product/ProductCard.svelte"

	const imageUrl =
		"https://mlhqzqapatk4.i.optimole.com/cb:UGQh.37d8a/w:1440/h:1080/q:90/f:best/https://trbl.be/files/2025/07/5G_Kit-profile-scaled.jpg"

	const product = new Product(
		"5g-netwerk-kit",
		"5G Netwerk Kit",
		48.9,
		"Description",
		[Category.MEDIA],
		imageUrl
	)
</script>

<div class="mx-10 my-5">
	<h1 class="text-xl font-semibold">Producten</h1>
	<hr class="h-px mt-2 bg-base-300 border-none" />

	<div class="mt-4 mb-4 flex items-center justify-center mx-auto gap-4">
		<button class="btn btn-primary rounded-full">Geluid</button>
		<button class="btn btn-primary rounded-full">Verlichting</button>
		<button class="btn btn-primary rounded-full">Truss en statief</button>
		<button class="btn btn-primary rounded-full">Media</button>
	</div>

	<div class="mt-2 flex gap-2 flex-wrap">
		{#each Array(8) as _}
			<ProductCard {product}></ProductCard>
		{/each}
	</div>
</div>
