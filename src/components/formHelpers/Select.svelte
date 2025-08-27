<script lang="ts">
	export let label: string
	export let value: string
	export let required = false
	export let disabled = false
	export let size: "full" | "md" | "sm" | "xs" = "sm"

	$: selectId = label?.replace(/[ :]/g, "").toLowerCase()

	function removePlaceholderStyle(event: Event) {
		;(event?.target as HTMLElement).classList.remove("placeholder-style")
	}
</script>

<fieldset
	class="fieldset w-full"
	class:max-w-md={size === "md"}
	class:max-w-sm={size === "sm"}
	class:max-w-xs={size === "xs"}
>
	<label class="label text-base" for={selectId}>
		{label}
		{#if required}
			<span class="text-red-500 font-bold">*</span>
		{/if}
	</label>
	<select
		id={selectId}
		{disabled}
		class="select select-bordered border-2 placeholder-style w-full"
		bind:value
		on:change={removePlaceholderStyle}
		{required}
	>
		<option disabled selected>Kies</option>
		<slot />
	</select>
</fieldset>
