export interface TopsisInput {
	matrix: Map<string, Map<string, number>>;
	weights: Record<string, number>;
	topN: number;
}

export interface TopsisResult {
	dishId: string;
	score: number;
}

const TOLERANCE = 1e-9;

export class TopsisError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'TopsisError';
	}
}

export function topsis(input: TopsisInput): TopsisResult[] {
	const { matrix, weights, topN } = input;

	const activeCriteria = Object.entries(weights).filter(
		([, weight]) => Math.abs(weight) > TOLERANCE
	);

	if (activeCriteria.length === 0) {
		throw new TopsisError(
			'All weights are zero — at least one criterion must have a non-zero weight'
		);
	}

	const activeCriterionIds = activeCriteria.map(([id]) => id);

	const eligibleDishes: string[] = [];
	for (const [dishId, criteriaScores] of matrix) {
		const hasAllCriteria = activeCriterionIds.every((criterionId) =>
			criteriaScores.has(criterionId)
		);
		if (hasAllCriteria) {
			eligibleDishes.push(dishId);
		}
	}

	if (eligibleDishes.length === 0) {
		throw new TopsisError('No dishes have ratings for all active criteria');
	}

	if (eligibleDishes.length === 1) {
		return [{ dishId: eligibleDishes[0], score: 1.0 }];
	}

	const numericMatrix: number[][] = [];
	for (const dishId of eligibleDishes) {
		const row: number[] = [];
		const criteriaScores = matrix.get(dishId)!;
		for (const criterionId of activeCriterionIds) {
			row.push(criteriaScores.get(criterionId)!);
		}
		numericMatrix.push(row);
	}

	const numCriteria = activeCriterionIds.length;
	const norms: number[] = [];
	for (let j = 0; j < numCriteria; j++) {
		let sumSquares = 0;
		for (let i = 0; i < numericMatrix.length; i++) {
			sumSquares += numericMatrix[i][j] ** 2;
		}
		norms.push(Math.sqrt(sumSquares));
	}

	const validCriteriaIndices: number[] = [];
	for (let j = 0; j < numCriteria; j++) {
		if (norms[j] > TOLERANCE) {
			validCriteriaIndices.push(j);
		}
	}

	if (validCriteriaIndices.length === 0) {
		throw new TopsisError('All criteria columns have zero norm');
	}

	const weightedNormalized: number[][] = [];
	for (let i = 0; i < numericMatrix.length; i++) {
		const row: number[] = [];
		for (let j = 0; j < numCriteria; j++) {
			const norm = norms[j];
			const normalized = norm > TOLERANCE ? numericMatrix[i][j] / norm : 0;
			const weight = Math.abs(weights[activeCriterionIds[j]]);
			row.push(normalized * weight);
		}
		weightedNormalized.push(row);
	}

	const ideal: number[] = [];
	const antiIdeal: number[] = [];

	for (let j = 0; j < numCriteria; j++) {
		const column = weightedNormalized.map((row) => row[j]);
		const maxVal = Math.max(...column);
		const minVal = Math.min(...column);

		const weight = weights[activeCriterionIds[j]];

		if (weight > 0) {
			ideal.push(maxVal);
			antiIdeal.push(minVal);
		} else {
			ideal.push(minVal);
			antiIdeal.push(maxVal);
		}
	}

	const scores: { dishId: string; score: number }[] = [];

	for (let i = 0; i < weightedNormalized.length; i++) {
		const row = weightedNormalized[i];

		let distIdeal = 0;
		let distAntiIdeal = 0;

		for (let j = 0; j < numCriteria; j++) {
			distIdeal += (row[j] - ideal[j]) ** 2;
			distAntiIdeal += (row[j] - antiIdeal[j]) ** 2;
		}

		distIdeal = Math.sqrt(distIdeal);
		distAntiIdeal = Math.sqrt(distAntiIdeal);

		let score: number;
		if (distIdeal + distAntiIdeal < TOLERANCE) {
			score = 0.5;
		} else {
			score = distAntiIdeal / (distIdeal + distAntiIdeal);
		}

		scores.push({ dishId: eligibleDishes[i], score });
	}

	scores.sort((a, b) => {
		if (Math.abs(a.score - b.score) < TOLERANCE) {
			return a.dishId.localeCompare(b.dishId);
		}
		return b.score - a.score;
	});

	return scores.slice(0, topN);
}
