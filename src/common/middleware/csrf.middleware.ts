import { Injectable, NestMiddleware, ForbiddenException } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class CsrfMiddleware implements NestMiddleware {

    use(req: Request, res: Response, next: NextFunction) {

        //make sure to have token
        if (!req.session) {
            return next();
        }


        //generate new ones if no token yet
        if (!req.session.csrfToken) {
            req.session.csrfToken = randomBytes(24).toString('hex');
        }

        //Send token to frontend in respond  header
        res.setHeader('X-CSRF-Token', req.session.csrfToken);

        //validate only for risky methods
        const protectedMethods = ['POST', 'PUT', 'PATCH', 'DELETE'];
        if (protectedMethods.includes(req.method)) {
            const clientToken =
                req.headers['x-csrf-token'] ||
                (req.body && req.body._csrf) ||
                (req.query && req.query._csrf);

            if (clientToken !== req.session.csrfToken) {
                throw new ForbiddenException('Invalid CSRF token');
            }
        }

        next();

    }

}