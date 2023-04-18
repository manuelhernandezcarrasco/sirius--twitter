import { ReactionDTO, Reactions } from "../dto";

export interface ReactionService {
    createReaction(userId: string, postId: string, type: Reactions): Promise<ReactionDTO>;
    deleteReaction(userId: string, postId: string, type: Reactions): Promise<ReactionDTO>;
}