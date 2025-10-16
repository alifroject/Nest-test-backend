import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import type { Request } from 'express';
@Injectable()
export class AdminGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const req = context.switchToHttp().getRequest<Request>();
        const user = req.session?.user;

        if (!user) {
            throw new ForbiddenException('No session found');
        }

        if (user.role !== 'ADMIN') {
            throw new ForbiddenException('Access denied: Admins only');
        }

        return true;
    }
}