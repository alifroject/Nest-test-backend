import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly prisma: PrismaService,
    ) { }

    async register(data: any) {
        const hashedPassword = await bcrypt.hash(data.password, 10);
        return this.userService.create({ ...data, password: hashedPassword });
    }

    async login(email: string, password: string, session: any) {
        const user = await this.userService.findByEmail(email);
        if (!user) throw new UnauthorizedException('Invalid email or password');

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) throw new UnauthorizedException('Invalid email or password');

        // Store user in session
        if (session) {
            session.user = {
                id: user.id,
                email: user.email,
                role: user.role,
            };
        }

        return {
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
            },
        };
    }

    async logout(session: any) {
        return new Promise((resolve) => {
            if (session) {
                session.destroy((err) => {
                    if (err) {
                        console.error('Logout error:', err);
                    }
                    resolve({ message: 'Logged out successfully' });
                });
            } else {
                resolve({ message: 'Logged out successfully' });
            }
        });
    }

    async validateOAuthLogin(profile: any, session: any) {
        let user = await this.userService.findByEmail(profile.emails[0].value);

        if (!user) {
            user = await this.userService.create({
                firstName: profile.name.givenName,
                lastName: profile.name.familyName,
                email: profile.emails[0].value,
                role: 'user',
                password: 'oauth-placeholder-' + Math.random().toString(36),
            }) as User;
        }

        // Store user in session if session exists
        if (session) {
            session.user = {
                id: user.id,
                email: user.email,
                role: user.role,
            };
        }

        return { user };
    }

    async loginWithOAuth(user: User, session: any) {
        // Store user in session if session exists
        if (session) {
            session.user = {
                id: user.id,
                email: user.email,
                role: user.role,
            };
        }
        return { user };
    }
}