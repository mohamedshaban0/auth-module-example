import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const Cookie = createParamDecorator(
    (cookie: string, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        return request?.cookies[cookie];
    },
);
