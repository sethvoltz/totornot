<script lang="ts">
	import type { Criterion } from '$lib/criteria';

	interface Props {
		criterion: Criterion;
		value: number;
	}

	let { criterion, value = $bindable() }: Props = $props();

	function formatScore(v: number): string {
		if (Math.abs(v) < 0.05) return '0.0';
		const sign = v > 0 ? '+' : '';
		return `${sign}${v.toFixed(1)}`;
	}
</script>

<div class="course-card p-4">
	<div class="mb-2 flex items-center justify-between">
		<div class="flex items-center gap-2">
			<span class="font-medium" style="color: var(--ink);">
				{criterion.name}
			</span>
			<div class="tooltip-container relative">
				<span
					class="flex h-5 w-5 cursor-pointer items-center justify-center rounded-full opacity-70 hover:opacity-100"
					style="background-color: var(--surface-sunken); color: var(--ink-muted);"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-3 w-3"
						viewBox="0 0 20 20"
						fill="currentColor"
					>
						<path
							fill-rule="evenodd"
							d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
							clip-rule="evenodd"
						/>
					</svg>
				</span>
				<div
					class="tooltip absolute bottom-full left-0 mb-2 w-64 px-3 py-2 text-xs"
					style="background-color: var(--surface); color: var(--ink); border: 1px solid var(--rule-strong); border-radius: 2px; box-shadow: var(--shadow-card);"
				>
					<p>{criterion.description}</p>
					<p class="mt-2" style="color: var(--ink-muted);">
						<strong>Low:</strong>
						{criterion.examplesLow.join(', ')}
					</p>
					<p style="color: var(--ink-muted);">
						<strong>High:</strong>
						{criterion.examplesHigh.join(', ')}
					</p>
				</div>
			</div>
		</div>
		<span class="text-sm tabular-nums" style="color: var(--ink-muted);">
			{formatScore(value)}
		</span>
	</div>
	<div class="slider-container relative flex h-6 items-center">
		<div class="slider-track"></div>
		<div class="slider-center-pip"></div>
		<input
			type="range"
			min="-5"
			max="5"
			step="0.1"
			bind:value
			aria-label={criterion.name}
			class="slider relative z-10 w-full"
		/>
	</div>
	<div class="mt-1 flex justify-between text-xs" style="color: var(--ink-secondary);">
		<span>{criterion.scaleLow}</span>
		<span>{criterion.scaleHigh}</span>
	</div>
</div>

<style>
	.slider {
		-webkit-appearance: none;
		appearance: none;
		height: 8px;
		border-radius: 4px;
		background: transparent;
		cursor: pointer;
	}

	.slider::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 24px;
		height: 24px;
		border-radius: 50%;
		background: var(--brand);
		border: 2px solid var(--surface);
		cursor: pointer;
		box-shadow: 0 1px 6px oklch(0% 0 0 / 30%);
		transition: transform 0.1s var(--ease-out-quart);
		position: relative;
		z-index: 20;
	}

	.slider::-webkit-slider-thumb:hover {
		transform: scale(1.1);
	}

	.slider::-moz-range-thumb {
		width: 24px;
		height: 24px;
		border-radius: 50%;
		background: var(--brand);
		cursor: pointer;
		border: 2px solid var(--surface);
		box-shadow: 0 1px 6px oklch(0% 0 0 / 30%);
		position: relative;
		z-index: 20;
	}

	.slider-container {
		position: relative;
		display: flex;
		align-items: center;
		height: 24px;
	}

	.slider-track {
		position: absolute;
		left: 0;
		right: 0;
		top: 50%;
		transform: translateY(-50%);
		height: 6px;
		border-radius: 3px;
		background: var(--surface-sunken);
		border: 1px solid var(--rule);
	}

	.slider-center-pip {
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: var(--ink-muted);
		pointer-events: none;
		opacity: 0.5;
		z-index: 5;
	}

	.tooltip-container .tooltip {
		visibility: hidden;
		opacity: 0;
		transition:
			opacity 0.2s,
			visibility 0.2s;
		z-index: var(--z-tooltip);
	}

	.tooltip-container:hover .tooltip,
	.tooltip-container:focus-within .tooltip {
		visibility: visible;
		opacity: 1;
	}
</style>
