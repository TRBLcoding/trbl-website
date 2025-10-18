<script lang="ts">
	export let value1: string
	export let value2: string
	export let groupValue: string
</script>

<label
	class="flex items-start gap-3 cursor-pointer p-3 rounded-lg hover:bg-base-200"
>
	<input
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
