<script lang="ts">
	import { Rive } from '@rive-app/canvas'
	import { onMount } from 'svelte'

	export let title = 'Data2.ai'

	let canvas: HTMLCanvasElement
	let rive: Rive

	onMount(async () => {
		rive = new Rive({
			src: '/bubble.riv',
			canvas: canvas,
			onLoad: () => canvas.classList.add('loaded')
		})
	})
</script>

<a id="logo" href="/" on:mouseenter={rive.play()} on:mouseleave={rive.pause()}>
	<canvas bind:this={canvas} width="128" height="128" />
	{title}
</a>

<style>
	a {
		display: flex;
		align-items: center;
		font-size: var(--font-size-large);
		font-weight: bolder;
	}

	canvas {
		width: 3rem !important;
		aspect-ratio: 1;
		margin-block: -1em;
		margin-inline-start: -0.5em;
		background-size: cover;
	}

	canvas:not(.loaded) {
		background-image: url('/bubble.png');
	}
</style>
