import { NotFoundException } from '@utils/errors';
import { OffsetPagination } from 'types';
import { UserDTO } from '../dto';
import { UserRepository } from '../repository';
import { UserService } from './user.service';

export class UserServiceImpl implements UserService {
  constructor(private readonly repository: UserRepository) {}

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
