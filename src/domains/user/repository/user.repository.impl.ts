import { SignupInputDTO } from '@domains/auth/dto';
import { CreateMessageDTO } from '@domains/chat/dto';
import { PrismaClient } from '@prisma/client';
import { OffsetPagination } from '@types';
import { ExtendedUserDTO, UserDTO } from '../dto';
import { UserRepository } from './user.repository';

export class UserRepositoryImpl implements UserRepository {
  constructor(private readonly db: PrismaClient) {}

  async createMessage(userId: string, chatId: string, data: CreateMessageDTO): Promise<any> {
    await this.db.chat.update({
      where: {
        id: chatId,
      },
      data: {
        messages: {
          create: {
            senderId: userId,
            message: data.message,
            createAt: new Date(data.createdAt),
          },
        },
      },
    });
  }

  async createChat(userId: string, user_Id: string): Promise<any> {    
    const chat = await this.db.chat.create({
      data: {
        user1: {
          connect: {
            id: userId,
          },
        },
        user2: {
          connect: {
            id: user_Id,
          },
        },
      },
      select: {
        id: true,
        messages: {
          select: {
            message: true,
            senderId: true,
            createAt: true,
          },
          orderBy: {
            createAt: 'asc',
          },
        },
      }
    });
    return chat.id;
  }

  async verifyFollowage(userId: string, user_id: string): Promise<any> {
    return await this.db.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        followers: {
          where: {
            followedId: userId,
            followerId: user_id,
          },
          select: {
            id: true,
          },
        },
        follows: {
          where: {
            followerId: userId,
            followedId: user_id,
          },
          select: {
            id: true,
          },
        },
        chatsReceived: {
          where: {
            OR: [
              {
                user1Id: userId,
                user2Id: user_id,
              },
              {
                user1Id: user_id,
                user2Id: userId,
              },
            ],
          },
          select: {
            id: true,
            messages: {
              select: {
                createAt: true,
                senderId: true,
                message: true,
              },
              orderBy: {
                createAt: 'asc',
              },
            },
          },
        },
        chatsStarted: {
          where: {
            OR: [
              {
                user1Id: userId,
                user2Id: user_id,
              },
              {
                user1Id: user_id,
                user2Id: userId,
              },
            ],
          },
          select: {
            id: true,
            messages: {
              select: {
                createAt: true,
                senderId: true,
                message: true,
              },
              orderBy: {
                createAt: 'asc',
              },
            },
          },
        },  
      },
    });
  }

  async create(data: SignupInputDTO): Promise<UserDTO> {
    return await this.db.user.create({
      data,
    }).then(user => new UserDTO(user));
  }

  async getById(userId: any): Promise<UserDTO | null> {
    const user = await this.db.user.findUnique({
      where: {
        id: userId,
      },
    });
    return user ? new UserDTO(user) : null;
  }

  async delete(userId: any): Promise<void> {
    await this.db.user.delete({
      where: {
        id: userId,
      },
    });
  }

  async getRecommendedUsersPaginated(userId: string, options: OffsetPagination): Promise<UserDTO[]> {
    const users = await this.db.user.findMany({
      take: options.limit? options.limit : undefined,
      skip: options.skip? options.skip : undefined,
      orderBy: [
        {
          id: 'asc',
        },
      ],
      where: {
        followers: {
          some: {
            followerId: userId,
          },
        },
      },
      select: {
        id: true,
        name: true,
        follows: {
          select: {
            id: true,
            followed: {
              select: {
                id: true,
                name: true,
                createdAt: true,
                private: true,
                profilePicture: true,
              }
            }
          },
          where: {
            NOT: [
              {
                followed: {
                  followers: {
                    some: { 
                      followerId: userId,
                    },
                  }
                }
              }
            ]
          }
        }        
      }
    });
    const recomendations: UserDTO[] = [];
    users.map(user => {
      user.follows.map(recomendation => recomendations.push(new UserDTO(recomendation.followed)))
    });
    return recomendations;
  }

  async getByEmailOrUsername(email?: string, username?: string): Promise<ExtendedUserDTO | null> {
    const user = await this.db.user.findFirst({
      where: {
        OR: [
          {
            email,
          },
          {
            username,
          },
        ],
      },
    });
    return user ? new ExtendedUserDTO(user) : null;
  }
}
