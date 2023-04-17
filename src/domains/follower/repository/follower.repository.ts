import { FollowDTO } from "../dto";

export interface FollowerRepository {
    create(followerId: string, followedId: string): Promise<FollowDTO>;
    findFollow(followerId: string, followedId: string): Promise<FollowDTO>;
}