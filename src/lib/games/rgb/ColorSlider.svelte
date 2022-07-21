<script>
  import { drag } from "./drag";

  export let value;

  let width;
  /**
   * color name
   * @type {'red'|'green'|'blue'}
   */
  export let name;
  export let disabled;

  function handle(object) {
    console.log(object.startPos[0]);
    if (disabled) {
      return;
    }
    value = Math.floor(
      (255 * object.delta[0]) / width +
        (255 * (object.startPos[0] - (window.innerWidth - width) / 2)) / width
    );
  }
</script>

<div
  bind:offsetWidth={width}
  class="root"
  class:disabled
  use:drag={handle}
  style:border-color={name}
>
  <div
    class="slider"
    style:background-color={name}
    style:width="{(100 * value) / 255}%"
  >
    {name}
  </div>
</div>

<style>
  .root {
    height: 32px;
    width: 100%;
    max-width: 512px;
    background-color: rgba(255, 255, 255, 0.5);
    margin-left: auto;
    margin-right: auto;
    border: 1px solid;
  }

  .slider {
    display: flex;
    align-items: center;
    justify-content: start;
    padding-left: 16px;
    color: white;
    height: 100%;
  }

  .disabled {
    opacity: 0.2;
  }
</style>
