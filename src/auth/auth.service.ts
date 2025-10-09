import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { access } from 'fs';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) {}

    async register(data: any) {
        const hashedpassword = await bcrypt.hash(data.password, 10);
        return this.userService.create({ ...data, password: hashedpassword});
    }

    async login(email: string, password: string) {
        const user = await this.userService.findByEmail(email);
        if(!user) throw new UnauthorizedException('Invalid credentials');

        const payload = {sub: user.id, role: user.role};
        return {
            access_token: this.jwtService.sign(payload)
        }

    }
}
