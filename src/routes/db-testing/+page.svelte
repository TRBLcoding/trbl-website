<script lang="ts">
	import { supabase } from "$lib/supabaseClient"
	
	let products: any[] = []

	async function load() {
		const response = await supabase.from("products").select()
		if(response.error) {
			console.error("Error loading products:", response.error)
		} else {
			products = response.data || []
		}
		
	}
</script>

<h1 class="text-2xl">DB Testing</h1>

<button class="btn btn-primary" on:click={load}>load products</button>

{#if products.length > 0}
	<table class="table">
		<thead>
			<tr>
				<th>Naam</th>
				<th>Prijs</th>
				<th>Categorie</th>
				<th>Type</th>
				<th>Beschrijving</th>
			</tr>
		</thead>
		<tbody>
			{#each products as product}
				<tr>
					<td>{product.name}</td>
					<td>€{product.price}</td>
					<td>{product.category}</td>
					<td>{product.type}</td>
					<td>{product.description}</td>
				</tr>
			{/each}
		</tbody>
	</table>
{/if}
