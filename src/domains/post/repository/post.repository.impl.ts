import { PrismaClient } from '@prisma/client';

import { CursorPagination } from '../../../types';

import { PostRepository } from '.';
import { CreatePostInputDTO, PostDTO } from '../dto';

export class PostRepositoryImpl implements PostRepository {
  constructor(private readonly db: PrismaClient) {}

  // get posts and 
  async getUserComments(userId: string, authorId: string): Promise<PostDTO[]> {
    const posts = await this.db.post.findMany({
      where: {
        comments: {
          some: {
            authorId: authorId,
          },
        },
      },
      select: {
        id: true,
        authorId: true,
        content: true,
        images: true,
        createdAt: true,
        comments: {
          where: {
            authorId: authorId,
          },
          select: {
            id: true,
            authorId: true,
            content: true,
            images: true,
            createdAt: true,
          },
        },
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
    const comments: PostDTO[] = [];
    posts.map(post => {
      if (!post.author.private || post.authorId === userId || post.author.followers) {
        comments.push(new PostDTO(post));
      }
    });
    return comments;
  }

  async create(userId: string, data: CreatePostInputDTO): Promise<PostDTO> {
    const post = await this.db.post.create({
      data: {
        content: data.content,
        images: data.images,
        author: {
          connect: {
            id: userId,
          },
        }, 
        fatherPost: data.fatherPostId? {
          connect: {
            id: data.fatherPostId,
          },
        } : undefined,
      },
    });
    return new PostDTO(post as PostDTO);
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
    return posts.map(post => new PostDTO(post as PostDTO));
  }

  async delete(postId: string): Promise<void> {
    await this.db.post.delete({
      where: {
        id: postId,
      },
    });
  }

  // get only posts where the user has a public profile, the user is following the post owner or the user is the post owner
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
        comments: {
          take: 10,
          select: {
            id: true,
            authorId: true,
            content: true,
            images: true,
            createdAt: true,
          },
          orderBy: {
            reactions: {
              _count: 'desc',
            },
          },
        },
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
    return post && ( userId && ( !post.author.private || post.authorId === userId || post.author.followers.length )) ? new PostDTO(post) : null;
  }

  // get only posts where the user has a public profile, the user is following the post owner or the user is the post owner
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
    return posts && ( !posts[0].author.private || posts[0].authorId === userId || posts[0].author.followers.length ) ? posts.map(post => new PostDTO(post)) : null;
  }
}
