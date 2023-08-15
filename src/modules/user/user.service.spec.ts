// import { Test, TestingModule } from '@nestjs/testing';
// import { getRepositoryToken } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { Users } from './entities/user.entity';
// import { UserService } from './user.service';

// describe('UserService', () => {
//   let userService: UserService;

//   const userRepositoryToken = getRepositoryToken(Users);
//   let userRepository: Repository<Users>;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         UserService,
//         {
//           provide: userRepositoryToken,
//           useClass: Repository,
//         },
//       ],
//     }).compile();

//     userService = module.get<UserService>(UserService);

//     userRepository = module.get<Repository<Users>>(userRepositoryToken);
//   });

//   describe('Testing <>', () => {
//     it('should ', async () => {});
//   });
// });
