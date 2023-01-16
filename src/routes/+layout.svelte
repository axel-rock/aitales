<script lang="ts">
	import '../css/app.css'
	import { Rive } from '@rive-app/canvas'
	import { onMount, beforeUpdate, afterUpdate } from 'svelte'
	import textBalancer from 'text-balancer'
	import { currentUser, signInWithGoogle, signOut } from '$lib/auth'

	const title = 'Ai Tales'

	let canvas: HTMLCanvasElement
	let rive: Rive

	onMount(async () => {
		rive = new Rive({
			src: '/bubble.riv',
			canvas: canvas
		})
	})

	beforeUpdate(async () => {
		textBalancer.balanceText()
	})

	afterUpdate(async () => {
		textBalancer.balanceText()
	})
</script>

<header>
	<a href="/stories" on:mouseenter={rive.play()} on:mouseleave={rive.pause()}>
		<canvas bind:this={canvas} width="128" height="128" />
		{title}
	</a>
	<nav>
		{#if $currentUser?.access.admin}
			<a href="/admin">Admin</a>
		{/if}
		<a href="/lores">Lores</a>
		<!-- {#if $currentUser?.access.pro}
			<a href="/pro">Pro</a>
		{/if} -->
		<a href="/pricing">Pricing</a>

		{#if $currentUser}
			<button on:click={signOut}>{$currentUser?.displayName}</button>
		{:else}
			<button on:click={signInWithGoogle} class="contrast">Login with Google</button>
		{/if}
		<!-- {#if $user === undefined}
			<span>Waiting</span>
		{:else if $user}
			<span>{$user.uid}</span>
		{:else}
			<span>Not signed in</span>
		{/if} -->
	</nav>
</header>

<main>
	<slot />
</main>

<footer>
	<span>
		© 2023 Ai Tales —
		<a href="https://twitter.com/nineties_panda" target="_blank" rel="noopener noreferrer"
			>@nineties_panda</a
		>
	</span>
	<nav>
		<a href="/credits">Credits</a>
		<a href="https://twitter.com/nineties_panda">
			<svg
				fill="currentColor"
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				viewBox="0 0 24 24"
			>
				<path
					d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"
				/>
			</svg>
		</a>
		<a href="https://fr.linkedin.com/in/axelrock">
			<svg
				fill="none"
				stroke="currentColor"
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				viewBox="0 0 24 24"
			>
				<rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
				<path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01" />
			</svg>
		</a>
		<a href="https://www.instagram.com/axel.rock/">
			<svg
				fill="currentColor"
				stroke="currentColor"
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="0"
				viewBox="0 0 24 24"
			>
				<path
					stroke="none"
					d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"
				/>
				<circle cx="4" cy="4" r="2" stroke="none" />
			</svg>
		</a>
	</nav>
</footer>

<style>
	:root {
		/* font-size: 1.2em !important; */
	}

	header canvas {
		width: 3rem;
		aspect-ratio: 1;
	}
</style>
