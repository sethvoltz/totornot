const DEFAULT_K_FACTOR = 32;

/**
 * Expected score for player A against player B.
 * Returns a value between 0 and 1.
 */
export function calculateExpected(ratingA: number, ratingB: number): number {
	return 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400));
}

/**
 * New Elo rating after a result.
 * @param rating  Current rating
 * @param expected  Expected score (0–1) from calculateExpected
 * @param score  Actual score: 1 for win, 0 for loss, 0.5 for draw
 * @param kFactor  Optional K factor (default: 32)
 */
export function updateElo(
	rating: number,
	expected: number,
	score: number,
	kFactor: number = DEFAULT_K_FACTOR
): number {
	return Math.round(rating + kFactor * (score - expected));
}

/**
 * Process a single vote. Returns new ratings for winner and loser.
 * @param kFactor  Optional K factor (default: 32)
 */
export function processVote(
	winnerRating: number,
	loserRating: number,
	kFactor: number = DEFAULT_K_FACTOR
): { winner: number; loser: number } {
	const expectedWinner = calculateExpected(winnerRating, loserRating);
	const expectedLoser = calculateExpected(loserRating, winnerRating);
	return {
		winner: updateElo(winnerRating, expectedWinner, 1, kFactor),
		loser: updateElo(loserRating, expectedLoser, 0, kFactor)
	};
}
