<script lang="ts">
	import Tile from './Tile.svelte';
	import Game2048, { type TileData } from './2048-algorithms';
	import { onMount } from 'svelte';
    import drag, { type DragOptions } from '$lib/shared/drag';

	type Position = [x: number, y: number];
	type ActiveTile = {
		position: Position;
		prevPos: Position;
		state: string;
		value: number;
	};

	const game = new Game2048();

	let activeTiles: Record<string, ActiveTile> = {};

	let bestScore: number = 0;

	let board: HTMLDivElement;

	let data: TileData[][] = game.getData();

	let gameOver: boolean = false;

	let positions: Position[][] = [[], [], [], []];

	export let score: number = game.getScore();

	let showShowButton: boolean = false;

	let showButtons: boolean = false;

	let tiles: HTMLSpanElement[][] = [[], [], [], []];

	function updateData() {
		data = game.getData();
		score = game.getScore();

		if (gameOver) return;

		let savedPositions: Record<string, Position> = {};
		Object.entries(activeTiles).map(([key, value]) => {
			savedPositions[key] = activeTiles[key].position;
		});
		activeTiles = {};
		for (let i = 0; i < 4; i++) {
			for (let j = 0; j < 4; j++) {
				const tile = data[i][j];
				if (tile.value === 0) continue;

				if (!activeTiles[tile.id]) {
					activeTiles[tile.id] = {
						position: positions[i][j],
						prevPos: savedPositions[tile.id] ?? positions[i][j],
						state: tile.state!,
						value: tile.value
					};
				}
			}
		}
		if (game.isFull()) {
			console.log('gameOver');
			localStorage.setItem('best-score', JSON.stringify(Math.max(score, bestScore)));
			gameOver = true;

			return;
		}
	}

	function clickLeft() {
		game.moveLeft();
		updateData();
	}
	function clickRight() {
		game.moveRight();
		updateData();
	}
	function clickTop() {
		game.moveTop();
		updateData();
	}
	function clickBottom() {
		game.moveBottom();
		updateData();
	}

	onMount(() => {
		bestScore = JSON.parse(localStorage.getItem('best-score') || '0');
		window.addEventListener('keydown', (e) => {
			if (e.key === 'ArrowDown') clickBottom();
			if (e.key === 'ArrowUp') clickTop();
			if (e.key === 'ArrowLeft') clickLeft();
			if (e.key === 'ArrowRight') clickRight();
		});

		const boardRect = board.getClientRects()[0];

		for (let i = 0; i < 4; i++) {
			for (let j = 0; j < 4; j++) {
				const rect: DOMRect = tiles[i][j].getClientRects()[0];
				positions[i][j] = [rect.x - boardRect.x, rect.y - boardRect.y];
			}
		}

		if (window.innerHeight < 700) {
			showShowButton = false;
		} else {
			showShowButton = true;
		}
		updateData();
	});

	function handleMove({ detail }: { detail: DragOptions }) {
		console.log(detail);
		const dx = detail.delta[0];
		const dy = detail.delta[1];
		if (dy > -20 && dy < 20) {
			if (dx < -40) {
				clickLeft();
				detail.cancel();
			} else if (dx > 40) {
				clickRight();
				detail.cancel();
			}
		} else if (dx > -20 && dx < 20) {
			if (dy < -40) {
				clickTop();
				detail.cancel();
			} else if (dy > 40) {
				clickBottom();
				detail.cancel();
			}
		}
	}

	function reset() {
		game.reset();
		gameOver = false;
		bestScore = JSON.parse(localStorage.getItem('best-score') ?? '0');
		updateData();
	}
</script>

<div
	use:drag={{ axis: 'both', handleMove }}
	class="w-full h-full px-4 py-6 bg-yellow-100"
