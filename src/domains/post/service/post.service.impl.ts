import { CreatePostInputDTO, CreatePostResponseDTO, PostDTO } from '../dto';
import { PostRepository } from '../repository';
import { PostService } from '.';
import { validate } from 'class-validator';
import { BadRequestException, ForbiddenException, NotFoundException } from '../../../utils';
import { CursorPagination } from '../../../types';
import { BucketFolders, generateUploadURL } from '../../../utils/s3';

export class PostServiceImpl implements PostService {
  constructor(private readonly repository: PostRepository) {}

  async getUserComments(userId: string, authorId: string): Promise<PostDTO[]> {
    const comments = await this.repository.getUserComments(userId, authorId);
    if (!comments) throw new NotFoundException('comment');
    return comments;
  }

  async createPost(userId: string, data: CreatePostInputDTO): Promise<CreatePostResponseDTO> {
    validate(data);
    let uploadURLs: string[] = [];
    data.images?.map(async(image) => {
      uploadURLs.push(await generateUploadURL(image, BucketFolders.POST));
    })
    const post = await this.repository.create(userId, data);
    return {...post, uploadURLs: data.images? uploadURLs : undefined}
  }

  async deletePost(userId: string, postId: string): Promise<void> {
    const post = await this.repository.getById(postId);
    if (!post) throw new NotFoundException('post');
    if (post.authorId !== userId) throw new ForbiddenException();
    return this.repository.delete(postId);
  }

  async getPost(userId: string, postId: string): Promise<PostDTO> {
    const post = await this.repository.getById(postId, userId);
    if (!post) throw new NotFoundException('post');
    return post;
  }

  getLatestPosts(userId: string, options: CursorPagination): Promise<PostDTO[]> {
    return this.repository.getAllByDatePaginated(options, userId);
  }

  async getPostsByAuthor(userId: any, authorId: string, options: CursorPagination): Promise<PostDTO[]> {
    const posts = await this.repository.getByAuthorId(userId, authorId, options);
    if (!posts) throw new NotFoundException('post');
    return posts;
  }
}
