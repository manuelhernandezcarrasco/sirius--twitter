import { IsEnum, IsNotEmpty } from "class-validator";

export class ReactionDTO {
    id: string;
    postId: string;
    reactorId: string;
    type: Reactions;
    createdAt: Date;
    
    constructor(reaction: ReactionDTO) {
        this.id = reaction.id;
        this.postId = reaction.postId;
        this.reactorId = reaction.reactorId;
        this.type = reaction.type;
        this.createdAt = reaction.createdAt;
    }

    
}

export enum Reactions {
    LIKE = 'LIKE', 
    RETWEET = 'RETWEET'
}

export class ManageReactionDTO {
    @IsNotEmpty()
    @IsEnum(Reactions)
    type!: string;
}