import { CreatePostInputDTO, CreatePostResponseDTO, PostDTO } from '../dto';

export interface PostService {
  getUserComments(userId: string, authorId: string): Promise<PostDTO[]>;
  createPost(userId: string, body: CreatePostInputDTO): Promise<CreatePostResponseDTO>;
  deletePost(userId: string, postId: string): Promise<void>;
  getPost(userId: string, postId: string): Promise<PostDTO>;
  getLatestPosts(userId: string, options: { limit?: number; before?: string; after?: string }): Promise<PostDTO[]>;
  getPostsByAuthor(userId: any, authorId: string, options: { limit?: number; before?: string; after?: string; }): Promise<PostDTO[]>;
}
