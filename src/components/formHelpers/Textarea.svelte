<script lang="ts">
	export let label = ""
	export let value: any
	export let required = false
	export let disabled = false
	export let size: "full" | "md" | "sm" | "xs" = "sm"

	export let placeholder = ""
	export let labelClass = ""

	$: inputId = label?.replace(/[ :]/g, "").toLowerCase() || "input-area"
</script>

<div
	class="w-full"
	class:max-w-md={size === "md"}
	class:max-w-sm={size === "sm"}
	class:max-w-xs={size === "xs"}
>
	{#if label}
		<div class="flex items-center">
			<label class="label" for={inputId}>
				<span class={"label-text " + labelClass}>
					{label}
					{#if required}
						<span class="text-red-500 font-bold">*</span>
					{/if}
				</span>
			</label>
			<slot name="badge"></slot>
		</div>
	{/if}
	<textarea
		class="input border-2 w-full h-74"
		{required}
		{placeholder}
		bind:value
		{disabled}
	>
	</textarea>
</div>
