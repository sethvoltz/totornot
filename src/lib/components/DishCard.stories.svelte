<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect, within } from 'storybook/test';
	import type { ComponentProps } from 'svelte';
	import DishCard from './DishCard.svelte';

	type DishCardProps = ComponentProps<typeof DishCard>;

	const { Story } = defineMeta({
		title: 'Components/DishCard',
		component: DishCard,
		parameters: { layout: 'centered' },
		args: {
			image: '/images/dishes/poutine.jpg',
			name: 'Poutine',
			description: 'French fries topped with cheese curds and brown gravy.',
			imageAttribution: null,
			disabled: false,
			loading: false,
			selected: false,
			isWinner: false
		}
	});
</script>

<Story
	name="Default"
	play={async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvas.getByRole('button')).toBeInTheDocument();
		await expect(canvas.getByText('Poutine')).toBeInTheDocument();
	}}
>
	{#snippet children(args: DishCardProps)}
		<div style="max-width: 380px; width: 100%;">
			<DishCard {...args} />
		</div>
	{/snippet}
</Story>

<Story
	name="Loading"
	args={{ loading: true }}
	play={async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvas.getByRole('button')).toBeDisabled();
		await expect(canvas.queryByAltText('Poutine')).not.toBeInTheDocument();
	}}
>
	{#snippet children(args: DishCardProps)}
		<div style="max-width: 380px; width: 100%;">
			<DishCard {...args} />
		</div>
	{/snippet}
</Story>

<Story
	name="Disabled"
	args={{ disabled: true }}
	play={async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvas.getByRole('button')).toBeDisabled();
	}}
>
	{#snippet children(args: DishCardProps)}
		<div style="max-width: 380px; width: 100%;">
			<DishCard {...args} />
		</div>
	{/snippet}
</Story>
