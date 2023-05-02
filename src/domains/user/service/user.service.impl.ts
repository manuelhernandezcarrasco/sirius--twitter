import { CreateMessageDTO } from '@domains/chat/dto';
import { BadRequestException, NotFoundException } from '@utils/errors';
import { validate } from 'class-validator';
import { OffsetPagination } from 'types';
import { UserDTO } from '../dto';
import { UserRepository } from '../repository';
import { UserService } from './user.service';

export class UserServiceImpl implements UserService {
  constructor(private readonly repository: UserRepository) {}

  async postMessage(userId: string, chatId: string, message: CreateMessageDTO): Promise<{message: string, createdAt: string, senderId: string}> {
    validate(message);
    await this.repository.createMessage(userId, chatId, message);
    return {...message, senderId: userId}
  }

  async verifyChat(userId: string, user_Id: string): Promise<{id: string, messages?: [{senderId: string, createdAt: Date, message: string}]}> {

    const user = await this.repository.verifyFollowage(userId, user_Id);    
    if (!user.follows[0] || !user.followers[0]) {
      throw new BadRequestException('user not following each other');
    }

    if (!(user.chatsReceived[0] || user.chatsStarted[0])) {
      return await this.repository.createChat(userId, user_Id);
    }    
    
    else return user.chatsReceived[0] ?  user.chatsReceived[0] : user.chatsStarted[0];
  }

  async getUser(userId: any): Promise<UserDTO> {
    const user = await this.repository.getById(userId);
    if (!user) throw new NotFoundException('user');
    return user;
  }

  getUserRecommendations(userId: any, options: OffsetPagination): Promise<UserDTO[]> {
    return this.repository.getRecommendedUsersPaginated(userId, options);
  }

  deleteUser(userId: any): Promise<void> {
    return this.repository.delete(userId);
  }
}
