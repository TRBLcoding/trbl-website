<script lang="ts">
	export let label = ""
	export let value: string
	export let required = false
	export let disabled = false
	export let size: "full" | "md" | "sm" | "xs" = "sm"
	export let id = ""
	import { v4 as uuidv4 } from "uuid"

	export let placeholder = ""
	export let labelClass = ""
	let classList = ""
	export { classList as class }

	$: inputId =
		id ||
		label?.replace(/[ :]/g, "").replace(" ", "-").toLowerCase() ||
		placeholder?.replace(" ", "-").toLowerCase() ||
		uuidv4()
</script>

<div
	class={"w-full " + classList}
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
		id={inputId}
		class="input border-2 w-full h-74"
		{required}
		{placeholder}
		bind:value
		{disabled}
	>
	</textarea>
</div>
