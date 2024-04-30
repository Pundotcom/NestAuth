import { Controller, Post, Request, UseGuards, Res, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { GoogleAuthGuard } from './google.auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() req, @Res({ passthrough: true }) res) {
    const { access_token } = await this.authService.login(req.user);
    res.cookie('access_token', access_token, {
      httpOnly: true,
    });
    return {
      message: 'login succusfully',
    };
  }

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleAuth(@Request() req) {
    // Initiates the Google OAuth process
  }

  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  async googleAuthRedirect(
    @Request() req,
    @Res({ passthrough: true }) res
  ) {
    const { accessToken } = await this.authService.googleLogin(req);
    res.cookie('access_token', accessToken, {
      httpOnly: true,
    });
    return {
      message: 'login succusfully',
    };
 
  }
}
