<script lang="ts">
	// import { Rive } from '@rive-app/canvas'
	import { onMount } from 'svelte'

	// const brand = 'Rock'
	export let brand = 'Rock'
	export let title = ''
	const width = 21
	const spacing = 40

	// let canvas: HTMLCanvasElement
	// let rive: Rive

	// onMount(async () => {
	// 	rive = new Rive({
	// 		src: '/bubble.riv',
	// 		canvas: canvas,
	// 		onLoad: () => canvas.classList.add('loaded')
	// 	})
	// })
</script>

<!-- <a id="logo" href="/" on:mouseenter={rive.play()} on:mouseleave={rive.pause()}> -->
<a id="logo" href="/">
	<svg
		width={spacing * 3 + width}
		height="106"
		viewBox="0 0 {spacing * 3 + width} 106"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		preserveAspectRatio="xMidYMid meet"
	>
		<rect {width} height="100" fill="currentColor" />
		<rect x={spacing * 1} y="25" {width} height="75" fill="currentColor" />
		<rect x={spacing * 2} y="25" {width} height="75" fill="currentColor" />
		<rect x={spacing * 3} {width} height="100" fill="currentColor" />
	</svg>

	<!-- <canvas bind:this={canvas} width="128" height="128" /> -->
	<span>{brand} <span class="title">| {title}</span></span>
</a>

<style>
	a {
		display: flex;
		align-items: center;
		font-size: var(--font-size-large);
		font-weight: bolder;
		white-space: nowrap;
		gap: 0.5em;
	}

	svg {
		height: 0.75em;
		width: fit-content;
		/* width: 2em; */
	}

	.title {
		font-weight: normal;
	}

	canvas {
		display: none;
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
