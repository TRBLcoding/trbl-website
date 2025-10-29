<script lang="ts">
	import { validateEmail } from "$lib/utils/Validators"
	import {
		faEye,
		faEyeSlash,
		type IconDefinition,
	} from "@fortawesome/free-solid-svg-icons"
	import dayjs from "dayjs"
	import Fa from "svelte-fa"

	export let label = ""
	export let value: any
	export let required = false
	export let disabled = false
	export let size: "full" | "md" | "sm" | "xs" = "sm"

	export let type: "text" | "number" | "email" | "date" | "password"
	export let placeholder = ""
	export let autocomplete: AutoFill = ""
	export let labelClass = ""
	export let edited = false
	export let validate: (value: string) => string | undefined = () => ""
	export let onInput: () => void = () => {}
	export let iconLeft: IconDefinition | undefined = undefined
	export let iconRight: IconDefinition | undefined = undefined
	export let toggleText = type === "password"
	export let toggled = false
	export let step = ""
	export let min = ""

	$: inputId = label?.replace(/[ :]/g, "").toLowerCase() || "input-field"
	$: error = validate(value)
	$: showIconLeft = $$slots.iconLeft || iconLeft
	$: showIconRight = $$slots.iconRight || iconRight || toggleText
	$: hasBadge = $$slots.badge
	$: isJoined = $$slots.join

	// -- Value handling --
	let internalValue = ""
	$: updateInternal(value)
	$: updateExternal(internalValue)

	function updateInternal(_: any) {
		if (value === internalValue) return
		if (type === "date") {
			if (!value) internalValue = ""
			else {
				if (value?.format("YYYY-MM-DD") === internalValue) return
				internalValue = value.format("YYYY-MM-DD")
			}
		} else internalValue = value
	}
	function updateExternal(_: any) {
		if (type === "date") value = dayjs(internalValue)
		else value = internalValue
	}

	// -- Type handling --
	function typeAction(node: HTMLInputElement) {
		// Replace email type with text type, because browser email validation is kinda crappy
		if (type === "email" && required) {
			const oldValidate = validate
			validate = (value) => validateEmail(value) || oldValidate(value)
			node.type = "text"
		} else {
			node.type = type
		}
	}

	// -- Toggle text --
	let input: HTMLInputElement

	$: if (input?.type) input.type = toggled ? "text" : type
</script>

<div
	class="w-full"
	class:max-w-md={size === "md"}
	class:max-w-sm={size === "sm"}
	class:max-w-xs={size === "xs"}
>
	{#if label}
		<div class="flex items-center" class:my-1={hasBadge}>
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
	<div class="relative w-full" class:join={isJoined}>
		{#if showIconLeft}
			<div
				class="flex items-center absolute inset-y-0 left-0 pl-3 pointer-events-none z-10"
			>
				<slot name="iconLeft">
					{#if iconLeft}
						<Fa icon={iconLeft} class="opacity-50" />
					{/if}
				</slot>
			</div>
		{/if}
		<input
			id={inputId}
			use:typeAction
			bind:this={input}
			bind:value={internalValue}
			{placeholder}
			{required}
			{disabled}
			{autocomplete}
			on:focusout={() => (edited = true)}
			on:input={onInput}
			class="input border-2 w-full flex-1 join-item"
			class:bg-base-300={disabled}
			class:text-slate-700={disabled}
			class:pl-9={showIconLeft}
			class:pr-9={showIconRight}
			class:border-base-300={disabled}
			{step}
			{min}
		/>
		{#if showIconRight}
			<div class="flex items-center absolute inset-y-0 right-0 pr-3">
				<slot name="iconRight">
					{#if type !== "password" && iconRight}
						<Fa icon={iconRight} class="text-gray-500" />
					{:else}
						<button
							type="button"
							on:click={() => (toggled = !toggled)}
							tabindex="-1"
						>
							<Fa
								icon={toggled ? faEyeSlash : faEye}
								class="text-gray-500 w-5"
							/>
						</button>
					{/if}
				</slot>
			</div>
		{/if}
		<slot name="join"></slot>
	</div>
	{#if error && edited}
		<label class="label" for={inputId}>
			<span class={"label-text alt text-error " + labelClass}>
				{error}
			</span>
		</label>
	{/if}
</div>
