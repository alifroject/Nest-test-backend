import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallback, StrategyOptionsWithRequest } from 'passport-google-oauth20';
import { AuthService } from "../auth.service";
import { Request } from 'express';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(private authService: AuthService) {
        super({
            clientID: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            callbackURL: 'http://localhost:3001/auth/google/callback',
            scope: ['email', 'profile'],
            passReqToCallback: true,
        } as unknown as StrategyOptionsWithRequest);
    }

    async validate(request: Request, accessToken: string, refreshToken: string, profile: any, done: VerifyCallback) {
        try {
            console.log('Google Profile:', profile); // Debug log
            console.log('Google Emails:', profile.emails); // Debug log
            console.log('Google Name:', profile.name); // Debug log

            const user = await this.authService.validateOAuthLogin(profile, request.session);
            done(null, user.user);
        } catch (error) {
            console.error('Google OAuth validation error:', error);
            done(error, false);
        }
    }
}