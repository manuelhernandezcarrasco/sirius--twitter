import { ReactionDTO, Reactions } from "../dto";

export interface ReactionRepository {
    userReactions(userId: string, reactorId: string, type: Reactions): Promise<any>;
    create(userId: string, postId: string, type: Reactions): Promise<ReactionDTO>;
    delete(userId: string, postId: string, type: Reactions): Promise<ReactionDTO>;
}