<script>
  import ColorSlider from "./ColorSlider.svelte";

  export let value = [0, 0, 0];
  export let disabled = false;
</script>

<div class="colors">
  <ColorSlider {disabled} name="red" bind:value={value[0]} />
  <ColorSlider {disabled} name="green" bind:value={value[1]} />
  <ColorSlider {disabled} name="blue" bind:value={value[2]} />
</div>

<style>
  .colors {
    padding: 4px;
    padding-bottom: 1.5rem;
  }
</style>
