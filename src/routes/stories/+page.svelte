<script lang="ts">
	import type { PageData } from './$types'

	export let data: PageData

	const { stories } = data
</script>

<p class="balance-text">
	Explore stories, uniquely tailored for you, with endless possiblities, narrated by artificial
	intelligence.
</p>

<section>
	{#each stories as story}
		<a href="/stories/{story.id}">
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
