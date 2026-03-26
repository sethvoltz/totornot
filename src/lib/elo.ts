const K = 32;

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
 */
export function updateElo(rating: number, expected: number, score: number): number {
	return Math.round(rating + K * (score - expected));
}

/**
 * Process a single vote. Returns new ratings for winner and loser.
 */
export function processVote(
	winnerRating: number,
	loserRating: number
): { newWinnerRating: number; newLoserRating: number } {
	const expectedWinner = calculateExpected(winnerRating, loserRating);
	const expectedLoser = calculateExpected(loserRating, winnerRating);
	return {
		newWinnerRating: updateElo(winnerRating, expectedWinner, 1),
		newLoserRating: updateElo(loserRating, expectedLoser, 0)
	};
}
