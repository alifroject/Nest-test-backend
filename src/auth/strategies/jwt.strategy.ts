import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'fallback-secret', 
    });
  }

  async validate(payload: any) {
    return { 
      id: payload.sub || payload.id, 
      email: payload.email,
      firstName: payload.firstName,
      lastName: payload.lastName,
      role: payload.role 
    };
  }
}