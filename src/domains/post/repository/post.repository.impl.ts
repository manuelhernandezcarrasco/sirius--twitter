import { PrismaClient } from '@prisma/client';

import { CursorPagination } from '@types';

import { PostRepository } from '.';
import { CreatePostInputDTO, PostDTO } from '../dto';

export class PostRepositoryImpl implements PostRepository {
  constructor(private readonly db: PrismaClient) {}

  async create(userId: string, data: CreatePostInputDTO): Promise<PostDTO> {
    const post = await this.db.post.create({
      data: {
        authorId: userId,
        ...data,
      },
    });
    return new PostDTO(post);
  }

  async getAllByDatePaginated(options: CursorPagination, userId: string): Promise<PostDTO[]> {
    const posts = await this.db.post.findMany({
      cursor: options.after || options.before ? {
        id: options.after ? options.after : options.before,
      }: undefined,
      skip: options.after || options.before ? 1 : undefined,
      take: options.limit ? (options.before ? -options.limit : options.limit) : undefined,
      orderBy: [
        {
          createdAt: 'desc',
        },
        {
          id: 'asc',
        },
      ],
      where: {
        OR: [
          {
            author: {
              private: false,
            },
          },
          {
            author: {
              private: true,
              followers: {
                some: {
                  followerId: userId,
                },
              },
            },
          },
        ]
      }
    });
    return posts.map(post => new PostDTO(post));
  }

  async delete(postId: string): Promise<void> {
    await this.db.post.delete({
      where: {
        id: postId,
      },
    });
  }

  async getById(postId: string, userId?: string): Promise<PostDTO | null> {
    const post = await this.db.post.findUnique({
      where: {
        id: postId,
      },
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
    });
    return post && ( userId && ( !post.author.private || post.author.followers.length )) ? new PostDTO(post) : null;
  }

  async getByAuthorId(userId: string, authorId: string, options: CursorPagination): Promise<PostDTO[] | null> {
    const posts = await this.db.post.findMany({
      cursor: options.before || options.after ? {
        id: options.after ? options.after : options.before,
      } : undefined,
      skip: options.after || options.before ? 1 : undefined,
      take: options.limit ? (options.before ? -options.limit : options.limit) : undefined,
      orderBy: [
        {
          createdAt: 'desc',
        },
        {
          id: 'asc',
        },
      ],
      where: {
        authorId,
      },
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
    });
    return ( !posts[0].author.private || posts[0].author.followers.length ) ? posts.map(post => new PostDTO(post)) : null;
  }
}
