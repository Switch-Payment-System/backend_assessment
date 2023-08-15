import { Repository } from 'typeorm';
import { CustomRepository } from '../../typeorm-extension';
import { Users } from './user.entity';

@CustomRepository(Users)
export class UsersRepository extends Repository<Users> {
  async findByEmail(email: string): Promise<Users> {
    return this.findOne({
      where: {
        email,
        deletedAt: null,
      },
    });
  }

  async findByPhoneNumber(phoneNumber: string): Promise<Users> {
    return this.findOne({
      where: {
        phoneNumber,
        deletedAt: null,
      },
    });
  }

  async findById(id: string): Promise<Users> {
    return this.findOne({
      where: {
        id,
        deletedAt: null,
      },
    });
  }

  async findByEmailOrPhoneNumber(userIdentifier: string): Promise<Users> {
    return this.findOne({
      where: [
        {
          email: userIdentifier,
          deletedAt: null,
        },
        {
          phoneNumber: userIdentifier,
          deletedAt: null,
        },
      ],
    });
  }
}
