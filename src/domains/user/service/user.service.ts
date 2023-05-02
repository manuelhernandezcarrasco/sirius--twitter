import { CreateMessageDTO } from '@domains/chat/dto';
import { OffsetPagination } from '@types';
import { UserDTO } from '../dto';

export interface UserService {
  deleteUser(userId: any): Promise<void>;
  getUser(userId: any): Promise<UserDTO>;
  getUserRecommendations(userId: any, options: OffsetPagination): Promise<UserDTO[]>;
  verifyChat(userId: string, user_Id: string): Promise<any>;
  postMessage(userId: string, chatId: string, message: CreateMessageDTO): Promise<any>;
}
