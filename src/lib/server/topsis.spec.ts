import { describe, expect, it } from 'vitest';
import { topsis, TopsisError } from './topsis';

function buildMatrix(
	data: Record<string, Record<string, number>>
): Map<string, Map<string, number>> {
	const matrix = new Map<string, Map<string, number>>();
	for (const [dishId, criteria] of Object.entries(data)) {
		const criteriaMap = new Map<string, number>();
		for (const [criterionId, score] of Object.entries(criteria)) {
			criteriaMap.set(criterionId, score);
		}
		matrix.set(dishId, criteriaMap);
	}
	return matrix;
}

describe('TOPSIS Algorithm', () => {
	describe('Test Case 1: Simple 3x2, one benefit + one cost', () => {
		it('should rank A1 > A3 > A2 correctly', () => {
			const matrix = buildMatrix({
				A1: { C1: 4.0, C2: 1.0 },
				A2: { C1: 2.0, C2: 3.0 },
				A3: { C1: 3.0, C2: 2.0 }
			});

			const result = topsis({
				matrix,
				weights: { C1: 3.0, C2: -2.0 },
				topN: 3
			});

			expect(result).toHaveLength(3);
			expect(result[0].dishId).toBe('A1');
			expect(result[1].dishId).toBe('A3');
			expect(result[2].dishId).toBe('A2');

			expect(result[0].score).toBeCloseTo(1.0, 6);
			expect(result[1].score).toBeCloseTo(0.5, 6);
			expect(result[2].score).toBeCloseTo(0.0, 6);
		});
	});

	describe('Test Case 2: Bipolar 4x3, negative values in matrix', () => {
		it('should rank A1 > A4 > A2 > A3 correctly', () => {
			const matrix = buildMatrix({
				A1: { C1: -2.0, C2: 3.0, C3: 5.0 },
				A2: { C1: 1.0, C2: -1.0, C3: 0.0 },
				A3: { C1: 4.0, C2: 2.0, C3: -3.0 },
				A4: { C1: 0.0, C2: -5.0, C3: 1.0 }
			});

			const result = topsis({
				matrix,
				weights: { C1: 2.0, C2: -1.0, C3: 4.0 },
				topN: 4
			});

			expect(result).toHaveLength(4);
			expect(result[0].dishId).toBe('A1');
			expect(result[1].dishId).toBe('A4');
			expect(result[2].dishId).toBe('A2');
			expect(result[3].dishId).toBe('A3');

			expect(result[0].score).toBeCloseTo(0.65, 2);
			expect(result[1].score).toBeCloseTo(0.49, 2);
			expect(result[2].score).toBeCloseTo(0.4, 2);
			expect(result[3].score).toBeCloseTo(0.32, 2);
		});
	});

	describe('Test Case 3: All-negative matrix, equal weights', () => {
		it('should identify A2 as the best compromise', () => {
			const matrix = buildMatrix({
				A1: { C1: -1.0, C2: -4.0 },
				A2: { C1: -3.0, C2: -2.0 },
				A3: { C1: -5.0, C2: -1.0 }
			});

			const result = topsis({
				matrix,
				weights: { C1: 1.0, C2: 1.0 },
				topN: 3
			});

			expect(result).toHaveLength(3);
			expect(result[0].dishId).toBe('A2');
			expect(result[0].score).toBeCloseTo(0.5784, 4);
			expect(result[1].dishId).toBe('A1');
			expect(result[1].score).toBeCloseTo(0.5081, 4);
			expect(result[2].dishId).toBe('A3');
			expect(result[2].score).toBeCloseTo(0.4919, 4);
		});
	});

	describe('Edge Cases', () => {
		it('should exclude criteria with zero weight', () => {
			const matrix = buildMatrix({
				A1: { C1: 4.0, C2: 1.0 },
				A2: { C1: 2.0, C2: 3.0 },
				A3: { C1: 3.0, C2: 2.0 }
			});

			const result = topsis({
				matrix,
				weights: { C1: 3.0, C2: 0.0 },
				topN: 3
			});

			expect(result).toHaveLength(3);
			expect(result[0].dishId).toBe('A1');
			expect(result[1].dishId).toBe('A3');
			expect(result[2].dishId).toBe('A2');
		});

		it('should reverse ranking when weight sign flips', () => {
			const matrix = buildMatrix({
				A1: { C1: 4.0 },
				A2: { C1: 2.0 },
				A3: { C1: 3.0 }
			});

			const result = topsis({
				matrix,
				weights: { C1: -3.0 },
				topN: 3
			});

			expect(result[0].dishId).toBe('A2');
			expect(result[1].dishId).toBe('A3');
			expect(result[2].dishId).toBe('A1');
		});

		it('should throw error when all weights are zero', () => {
			const matrix = buildMatrix({
				A1: { C1: 4.0 },
				A2: { C1: 2.0 }
			});

			expect(() =>
				topsis({
					matrix,
					weights: { C1: 0.0 },
					topN: 2
				})
			).toThrow(TopsisError);
		});

		it('should return single dish with score 1.0', () => {
			const matrix = buildMatrix({
				A1: { C1: 4.0, C2: 1.0 }
			});

			const result = topsis({
				matrix,
				weights: { C1: 3.0, C2: 2.0 },
				topN: 1
			});

			expect(result).toHaveLength(1);
			expect(result[0].dishId).toBe('A1');
			expect(result[0].score).toBe(1.0);
		});

		it('should exclude dishes missing ratings for active criteria', () => {
			const matrix = buildMatrix({
				A1: { C1: 4.0, C2: 1.0 },
				A2: { C1: 2.0 }
			});

			const result = topsis({
				matrix,
				weights: { C1: 3.0, C2: 2.0 },
				topN: 2
			});

			expect(result).toHaveLength(1);
			expect(result[0].dishId).toBe('A1');
		});

		it('should handle all-zero column by dropping it', () => {
			const matrix = buildMatrix({
				A1: { C1: 4.0, C2: 0.0 },
				A2: { C1: 2.0, C2: 0.0 }
			});

			const result = topsis({
				matrix,
				weights: { C1: 3.0, C2: 2.0 },
				topN: 2
			});

			expect(result).toHaveLength(2);
			expect(result[0].dishId).toBe('A1');
			expect(result[1].dishId).toBe('A2');
		});

		it('should break ties alphabetically', () => {
			const matrix = buildMatrix({
				Zebra: { C1: 5.0 },
				Apple: { C1: 5.0 },
				Mango: { C1: 5.0 }
			});

			const result = topsis({
				matrix,
				weights: { C1: 1.0 },
				topN: 3
			});

			expect(result).toHaveLength(3);
			expect(result[0].dishId).toBe('Apple');
			expect(result[1].dishId).toBe('Mango');
			expect(result[2].dishId).toBe('Zebra');
		});

		it('should return topN results correctly', () => {
			const matrix = buildMatrix({
				A1: { C1: 5.0 },
				A2: { C1: 4.0 },
				A3: { C1: 3.0 },
				A4: { C1: 2.0 },
				A5: { C1: 1.0 }
			});

			const result = topsis({
				matrix,
				weights: { C1: 1.0 },
				topN: 3
			});

			expect(result).toHaveLength(3);
			expect(result[0].dishId).toBe('A1');
			expect(result[1].dishId).toBe('A2');
			expect(result[2].dishId).toBe('A3');
		});
	});
});
