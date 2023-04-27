import { CursorPagination } from '@types';
import { CreatePostInputDTO, PostDTO } from '../dto';

export interface PostRepository {
  getUserComments(userId: string, authorId: string): Promise<PostDTO[]>;
  create(userId: string, data: CreatePostInputDTO): Promise<PostDTO>;
  getAllByDatePaginated(options: CursorPagination, userId: string): Promise<PostDTO[]>;
  delete(postId: string): Promise<void>;
  getById(postId: string, userId?: string): Promise<PostDTO | null>;
  getByAuthorId(userId: string, authorId: string, options: CursorPagination): Promise<PostDTO[] | null>;
}
