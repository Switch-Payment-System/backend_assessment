import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from './user.entity';
import { ErrorHelper } from '../../utils';
import { PaginationDto } from '../../queries/page-options';
import { PaginationMetadataDto } from '../../queries/page-meta';
import { PaginationResultDto } from '../../queries';

@Injectable()
export class UserService {
  constructor(@InjectRepository(Users) private usersRepo: Repository<Users>) {}

  async createWaitlistUser(payload: any): Promise<any> {
    const user = await this.usersRepo.save(this.usersRepo.create(payload));
    return user;
  }

  async getAllWaitlistUser(): Promise<Users[]> {
    const user = await this.usersRepo.find({ where: { isWaitlistUser: true, deletedAt: null } });
    return user;
  }

  async waitlistUsers(paginationDto: PaginationDto): Promise<any> {
    const [waitlistUsers, count] = await this.usersRepo.findAndCount({
      where: { deletedAt: null },
      order: { createdAt: paginationDto.order },
      skip: paginationDto.skip,
      take: paginationDto.limit,
    });

    const result = waitlistUsers.map(p => ({
      id: p.id,
      email: p.email,
    }));

    const pageMetaDto = new PaginationMetadataDto({
      itemCount: count,
      pageOptionsDto: paginationDto,
    });

    return new PaginationResultDto(result, pageMetaDto);
  }

  async deleteWaitlistUser(id: string) {
    const waitlistUser = await this.usersRepo.findOne({
      where: { id },
    });

    if (!waitlistUser) {
      ErrorHelper.NotFoundException('User not found');
    }

    await this.usersRepo.delete(waitlistUser.id);

    return [];
  }
}
