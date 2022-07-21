<script>
  import Header from "./Header.svelte";

  import Circle from "./Circle.svelte";
  import { color2str, getRandomColor } from "./utils";
  import Colors from "./Colors.svelte";

  let message = "when you were ready, click on submit";
  let survivedLevels = 0;
  let failed = false;
  let score = 100;
  let time = 30;
  let expectedColor = getRandomColor();
  console.time(JSON.stringify(expectedColor));

  $: console.log(time);
  let circleColor = [0, 0, 0];

  function restart() {
    score = 100;
    reset();
    circleColor = [0, 0, 0];
    failed = false;
    survivedLevels = 0;
    message = "when you were ready, click on submit";
  }

  function reset() {
    console.timeEnd(JSON.stringify(expectedColor));
    expectedColor = getRandomColor();
    console.time(JSON.stringify(expectedColor));
    time = 30;
  }

  function fail() {
    failed = true;
    message = `You survived ${survivedLevels} levels`;
  }

  function validate() {
    if (circleColor[0] + circleColor[1] + circleColor[2] === 0) {
      return;
    }
    const diff =
      Math.abs(expectedColor[0] - circleColor[0]) +
      Math.abs(expectedColor[1] - circleColor[1]) +
      Math.abs(expectedColor[2] - circleColor[2]);

    circleColor = [0, 0, 0];

    message = `you lost ${diff} scores`;
    score = score - diff;
    if (score <= 0) {
      fail();
    }
    survivedLevels++;
    reset();
  }

  $: started = circleColor[0] + circleColor[1] + circleColor[2] !== 0;
  // setInterval(() => {
  //   console.log("Timeout");
  //   if (started) {
  //     time = time - 1;
  //   }
  // }, 1000);
</script>

<!-- <div id="triangle-up" /> -->
<div class="main" style:background-color={color2str(expectedColor)}>
  <Header level={survivedLevels} />
  <!-- <div style:width="100%">
    <div
      style:height="20px"
      style:background-color="white"
      style:width="{(100 * time) / 30}%"
      style:transition="all 1s linear"
    >
      {time}
    </div>
  </div> -->

  <div class="content-header">
    <p class="message message-top">Mix colors to hide the circle</p>
    <p class="message score" class:alerting={score < 50 && score >= 0}>
      {score}
    </p>
  </div>
  <p class="message message-bottom">{message}</p>
  <div class="center">
    <Circle
      disabled={failed}
      on:click={() => (failed ? restart() : validate())}
      color={circleColor}
    />
  </div>

  <Colors disabled={failed} bind:value={circleColor} />
</div>

<style>
  #triangle-up {
    width: 0;
    height: 0;
    border-left: 50px solid transparent;
    border-right: 50px solid transparent;
    border-bottom: 100px solid red;
  }
  p {
    font-size: 24px;
    font-weight: bold;
  }

  .content-header {
    margin-top: 32px;
  }
  .main {
    height: 100%;
    transition: all ease-out 0.5s;
    display: flex;
    flex-direction: column;
  }

  .alerting {
    text-shadow: 0px 0px var(--radius) red;
    animation: alert 0.5s ease-out infinite;
    animation-direction: alternate;
  }

  @keyframes alert {
    0% {
      --radius: 0;
    }
    10% {
      --radius: 1px;
    }
    20% {
      --radius: 2px;
    }
    30% {
      --radius: 3px;
    }
    40% {
      --radius: 4px;
    }
    50% {
      --radius: 5px;
    }
    60% {
      --radius: 6px;
    }
    70% {
      --radius: 7px;
    }
    80% {
      --radius: 8px;
    }
    90% {
      --radius: 9px;
    }
    100% {
      --radius: 10px;
    }
  }
  .center {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .message {
    margin-top: 4px;
    padding-left: 32px;
    padding-right: 32px;
    font-size: 24px;
    font-weight: 400;
    font: monospace;
    text-align: center;
    color: white;
    /* text-shadow: 1px 1px 54px black; */
  }

  .message-top,
  .message-bottom {
    opacity: 0.8;
  }

  .score {
    font-size: 48px;
  }
</style>
