<script>
    import TableParent from './TableParent.svelte'
    import { Game } from './game.js'

    const game = Game({mineCount: 20});



</script>
<div class="p-4 -depth text-white h-screen flex flex-col">
    <div class="header depth flex items-center justify-between p-2 z-3 top-0 left-0 right-0 flex-shrink-0 h-16">
      <!-- <h1 class="font-bold">Minesweeper</h1> -->
      <div class="btn w-16">Minesweeper</div>
      <button class="-depth btn" id="btn-reset">Reset</button>
      <div id="btn-dark" class="-depth btn block dark:hidden">Dark</div>
      <div id="btn-light" class="-depth btn hidden dark:block">light</div>
     
    </div>
    <div class="header btn">Right Click/Long Press to Mark as flagged</div>
    <TableParent/>
</div>