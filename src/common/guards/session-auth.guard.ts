import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
@Injectable()
export class SessionAuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        if (!request.session || !request.session.user) {
            throw new UnauthorizedException('Not authenticated');
        }
        return true;
    }
}
