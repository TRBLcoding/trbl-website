<script lang="ts">
  import Checkbox from "$components/formHelpers/Checkbox.svelte"
  import CLEditor from "$components/formHelpers/CLEditor.svelte"
  import Dropzone from "$components/formHelpers/Dropzone.svelte"
  import Input from "$components/formHelpers/Input.svelte"
  import MultiSelect from "$components/formHelpers/MultiSelect.svelte"
  import { CategoryValues } from "$lib/domain/Product"

  export let title = ""
  export let visible = true
  export let combinedImages: (string | File)[] = []
  export let tags: string[] = []
  export let content = ""

  export let submitLabel: string
  export let onSave: () => Promise<void>
  export let newProduct: boolean

  let saving = false
  let errorMessage = ""

  async function onSubmitWrapper(event: SubmitEvent) {
    event.preventDefault()
    saving = true
    errorMessage = ""
    try {
      await onSave()
    } catch (error) {
      errorMessage = "error occured"
    }
    saving = false
  }
</script>

<form class="flex flex-col gap-2" on:submit={onSubmitWrapper}>
  <Input
    type="text"
    label="Naam:"
    placeholder="Titel"
    bind:value={title}
    required
  />
  <Checkbox label="Zichtbaar" bind:value={visible} />

  <Dropzone
    label="Afbeeldingen:"
    bind:combinedImages
    showDiskSize={newProduct}
  />
   <MultiSelect
    label="Categorieën:"
    bind:values={tags}
    options={CategoryValues}
  />
  <CLEditor label="Beschrijving van product:" bind:value={content} />

  <div class="w-fit" class:hover:cursor-wait={saving}>
    <button
      class="btn btn-primary mt-2 max-w-sm"
      type="submit"
      disabled={saving}
    >
      {submitLabel}
      <span class="loading loading-ring" class:hidden={!saving} ></span>
    </button>
  </div>
  {#if errorMessage}
    <p class="text-error">{errorMessage}</p>
  {/if}
</form>
