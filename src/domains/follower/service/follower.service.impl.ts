import { BadRequestException } from "@utils";
import { FollowDTO } from "../dto";
import { FollowerRepository } from "../repository";
import { FollowerService } from "./follower.service";

export class FollowerServiceImpl implements FollowerService {
    constructor(private readonly repository: FollowerRepository) {}

    async followUser(followerId: string, followedId: string): Promise<FollowDTO> {
        const follow = await this.repository.create(followerId, followedId);
        if (follow.createdAt.getDate() != new Date().getDate()) throw new BadRequestException("Already following");
        return follow;
    }
    
    async unfollowUser(followerId: string, followedId: string): Promise<FollowDTO> {
        const follow = await this.repository.findFollow(followerId, followedId);
        if (!follow.id) throw new BadRequestException("Not following user");
        return follow;
    }

}