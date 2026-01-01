<script lang="ts">
	import { v4 as uuidv4 } from "uuid"

	export let value1: string
	export let value2: string
	export let groupValue: string
	export let id = ""

	$: inputId = id || uuidv4()
</script>

<label
	class="flex items-start gap-3 cursor-pointer p-3 rounded-lg hover:bg-base-200"
>
	<input
		id={inputId + "-1"}
		type="radio"
		class="radio radio-primary mt-0.5"
		value={value1}
		bind:group={groupValue}
	/>
	<span class="flex-1">
		<span class="font-medium"><slot name="title1"></slot></span>
		<span class="block text-sm text-base-content/70 mt-1">
			<slot name="content1"></slot>
		</span>
	</span>
</label>

<label
	class="flex items-start gap-3 cursor-pointer p-3 rounded-lg hover:bg-base-200"
>
	<input
		id={inputId + "-2"}
		type="radio"
		class="radio radio-primary mt-0.5"
		value={value2}
		bind:group={groupValue}
	/>
	<span class="flex-1">
		<span class="font-medium"><slot name="title2"></slot></span>
		<span class="block text-sm text-base-content/70 mt-1">
			<slot name="content2"></slot>
		</span>
	</span>
</label>
