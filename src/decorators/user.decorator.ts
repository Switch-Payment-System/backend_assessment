import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface IUser {
  email: string;
  userType: string;
  id: string;
}

export const User = createParamDecorator<any, any, IUser>((_, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const { user } = request;

  return user as IUser;
});
