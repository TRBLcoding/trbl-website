<script lang="ts">
	export let label: string
	export let value: string
	export let required = false
	export let disabled = false
	export let size: "full" | "md" | "sm" | "xs" = "sm"
	export let autocomplete: AutoFill = ""

	$: selectId = label?.replace(/[ :]/g, "").toLowerCase()
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
		class="select border-2 w-full [&>option:not([value=''])]:text-base-content"
		class:text-[#8b8b8c]={value === ""}
		bind:value
		{required}
		{autocomplete}
	>
		<option value="" disabled selected class="text-[#8b8b8c]!">Kies</option>
		<slot />
	</select>
</fieldset>
