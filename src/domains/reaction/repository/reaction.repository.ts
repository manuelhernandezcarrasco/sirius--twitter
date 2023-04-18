import { ReactionDTO, Reactions } from "../dto";

export interface ReactionRepository {
    create(userId: string, postId: string, type: Reactions): Promise<ReactionDTO>;
    delete(userId: string, postId: string, type: Reactions): Promise<ReactionDTO>;
}