>
	<div class="flex flex-col justify-start  h-full max-w-400px mx-auto">
		<div class="flex w-full items-center">
			<div class="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-700 flex-1">2048</div>
			<div class="flex flex-row gap-1">
				<div class="score-btn">
					<span class="text-center font-bold text-gray-200 uppercase text-xs">score</span>
					<div class="text-2xl font-bold text-gray-100">{score}</div>
				</div>
				<div class="score-btn">
					<span class="text-center font-bold text-gray-200 uppercase text-xs">best</span>
					<div class="text-xl font-bold text-gray-100">{Math.max(score, bestScore)}</div>
				</div>
			</div>
		</div>

		<div class="flex flex-row items-center gap-1 my-4">
			<p class="text-gray-600 flex-1">
				Join the tiles, get to <b class="font-bold">2048!</b>
			</p>
			<button
				on:click={reset}
				class="sm:hidden py-1 px-5 ml-4 font-bold rounded bg-gray-700/30 hover:bg-gray-700/40 text-white"
			>
				New
			</button>
			<button
				on:click={reset}
				class="hidden sm:block  py-1 px-5 ml-4 font-bold rounded bg-gray-700/30 hover:bg-gray-700/40 text-white"
			>
				New Game
			</button>
		</div>
		<div class="text-gray-800 mb-4">
			You can play Original Game <a class="font-bold text-blue-700" href="https://play2048.co/">here</a>
		</div>
		<div class="flex flex-col">
			{#if gameOver}
				<div
					class="absolute z-1 left-0 right-0 top-0 bottom-0 font-bold text-gray-800 w-full h-full bg-gray-200/30 backdrop-filter  backdrop-blur-sm flex flex-col items-center justify-center text-5xl text-shadow"
				>
					<span>Game Over</span>
					<span class="text-lg font-semibold mt-2">
						Your Score was: <b class="font-extrabold">{score}</b>
					</span>
					<button
						on:click={reset}
						class="px-6 py-4 mt-8 text-xl font-extrabold bg-gray-800 hover:bg-gray-700 hover:shadow-lg text-white shadow rounded"
					>
						Reload
					</button>
				</div>
			{/if}

			<div
				bind:this={board}
				style="aspect-ratio: 1;"
				class="relative rounded p-0.75 grid grid-cols-4 grid-rows-4 bg-gray-400"
			>
				{#each Object.entries(activeTiles) as [key, value] (key)}
					<span
						id={key}
						class:hidden={value.value === 0}
						style:left="{value.position[0]}px"
						style:top="{value.position[1]}px"
						class:animate-bubble={value.state === 'merged'}
						class:animate-zoom-in={value.state === 'new'}
						class:animate-delay-150={value.state === 'merged'}
						class="animate-duration-400 absolute inline-block w-1/4 h-1/4 p-1.5"
					>
						<Tile
							prevPos={value.prevPos}
							position={value.position}
							id={key}
							state={value.state}
							number={value.value}
						/>
					</span>
				{/each}

				{#each [0, 0, 0, 0] as _i, i}
					{#each [0, 0, 0, 0] as _j, j}
						<div bind:this={tiles[i][j]} class="p-1.5 w-full h-full">
							<div class="bg-gray-300/50 rounded w-full h-full" />
						</div>
					{/each}
				{/each}
			</div>

			{#if showButtons}
				<div
					class="sm:hidden relative left-0 right-0 top-0 w-full p-2 bg-gray-500/20 border border-gray-500/30 rounded shadow mt-4 right-50 flex flex-col items-center justify-center gap-2 mb-2"
				>
					<button
						on:click={() => (showButtons = false)}
						class="absolute top-0 right-0 py-0 px-2 text-black/30 text-4xl"
					>
						&times;
					</button>
					<div
						on:click={clickTop}
						class="w-20 h-10 flex items-start justify-center p-1 bg-gray-400/90 shadow hover:shadow-lg cursor-pointer text-white text-shadow rounded hover:bg-gray-400"
					>
						Top
					</div>
					<div class="flex flex-row gap-4">
						<div
							on:click={clickLeft}
							class="w-20 h-10 flex items-start justify-center p-1 bg-gray-400/90 shadow hover:shadow-lg cursor-pointer text-white text-shadow rounded hover:bg-gray-400"
						>
							Left
						</div>
						<div
							on:click={clickRight}
							class="w-20 h-10 flex items-start justify-center p-1 bg-gray-400/90 shadow hover:shadow-lg cursor-pointer text-white text-shadow rounded hover:bg-gray-400"
						>
							Right
						</div>
					</div>

					<div
						on:click={clickBottom}
						class="w-20 h-10 flex items-start justify-center p-1 bg-gray-400/90 shadow hover:shadow-lg cursor-pointer text-white text-shadow rounded hover:bg-gray-400"
					>
						Bottom
					</div>
				</div>
			{:else if showShowButton}
				<button
					on:click={() => (showButtons = true)}
					class="sm:hidden p-2 bg-gray-500/20 border border-gray-500/30  hover:bg-gray-500/30 text-black rounded mt-2"
					>Show Buttons</button
				>
			{/if}
		</div>
	</div>
</div>
