import { describe, it, expect } from 'vitest';
import { calculateExpected, updateElo, processVote } from './elo';

describe('calculateExpected', () => {
	it('returns 0.5 when ratings are equal', () => {
		expect(calculateExpected(1000, 1000)).toBe(0.5);
	});

	it('returns > 0.5 when player A has a higher rating', () => {
		expect(calculateExpected(1200, 1000)).toBeGreaterThan(0.5);
	});

	it('returns < 0.5 when player A has a lower rating', () => {
		expect(calculateExpected(1000, 1200)).toBeLessThan(0.5);
	});

	it('returns approximately 0.76 for a 200-point advantage', () => {
		expect(calculateExpected(1200, 1000)).toBeCloseTo(0.7597, 4);
	});

	it('expected scores for A vs B sum to 1', () => {
		const eA = calculateExpected(1200, 1000);
		const eB = calculateExpected(1000, 1200);
		expect(eA + eB).toBeCloseTo(1, 10);
	});
});

describe('updateElo', () => {
	it('increases rating when actual > expected', () => {
		const result = updateElo(1000, 0.5, 1);
		expect(result).toBeGreaterThan(1000);
	});

	it('decreases rating when actual < expected', () => {
		const result = updateElo(1000, 0.5, 0);
		expect(result).toBeLessThan(1000);
	});

	it('does not change rating when actual equals expected', () => {
		const result = updateElo(1000, 0.5, 0.5);
		expect(result).toBe(1000);
	});

	it('uses default K factor of 32', () => {
		expect(updateElo(1000, 0.5, 1)).toBeCloseTo(1016, 0);
	});

	it('respects custom K factor', () => {
		expect(updateElo(1000, 0.5, 1, 16)).toBeCloseTo(1008, 0);
	});
});

describe('processVote', () => {
	it('increases winner rating and decreases loser rating', () => {
		const { winner, loser } = processVote(1000, 1000);
		expect(winner).toBeGreaterThan(1000);
		expect(loser).toBeLessThan(1000);
	});

	it('total rating is conserved (zero-sum)', () => {
		const initial = 1200 + 1000;
		const { winner, loser } = processVote(1200, 1000);
		expect(winner + loser).toBeCloseTo(initial, 10);
	});

	it('underdog gains more than favorite when underdog wins', () => {
		const { winner: underdogWins } = processVote(1000, 1200);
		const { winner: favoriteWins } = processVote(1200, 1000);
		const underdogGain = underdogWins - 1000;
		const favoriteGain = favoriteWins - 1200;
		expect(underdogGain).toBeGreaterThan(favoriteGain);
	});

	it('respects custom K factor', () => {
		const k16 = processVote(1000, 1000, 16);
		const k32 = processVote(1000, 1000, 32);
		expect(k16.winner - 1000).toBeCloseTo((k32.winner - 1000) / 2, 5);
	});
});
