const DEFAULT_K_FACTOR = 32;

/**
 * Calculate the expected score for player A against player B.
 * Returns a probability between 0 and 1.
 */
export function calculateExpected(ratingA: number, ratingB: number): number {
	return 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400));
}

/**
 * Calculate the updated Elo rating given expected and actual scores.
 */
export function updateElo(
	rating: number,
	expected: number,
	actual: number,
	kFactor: number = DEFAULT_K_FACTOR
): number {
	return rating + kFactor * (actual - expected);
}

/**
 * Process a vote between two dishes and return their updated Elo ratings.
 * The winner gets actual=1, the loser gets actual=0.
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
