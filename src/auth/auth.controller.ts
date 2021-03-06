import { Body, Controller, Post, Req, Response } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { addDays } from 'date-fns';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthService } from './auth.service';

@ApiTags('Authorization')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Login and get tokens' })
  @Post('/login')
  async login(@Body() userDto: CreateUserDto, @Response() res) {
    const { user, accessToken, refreshToken } = await this.authService.login(
      userDto,
    );
    return res
      .cookie('refreshToken', refreshToken, {
        expires: addDays(new Date(), 60),
        sameSite: 'strict',
        httpOnly: true,
      })
      .json({ user, accessToken });
  }

  @ApiOperation({ summary: 'Refresh and get access token + user' })
  @Post('/refresh')
  async refresh(@Req() req, @Response() res) {
    const { user, accessToken } = await this.authService.refresh(req);
    return res.json({ user, accessToken });
  }

  @ApiOperation({ summary: 'Registration' })
  @Post('/registration')
  registration(@Body() userDto: CreateUserDto) {
    return this.authService.registration(userDto);
  }
}
