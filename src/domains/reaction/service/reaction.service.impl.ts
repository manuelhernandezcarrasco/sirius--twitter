import { BadRequestException, NotFoundException } from "@utils";
import { ReactionDTO, Reactions } from "../dto";
import { ReactionRepository } from "../repository";
import { ReactionService } from "./reaction.service";

export class ReactionServiceImpl implements ReactionService {
    constructor(private readonly repository: ReactionRepository) {}

    async createReaction(userId: string, postId: string, type: Reactions): Promise<ReactionDTO> {
        const reaction = await this.repository.create(userId, postId, type);
        if (reaction.createdAt.getDate() != new Date().getDate()) throw new BadRequestException("Already reacted to post");
        return reaction;
    }

    async deleteReaction(userId: string, postId: string, type: Reactions): Promise<ReactionDTO> {
        const reaction = await this.repository.delete(userId, postId, type);
        if (!reaction.id) throw new NotFoundException("Reaction"); 
        return reaction;
    }
    
}