import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface UserDecodedTokenType {
  name: string;
  id: number;
  iat: number;
  exp: number;
}

export const User = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
