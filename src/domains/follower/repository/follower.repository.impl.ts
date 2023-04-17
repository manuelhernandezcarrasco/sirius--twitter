import { PrismaClient } from "@prisma/client";
import { FollowDTO } from "../dto";
import { FollowerRepository } from "./follower.repository";

export class FollowerRepositoryImpl implements FollowerRepository {
    constructor(private readonly db: PrismaClient) {}

    async create(followerId: string, followedId: string): Promise<FollowDTO> {
        const follow = await this.db.follow.upsert({
            where: {
                followedId_followerId: {
                    followedId: followedId,
                    followerId: followerId,
                },
            },
            create: {
                followed: {
                    connect: {
                        id: followedId,
                    },
                },
                follower: {
                    connect: {
                        id: followerId,
                    },
                },
            },
            update: {},
        });
        return new FollowDTO(follow);
    }

    async findFollow(followerId: string, followedId: string): Promise<FollowDTO> {
        const follow = await this.db.follow.delete({
            where: {
                followedId_followerId: {
                    followedId: followedId,
                    followerId: followerId,
                },
            },
        });
        return new FollowDTO(follow);
    }

}