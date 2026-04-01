export interface Dish {
	id: string;
	name: string;
	description: string | null;
	imagePath: string | null;
	imageAttribution: string | null;
	elo: number;
	submittedBy: string | null;
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

export interface TipRequest {
	dishName: string;
	description: string;
	submitterName?: string;
	turnstileToken: string;
}

export interface TipResponse {
	success: boolean;
}
