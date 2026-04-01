export interface Dish {
	id: string;
	name: string;
	description: string | null;
	imagePath: string | null;
	imageAttribution: string | null;
	elo: number;
	createdAt: Date;
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
