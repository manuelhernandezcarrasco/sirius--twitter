import { PostDTO } from "@domains/post/dto";
import { PrismaClient } from "@prisma/client";
import { ReactionDTO, Reactions } from "../dto";
import { ReactionRepository } from "./reaction.repository";

export class ReactionRepositoryImpl implements ReactionRepository {
    constructor(private readonly db: PrismaClient) {}

    async userReactions(userId: string, reactorId: string, type: Reactions): Promise<PostDTO[]> {
        const reactions = await this.db.reaction.findMany({
            where: {
                reactorId: reactorId,
                type: type,
            },
            select: {
                post: {
                    select: {
                        id: true,
                        authorId: true,
                        content: true,
                        images: true,
                        createdAt: true,
                        author: {
                            select: {
                                private: true,
                                followers: {
                                    where: {
                                        followerId: userId,
                                    },
                                    select: {
                                        id: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
        const  posts: PostDTO[] = [];
        reactions.map(reaction => {
            if (!reaction.post.author.private || reaction.post.authorId === userId || reaction.post.author.followers) {
                posts.push(new PostDTO(reaction.post));
            }
        });
        return posts;
    }

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