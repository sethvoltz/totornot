<script lang="ts">
	import StarMark from './StarMark.svelte';

	interface Props {
		class?: string;
	}

	const { class: className = '' }: Props = $props();
</script>

<div class="star-divider {className}" aria-hidden="true">
	<StarMark />
	<StarMark />
	<StarMark />
</div>
