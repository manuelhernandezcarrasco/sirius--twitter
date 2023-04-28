import { ArrayMaxSize, IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreatePostInputDTO {
  @IsString()
  @IsNotEmpty()
  @MaxLength(240)
  content!: string;

  @IsOptional()
  @ArrayMaxSize(4)
  images?: string[];

  @IsOptional()
  @IsUUID()
  fatherPostId?: string;
}

export class PostDTO {

  constructor(post: PostDTO) {
    this.id = post.id;
    this.authorId = post.authorId;
    this.content = post.content;
    this.images = post.images;
    this.createdAt = post.createdAt;
    this.fatherPostId = post.fatherPostId;
    this.comments = post.comments;
  }

  id: string;
  authorId: string;
  content: string;
  images: string[];
  createdAt: Date;
  comments?: PostDTO[];
  fatherPostId?: string;
}

export class CreatePostResponseDTO extends PostDTO {
  constructor(post: CreatePostResponseDTO) {
    super(post)
    this.uploadURLs = post.uploadURLs;
  }

  uploadURLs?: string[];  
}
