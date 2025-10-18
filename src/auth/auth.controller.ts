import { Body, Controller, Get, Post, UseGuards, Req, Res, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Public } from '../common/decorators/public.decorator';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { SessionAuthGuard } from 'src/common/guards/session-auth.guard';

@UseGuards(ThrottlerGuard)
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Get('google')
    @Public()
    @UseGuards(AuthGuard('google'))
    async googleLogin() {
    }

    @Get('google/callback')
    @Public()
    @UseGuards(AuthGuard('google'))
    async googleCallback(@Req() req, @Res() res: any) {
        try {
            console.log('Session in callback:', req.session);

            if (!req.user) {
                throw new UnauthorizedException('Google authentication failed');
            }

            // Pass the session to loginWithOAuth
            const result = await this.authService.loginWithOAuth(req.user, req.session);

            // Check if session exists before calling save
            if (req.session) {
                req.session.save((err) => {
                    if (err) {
                        console.error('Session save error:', err);
                        return res.redirect('http://localhost:3002/auth/error?message=session_error');
                    }
                    console.log('Session saved, redirecting to dashboard');
                    res.redirect('http://localhost:3002/auth/callback');
                });
            } else {
                console.error('No session available in callback');
                res.redirect('http://localhost:3002/auth/error?message=no_session');
            }
        } catch (error) {
            console.error('Google OAuth callback error:', error);
            res.redirect('http://localhost:3002/auth/error?message=auth_failed');
        }
    }

    @Post('register')
    @Public()
    async register(@Body() body: any) {
        return this.authService.register(body);
    }


    @Post('login')
    @Public()
    async login(@Body() body: { email: string; password: string }, @Req() req: any) {
        const result = await this.authService.login(body.email, body.password, req.session);

        req.session.user = result.user;

        await new Promise<void>((resolve, reject) => {
            req.session.save((err) => {
                if (err) return reject(err);
                resolve();
            });
        });

        console.log('Session after login:', req.session);
        return result;
    }


    @Get('me')
    @UseGuards(SessionAuthGuard)
    async getProfile(@Req() req: any) {
        console.log('Session in /me:', req.session);
        if (!req.session?.user) {
            throw new UnauthorizedException('Not authenticated');
        }
        return { user: req.session.user };
    }

    @Post('logout')
    async logout(@Req() req: any) {
        return this.authService.logout(req.session);
    }
}