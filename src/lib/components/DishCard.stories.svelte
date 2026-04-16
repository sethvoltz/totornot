<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect, within } from 'storybook/test';
	import DishCard from './DishCard.svelte';

	const { Story } = defineMeta({
		title: 'Components/DishCard',
		component: DishCard,
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
/>

<Story
	name="Loading"
	args={{ loading: true }}
	play={async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvas.getByRole('button')).toBeDisabled();
		await expect(canvas.queryByAltText('Poutine')).not.toBeInTheDocument();
	}}
/>

<Story
	name="Disabled"
	args={{ disabled: true }}
	play={async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvas.getByRole('button')).toBeDisabled();
	}}
/>
