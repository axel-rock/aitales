<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import Story from './stories/Story.svelte';

	export let data: PageData;
</script>

<header class="text-center mb-10">
	<h1>Stories</h1>
	<p class="balance-text">
		Explore stories, uniquely tailored for you, with endless possiblities, narrated by artificial
		intelligence.
	</p>
</header>

<section class="grid sm:grid-cols-1 md:grid-cols-2 gap-4 ">
	{#each data.stories as story}
		<div class="h-full surface space-y-8 text-center">
			<h2 class=" text-gray-400">
				{story.category}
			</h2>
			<h1>
				{story.title}
			</h1>
			<p>
				Photo booth fam kinfolk cold-pressed sriracha leggings jianbing microdosing tousled
				waistcoat.
			</p>
			<a
				href="/stories/{story.id}"
				class="text-brand-600 dark:text-brand-400 hover:text-brand-500 inline-flex items-center mb-8"
				>Learn More
				<svg
					class="w-4 h-4 ml-2"
					viewBox="0 0 24 24"
					stroke="currentColor"
					stroke-width="2"
					fill="none"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path d="M5 12h14" />
					<path d="M12 5l7 7-7 7" />
				</svg>
			</a>

			<div class="text-gray-400 dark:text-gray-600 space-x-4 text-sm">
				<span class="inline-flex items-center pr-4 border-r-2 border-gray-400 dark:border-gray-600">
					<svg
						class="w-4 h-4 mr-1"
						stroke="currentColor"
						stroke-width="2"
						fill="none"
						stroke-linecap="round"
						stroke-linejoin="round"
						viewBox="0 0 24 24"
					>
						<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
						<circle cx="12" cy="12" r="3" />
					</svg>1.2K
				</span>

				<span class="inline-flex items-center">
					<svg
						class="w-4 h-4 mr-1"
						stroke="currentColor"
						stroke-width="2"
						fill="none"
						stroke-linecap="round"
						stroke-linejoin="round"
						viewBox="0 0 24 24"
					>
						<path
							d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"
						/>
					</svg>6
				</span>
			</div>
		</div>
	{/each}
</section>
