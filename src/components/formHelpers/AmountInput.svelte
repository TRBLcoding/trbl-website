<script lang="ts">
	import {
		faMinus,
		faPlus,
		faTrashCan,
	} from "@fortawesome/free-solid-svg-icons"
	import Fa from "svelte-fa"

	export let amount: number
	export let disabled: boolean = false
	export let size: "sm" | "md" | "lg" = "sm"
	export let min: number = 0
	export let max: number = Infinity
	export let step: number = 1
	export let required: boolean = false
	export let deleteOnZero: boolean = false // Overrides min amount when true
	export let onChange: () => void = () => {} // Called when increased, decreased or on blur
	let classList = ""
	export { classList as class }

	function decrease() {
		console.log(amount, min)
		if (deleteOnZero ? amount <= -1 : amount <= min) return
		amount = amount - 1
		onChange()
	}
	function increase() {
		if (amount >= max) return
		amount = amount + 1
		onChange()
	}
</script>

<div class={`join flex ${classList}`}>
	<button
		class={`btn btn-square join-item btn-${size} btn-${deleteOnZero && amount == 0 ? "error" : "neutral"}`}
		disabled={deleteOnZero ? amount === -1 : amount <= min}
		type="button"
		on:click={decrease}
		title={deleteOnZero && amount === 0 ? "Verwijderen" : "Verlagen"}
	>
		<Fa icon={deleteOnZero && amount === 0 ? faTrashCan : faMinus} />
	</button>
	<label
		class={`input join-item flex-1 bg-base-300! border-base-300! input-${size}`}
	>
		<input
			class="text-center font-bold"
			type="number"
			bind:value={amount}
			{min}
			{step}
			{required}
			{disabled}
			on:blur={onChange}
		/>
	</label>
	<button
		class={`btn btn-square btn-neutral join-item btn-${size}`}
		disabled={amount >= max}
		type="button"
		on:click={increase}
		title="Verhogen"
	>
		<Fa icon={faPlus} size="lg" />
	</button>
</div>

<style lang="postcss">
	/* Chrome, Safari, Edge, Opera */
	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}

	/* Firefox */
	input[type="number"] {
		-moz-appearance: textfield;
	}
</style>
