import { PrismaClient } from "@prisma/client";
import { ReactionDTO, Reactions } from "../dto";
import { ReactionRepository } from "./reaction.repository";

export class ReactionRepositoryImpl implements ReactionRepository {
    constructor(private readonly db: PrismaClient) {}

    async create(userId: string, postId: string, type: Reactions): Promise<ReactionDTO> {
        const reaction = await this.db.reaction.upsert({
            where: {
                postId_reactorId_type: {
                    postId: postId,
                    reactorId: userId,
                    type: type,
                },
            },
            create: {
                reactor: {
                    connect: {
                        id: userId,
                    },
                },
                post: {
                    connect: {
                        id: postId,
                    },
                },
                type: type,
            },
            update: {}
        });
        return new ReactionDTO(reaction as ReactionDTO);
    }

    async delete(userId: string, postId: string, type: Reactions): Promise<ReactionDTO> {
        const reaction = await this.db.reaction.delete({
            where: {
                postId_reactorId_type: {
                    postId: postId,
                    reactorId: userId,
                    type: type,
                },
            },
        });
        return new ReactionDTO(reaction as ReactionDTO);
    }

}