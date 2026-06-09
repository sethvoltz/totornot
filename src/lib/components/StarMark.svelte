<script lang="ts">
	interface Props {
		class?: string;
	}

	const { class: className = '' }: Props = $props();
</script>

<svg
	class={className}
	viewBox="0 0 24 24"
	fill="currentColor"
	aria-hidden="true"
	xmlns="http://www.w3.org/2000/svg"
>
	<path d="M12 1.8l2.9 6.2 6.8.8-5 4.7 1.3 6.7L12 16.9l-6 3.3 1.3-6.7-5-4.7 6.8-.8L12 1.8z" />
</svg>
