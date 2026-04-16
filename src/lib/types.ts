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
}

export interface TipResponse {
	success: boolean;
}

export interface SpudMatchRequest {
	weights: Record<string, number>;
}

export interface SpudMatchResponse {
	match: {
		dishId: string;
		name: string;
		description: string | null;
		imagePath: string | null;
		imageAttribution: string | null;
		score: number;
	};
}

export interface CriteriaVoteRequest {
	dishId: string;
	votes: Record<string, number>;
}

export interface CriteriaVoteResponse {
	success: boolean;
}

export interface DishCriteriaAverage {
	dishId: string;
	criterionId: string;
	avgScore: number;
	voteCount: number;
}
