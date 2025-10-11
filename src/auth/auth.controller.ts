import { Body, Controller, Get, Post, UseGuards, Req, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Public } from '../common/decorators/public.decorator';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Get('google')
    @Public()
    @UseGuards(AuthGuard('google'))
    async googleLogin() {
        // This automatically redirects to Google
    }

    @Get('google/callback')
    @Public() 
    @UseGuards(AuthGuard('google'))
    async googleCallback(@Req() req, @Res() res: any) {
        const result = await this.authService.loginWithOAuth(req.user);
        res.redirect(`http://localhost:3000/auth/callback?token=${result.token}`);
    }

    @Post('register')
    @Public() 
    async register(@Body() body: any) {
        return this.authService.register(body);
    }

    @Post('login')
    @Public() 
    async login(@Body() body: { email: string; password: string }) {
        return this.authService.login(body.email, body.password);
    }
}