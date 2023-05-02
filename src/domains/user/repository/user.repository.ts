import { SignupInputDTO } from '@domains/auth/dto';
import { CreateMessageDTO } from '@domains/chat/dto';
import { OffsetPagination } from '@types';
import { ExtendedUserDTO, UserDTO } from '../dto';

export interface UserRepository {
  createMessage(userId: string, chatId: string, data: CreateMessageDTO): Promise<any>;
  create(data: SignupInputDTO): Promise<UserDTO>;
  delete(userId: string): Promise<void>;
  getRecommendedUsersPaginated(userId: string, options: OffsetPagination): Promise<UserDTO[]>;
  getById(userId: string): Promise<UserDTO | null>;
  getByEmailOrUsername(email?: string, username?: string): Promise<ExtendedUserDTO | null>;
  verifyFollowage(userId: string, user_id: string): Promise<any>;
  createChat(userId: string, user_Id: string): Promise<any>;
}
