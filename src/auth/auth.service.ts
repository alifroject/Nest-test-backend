import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) { }

    // REGISTER: hash password before saving
    async register(data: any) {
        const hashedPassword = await bcrypt.hash(data.password, 10);
        return this.userService.create({ ...data, password: hashedPassword });
    }

    // LOGIN: verify password, then issue token
    async login(email: string, password: string) {
        const user = await this.userService.findByEmail(email);
        if (!user) throw new UnauthorizedException('Invalid email or password');

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid)
            throw new UnauthorizedException('Invalid email or password');

        const payload = { sub: user.id, email: user.email, role: user.role };

        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
            },
        };
    }


    async validateOAuthLogin(profile: any) {
        let user = await this.userService.findByEmail(profile.emails[0].value);

        if (!user) {
            user = await this.userService.create({
                firstName: profile.name.givenName,
                lastName: profile.name.familyName,
                email: profile.emails[0].value,
                role: 'user',
                password: 'oauth-placeholder', 
            }) as User;

        }

        // generate JWT
        const token = this.jwtService.sign({
            id: user!.id,
            email: user!.email,
            role: user!.role,
        });
        return { user, token };
    }
    // auth.service.ts
    async loginWithOAuth(user: User) {
        const token = this.jwtService.sign({
            id: user.id,
            email: user.email,
            role: user.role,
        });
        return { user, token };
    }


}
