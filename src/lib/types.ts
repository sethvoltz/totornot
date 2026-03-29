export interface Dish {
	id: string;
	name: string;
	description: string;
	imagePath: string;
	eloScore: number;
	voteCount: number;
}

export interface MatchupResponse {
	dishes: [Dish, Dish];
}

export interface VoteRequest {
	winnerId: string;
	loserId: string;
	turnstileToken: string;
}

export interface VoteResponse {
	success: boolean;
	newWinnerElo: number;
	newLoserElo: number;
}
