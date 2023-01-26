<script lang="ts">
	import type { PageData } from './$types'

	export let data: PageData

	let { stories, playthroughs } = data

	function getPlaythrough(story) {
		const playthrough = playthroughs.find((playthrough) => playthrough.storyId === story.id)
		return playthrough ? '/' + playthrough.id : ''
	}
</script>

<p class="balance-text">
	Explore stories, uniquely tailored for you, with endless possiblities, narrated by artificial
	intelligence.
</p>

<section>
	{#each stories as story}
		<a href="/stories/{story.id}{getPlaythrough(story)}">
			<article>
				<h1>{story.title}</h1>
				<p>
					Photo booth fam kinfolk cold-pressed sriracha leggings jianbing microdosing tousled
					waistcoat.
				</p>
			</article>
		</a>
	{/each}
</section>
