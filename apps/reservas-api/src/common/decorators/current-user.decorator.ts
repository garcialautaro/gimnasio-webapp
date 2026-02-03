import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '@turnos/shared';

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): User | undefined => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
