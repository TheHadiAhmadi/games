<script>
  import githubSVG from "$assets/github.svg";

  export let level = 0;
</script>

<div class="header">
  <div class="header-bg header-before" />
  <div class="header-bg level-container">
    <p class="level-title">level</p>
    <p class="level">{level}</p>
  </div>
  <div class="header-bg header-after">
    <a target="_blank" href="https://github.com/TheHadiAhmadi/guess-rgb">
      <img alt="" src={githubSVG} />
    </a>
  </div>
</div>

<style>
  p {
    font-size: 24px;
    font-weight: bold;
  }

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 56px;
    color: white;
    font-weight: 300;
  }
  .header-bg {
    background-color: #00000044;
    border-bottom: 1px solid #00000044;
  }

  .header .level-container .level-title {
    font-weight: 300;
  }

  .header .level-container {
    align-items: center;
    padding-top: 4px;

    justify-content: end;
    display: flex;
    flex-direction: column;
    height: 100px;
    width: 20%;
    border: 1px solid #00000032;
    box-shadow: 0 0 2px #00000022;
  }

  .level-title {
    font-size: 18px;
  }

  .level {
    font-size: 48px;
    font-weight: bold;
  }

  .header-before {
    height: 56px;
    width: 40%;
  }
  .header-after {
    height: 56px;
    width: 40%;
    align-items: center;
    justify-content: flex-end;
    padding-right: 16px;
    display: flex;
  }
</style>
